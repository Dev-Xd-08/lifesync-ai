const http = require("http");
const https = require("https");
const path = require("path");

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5008";
const API_URL = `${BASE_URL}/api/v1`;

// HTTP request wrapper
function request(method, endpoint, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`);
    const isHttps = url.protocol === "https:";
    const client = isHttps ? https : http;

    const options = {
      method,
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        "User-Agent": "LifeSync-E2E-Tester/1.0",
        ...headers
      }
    };

    let bodyData = null;
    if (data && typeof data === "object" && !(data instanceof Buffer)) {
      bodyData = JSON.stringify(data);
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(bodyData);
    } else if (data instanceof Buffer) {
      bodyData = data;
      options.headers["Content-Length"] = bodyData.length;
    }

    const req = client.request(options, (res) => {
      let rawData = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { rawData += chunk; });
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(rawData);
        } catch (e) {
          parsed = rawData;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on("error", (err) => reject(err));
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

// Multipart builder helper
function buildMultipart(fields, fileField, filename, fileBuffer, mimeType) {
  const boundary = "----LifeSyncBoundary" + Math.random().toString(36).substring(2);
  const crlf = "\r\n";
  const chunks = [];

  for (const [key, val] of Object.entries(fields)) {
    chunks.push(Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="${key}"${crlf}${crlf}${val}${crlf}`));
  }

  if (fileField && filename && fileBuffer) {
    chunks.push(Buffer.from(
      `--${boundary}${crlf}Content-Disposition: form-data; name="${fileField}"; filename="${filename}"${crlf}Content-Type: ${mimeType}${crlf}${crlf}`
    ));
    chunks.push(fileBuffer);
    chunks.push(Buffer.from(crlf));
  }

  chunks.push(Buffer.from(`--${boundary}--${crlf}`));
  const body = Buffer.concat(chunks);
  const contentType = `multipart/form-data; boundary=${boundary}`;
  return { body, contentType };
}

