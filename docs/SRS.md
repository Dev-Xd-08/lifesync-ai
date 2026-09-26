# 📋 Software Requirements Specification (SRS)
## Project Name: LifeSync AI
### Autonomous Digital Life Management & Personal Operations Platform

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional and non-functional requirements for **LifeSync AI**. LifeSync AI is an integrated, secure personal data platform engineered to eliminate personal administrative silos across financial transactions, identification documents, medical reports, and task deadlines through automated optical character recognition (OCR) and autonomous large language model (LLM) context retrieval.

### 1.2 Scope
LifeSync AI provides an end-to-end, multi-tenant digital life platform. Users securely manage:
1. Encrypted documents with automatic OCR field parsing (issuers, dates, masked identifiers).
2. A dual-entry financial ledger with MongoDB aggregation analysis.
3. Health logs and clinical biometric vitals with plain-language medical summarization.
4. Tasks with state machine tracking and countdown deadlines.
5. An intelligent LifeSync Copilot capable of cross-domain querying.

---

## 2. Functional Requirements

### 2.1 Authentication & Multi-Tenancy (FR-AUTH)
- **FR-AUTH-1:** The system shall register users using full name, email, and password.
- **FR-AUTH-2:** Passwords must meet minimum entropy standards (minimum 6 characters) and be hashed using Bcrypt with a minimum of 10 salt rounds.
- **FR-AUTH-3:** The system shall issue stateless JSON Web Tokens (Bearer auth) upon successful login.
- **FR-AUTH-4:** Every database query shall strictly enforce tenant isolation:
  $$\text{Query Filter} = \{\, \_id: \text{resourceId},\; userId: \text{req.user.id} \,\}$$

### 2.2 Document Vault & OCR Pipeline (FR-DOC)
- **FR-DOC-1:** The system shall accept multipart file uploads (PDF, PNG, JPG, TXT) up to 15MB.
- **FR-DOC-2:** The file processing pipeline shall store files on disk using cryptographically random UUID file keys (`crypto.randomUUID()`) to prevent original filename exposure.
- **FR-DOC-3:** Uploaded documents shall pass to Tesseract OCR to extract raw text buffers.
- **FR-DOC-4:** Heuristic NLP parsing shall identify document categories, issuers, issue dates, expiry dates, and masked identifiers.
- **FR-DOC-5:** Authenticated users shall be able to download their uploaded files via protected streaming routes.

### 2.3 Financial Ledger & Aggregation (FR-EXP)
- **FR-EXP-1:** The system shall support recording income (credit) and expense (debit) transactions with amounts, categories, and timestamps.
- **FR-EXP-2:** The system shall execute database aggregation pipelines to group expenses by category and calculate total spent, total income, and net savings.
- **FR-EXP-3:** Users shall be able to filter transactions by category and transaction type.

### 2.4 Health Records & Medical Summarization (FR-HLT)
- **FR-HLT-1:** The system shall allow users to log biometric metrics (systolic/diastolic blood pressure, resting heart rate, blood glucose, weight) and clinical notes.
- **FR-HLT-2:** The system shall synthesize plain-language informational summaries of recorded vitals.
- **FR-HLT-3:** All medical summaries must strictly include an informational medical disclaimer stating that the output does not constitute medical diagnosis or clinical treatment advice.

### 2.5 Task & Reminder Engine (FR-TSK)
- **FR-TSK-1:** The system shall provide a task state machine supporting `pending`, `in_progress`, and `completed` states.
- **FR-TSK-2:** Tasks shall support priority classification (`high`, `medium`, `low`) and due date scheduling.
- **FR-TSK-3:** The dashboard shall highlight upcoming and urgent deadlines.

### 2.6 Contextual AI Assistant (FR-AI)
- **FR-AI-1:** The LifeSync Copilot shall answer natural-language inquiries by aggregating the user's live documents, transactions, tasks, and vitals as context.
- **FR-AI-2:** The assistant shall support Google Gemini API integration and an intelligent offline fallback engine.

---

## 3. Non-Functional Requirements

### 3.1 Security (NFR-SEC)
- **NFR-SEC-1:** All communication between client and server must support TLS/HTTPS encryption.
- **NFR-SEC-2:** HTTP security headers (Content Security Policy, X-Frame-Options, HSTS) must be enforced via Helmet middleware.
- **NFR-SEC-3:** API rate limiting must restrict brute-force attacks by limiting requests to 300 requests per 15 minutes per IP.
- **NFR-SEC-4:** Sensitive identification numbers must be stored and displayed in masked format (`XXXX-XXXX-1234`).

### 3.2 Reliability & Fault Tolerance (NFR-REL)
- **NFR-REL-1:** If the MongoDB server is unavailable, the backend must gracefully transition to an in-memory/fallback store without crashing the application.
- **NFR-REL-2:** If the external AI API is unreachable, the system must utilize its local reasoning engine to answer queries.

### 3.3 Usability & Performance (NFR-PRF)
- **NFR-PRF-1:** Average REST API response time under local conditions must be under 300ms.
- **NFR-PRF-2:** The user interface must be fully responsive across mobile, tablet, and desktop viewports.