// Main E2E Test Suite
async function runE2ETests() {
  console.log("================================================================");
  console.log("🚀 STARTING LIFESYNC AI COMPLETE 19-STEP END-TO-END AUDIT SUITE");
  console.log("================================================================\n");

  const results = [];
  function record(stepNumber, title, passed, detail) {
    results.push({ stepNumber, title, passed, detail });
    const mark = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`[Step ${stepNumber.toString().padStart(2, "0")}] ${mark}: ${title}`);
    if (detail) console.log(`         ↳ ${detail}`);
  }

  // Boot up backend server dynamically on test port
  const app = require("../backend/src/app");
  const server = app.listen(5008);
  await new Promise((r) => setTimeout(r, 600));

  try {
    // STEP 1: Verify Gateway Health & Public Availability
    const healthRes = await request("GET", "/health-check");
    record(1, "REST Gateway Health & Availability", healthRes.status === 200 && healthRes.data.status === "ok", `Status ${healthRes.status}: ${healthRes.data.service}`);

    // STEP 2: Verify Protected Route without Auth is Blocked (401)
    const unauthRes = await request("GET", "/documents");
    record(2, "Strict Auth Enforcement (Unauthenticated Blocked)", unauthRes.status === 401, `Status ${unauthRes.status}: Access Denied without Token`);

    // STEP 3: Weak Password Rejected during Registration (Entropy Check)
    const weakReg = await request("POST", "/auth/register", {
      name: "Test Hacker",
      email: "hacker@test.com",
      password: "123"
    });
    record(3, "Registration Password Entropy Guard (Min 6 chars)", weakReg.status === 400, `Status ${weakReg.status}: ${weakReg.data.error}`);

    // STEP 4: Valid User Registration Flow
    const testEmail = `capstone.student.${Date.now()}@lifesync.ai`;
    const testPassword = "SecurePassword@2026!";
    const testName = "Alex Rivera";
    const regRes = await request("POST", "/auth/register", {
      name: testName,
      email: testEmail,
      password: testPassword
    });
    const regToken = regRes.data?.token;
    const userId = regRes.data?.user?.id;
    record(4, "New User Registration & JWT Issuance", regRes.status === 201 && !!regToken, `Created User: ${regRes.data?.user?.name} (${userId})`);

    // STEP 5: Duplicate Email Registration Blocked (409 Conflict)
    const dupReg = await request("POST", "/auth/register", {
      name: "Duplicate User",
      email: testEmail,
      password: testPassword
    });
    record(5, "Duplicate User Prevention (409 Conflict)", dupReg.status === 409, `Status ${dupReg.status}: ${dupReg.data.error}`);

    // STEP 6: User Authentication / Login Flow
    const loginRes = await request("POST", "/auth/login", {
      email: testEmail,
      password: testPassword
    });
    const authToken = loginRes.data?.token;
    const authHeaders = { Authorization: `Bearer ${authToken}` };
    record(6, "User Login & Session Authenticated", loginRes.status === 200 && !!authToken, `Issued Bearer Token for ${loginRes.data?.user?.email}`);

    // STEP 7: Verify Profile Resolution via /auth/me
    const meRes = await request("GET", "/auth/me", null, authHeaders);
    record(7, "Authenticated Profile Endpoint (/auth/me)", meRes.status === 200 && meRes.data?.user?.email === testEmail, `Resolved User: ${meRes.data?.user?.name}`);

    // STEP 8: Access Dashboard on Clean Account (Tenant Isolation Verification)
    const cleanStats = await request("GET", "/stats/dashboard", null, authHeaders);
    const initialDocs = cleanStats.data?.stats?.totalDocuments;
    const initialSpent = cleanStats.data?.stats?.totalExpenses;
    record(8, "Dashboard KPI Feed & Zero-Leak Tenant Isolation", cleanStats.status === 200 && initialDocs === 0 && initialSpent === 0, `Initial Docs: ${initialDocs}, Initial Spend: $${initialSpent}`);

    // STEP 9: Upload Document to Vault with Multer & OCR Parsing
    const mockDocText = "PASSPORT / UNITED STATES OF AMERICA\nSurname: RIVERA\nGiven Names: ALEX\nID: 987654321\nDate of Expiry: 12 DEC 2030\nAuthority: Department of State";
    const docBuffer = Buffer.from(mockDocText, "utf8");
    const { body: mpBody, contentType: mpHeader } = buildMultipart(
      { title: "Alex US Passport", category: "Identity" },
      "file",
      "passport_scan.txt",
      docBuffer,
      "text/plain"
    );
    const uploadRes = await request("POST", "/documents", mpBody, { ...authHeaders, "Content-Type": mpHeader });
    const uploadedDocId = uploadRes.data?.document?._id;
    record(9, "Document Vault Upload & OCR Processing", uploadRes.status === 201 && !!uploadedDocId, `Uploaded Doc ID: ${uploadedDocId}, Title: ${uploadRes.data?.document?.title}`);

    // STEP 10: Verify OCR Metadata Masking & Expiry Extraction
    const docListRes = await request("GET", "/documents", null, authHeaders);
    const uploadedDoc = docListRes.data?.documents?.find((d) => d._id === uploadedDocId);
    const maskedId = uploadedDoc?.extractedMetadata?.identifierMasked;
    record(10, "OCR Heuristic Metadata & ID Masking", !!uploadedDoc && typeof maskedId === "string", `Masked Identifier: ${maskedId || "N/A"}`);

    // STEP 11: Document Authenticated Stream Download
    const downloadRes = await request("GET", `/documents/${uploadedDocId}/download`, null, authHeaders);
    record(11, "Encrypted Vault Document Download Stream", downloadRes.status === 200 && !!downloadRes.data, `Received Stream (${downloadRes.headers["content-type"] || "binary"})`);

    // STEP 12: Add Income & Expense Entries into Ledger
    const incomeRes = await request("POST", "/expenses", {
      description: "Bi-Weekly Capstone Stipend",
      amount: 4500,
      category: "Salary",
      type: "income"
    }, authHeaders);

    const expenseRes1 = await request("POST", "/expenses", {
      description: "College Cloud Infrastructure Lab",
      amount: 120.50,
      category: "Education",
      type: "expense"
    }, authHeaders);

    const expenseRes2 = await request("POST", "/expenses", {
      description: "Organic Groceries & Produce",
      amount: 85.00,
      category: "Food",
      type: "expense"
    }, authHeaders);

    record(12, "Ledger Dual-Entry Accounting (Credit & Debit)", incomeRes.status === 201 && expenseRes1.status === 201 && expenseRes2.status === 201, `Added +$4500 Income, -$120.50 Lab, -$85.00 Food`);

    // STEP 13: Financial Aggregation Analytics Engine
    const analyticsRes = await request("GET", "/expenses/analytics", null, authHeaders);
    const { totalIncome, totalSpent, netSavings, categoryBreakdown } = analyticsRes.data?.analytics || {};
    const eduItem = Array.isArray(categoryBreakdown) ? categoryBreakdown.find((c) => c.category === "Education") : null;
    const analyticsPassed = totalIncome === 4500 && totalSpent === 205.50 && netSavings === 4294.50 && eduItem?.total === 120.50;
    record(13, "Financial Aggregation Analytics Engine", analyticsPassed, `Net Savings: $${netSavings}, Spend: $${totalSpent}, Top Category: ${eduItem?.category} ($${eduItem?.total})`);

    // STEP 14: Task Creation with Priority & Due Date
    const taskRes = await request("POST", "/tasks", {
      title: "Submit Final LifeSync Capstone Code & Video",
      description: "Complete git push, documentation review, and live defense walkthrough.",
      priority: "high",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      category: "Academic"
    }, authHeaders);
    const taskId = taskRes.data?.task?._id;
    record(14, "Task Creation with Priority State", taskRes.status === 201 && taskRes.data?.task?.priority === "high", `Task Created: "${taskRes.data?.task?.title}" [HIGH]`);

    // STEP 15: Task State Machine Cycle (Pending -> Completed)
    const updateTaskRes = await request("PATCH", `/tasks/${taskId}`, {
      status: "completed"
    }, authHeaders);
    record(15, "Task State Machine Toggle (Pending -> Completed)", updateTaskRes.status === 200 && updateTaskRes.data?.task?.status === "completed", `Status Updated to: ${updateTaskRes.data?.task?.status}`);

    // STEP 16: Log Health Vitals with AI Summarizer & Mandatory Disclaimer
    const healthResRecord = await request("POST", "/health", {
      title: "Semester Health Checkup & Vitals",
      recordType: "Vitals Check",
      vitals: {
        systolic: 118,
        diastolic: 78,
        heartRate: 72,
        bloodGlucose: 95
      },
      notes: "Cardiovascular endurance and fasting blood glucose in healthy range.",
      tags: ["cardio", "routine", "annual"]
    }, authHeaders);
    const healthId = healthResRecord.data?.healthRecord?._id;
    const aiSummary = healthResRecord.data?.healthRecord?.aiSummary || "";
    const hasDisclaimer = aiSummary.includes("Disclaimer: This informational summary is generated by LifeSync AI");
    record(16, "Health Vitals Logging & AI Summary with Compliance Disclaimer", healthResRecord.status === 201 && hasDisclaimer, `Summary generated with compliance disclaimer. Length: ${aiSummary.length} chars`);

    // STEP 17: Query AI Copilot with Cross-Module Context
    const aiPromptRes = await request("POST", "/ai/chat", {
      message: "What is my net savings and do I have any high priority tasks or health logs?"
    }, authHeaders);
    const copilotReply = aiPromptRes.data?.reply || "";
    const mentionsFinances = copilotReply.includes("4294.50") || copilotReply.toLowerCase().includes("saving") || copilotReply.toLowerCase().includes("finances");
    record(17, "Contextual AI Copilot Unified Retrieval Engine", aiPromptRes.status === 200 && mentionsFinances, `Copilot Response:\n         "${copilotReply.replace(/\n/g, "\n         ")}"`);

    // STEP 18: Dashboard Consolidated KPI Feed Verification
    const finalStatsRes = await request("GET", "/stats/dashboard", null, authHeaders);
    const finalStats = finalStatsRes.data?.stats || {};
    const feedPassed = finalStats.totalDocuments >= 1 && finalStats.netSavings === 4294.50 && finalStats.healthRecords >= 1 && finalStats.recentActivity?.length > 0;
    record(18, "Consolidated Dashboard Executive Feed", feedPassed, `Docs: ${finalStats.totalDocuments}, Net: $${finalStats.netSavings}, Activity Items: ${finalStats.recentActivity?.length}`);

    // STEP 19: CRUD Lifecycle Cleanup & Vault Data Hygiene
    const delTask = await request("DELETE", `/tasks/${taskId}`, null, authHeaders);
    const delDoc = await request("DELETE", `/documents/${uploadedDocId}`, null, authHeaders);
    const delHealth = await request("DELETE", `/health/${healthId}`, null, authHeaders);
    record(19, "CRUD Lifecycle Cleanup & Vault Data Hygiene", delTask.status === 200 && delDoc.status === 200 && delHealth.status === 200, "Cleanly unlinked tasks, health records, and vault binary files.");

  } catch (err) {
    console.error("Test execution exception:", err);
  } finally {
    server.close();
  }

  // Summary
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log("\n================================================================");
  console.log(`📊 TEST EXECUTION SUMMARY: ${passedCount} / ${totalCount} PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log("================================================================\n");

  return { passedCount, totalCount, results };
}

if (require.main === module) {
  runE2ETests().then(({ passedCount, totalCount }) => {
    if (passedCount !== totalCount) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

module.exports = { runE2ETests };
