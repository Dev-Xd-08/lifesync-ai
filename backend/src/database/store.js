const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { getMongoStatus } = require("../config/db");
const User = require("../models/User");
const Document = require("../models/Document");
const Expense = require("../models/Expense");
const HealthRecord = require("../models/HealthRecord");
const Task = require("../models/Task");

// Local JSON backup path for persistent fallback
const DB_FILE = path.join(__dirname, "../../data/fallback_db.json");

// Ensure directory exists
const ensureDataDir = () => {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Seed demo data
const getInitialSeed = () => {
  const demoUserId = "64f1a2b3c4d5e6f7a8b9c0d1";
  const defaultPasswordHash = bcrypt.hashSync("LifeSync@2026", 10);

  return {
    users: [
      {
        _id: demoUserId,
        name: "Alex Vance",
        email: "demo@lifesync.ai",
        passwordHash: defaultPasswordHash,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        preferences: { currency: "USD", notificationsEnabled: true },
        createdAt: new Date("2026-09-01T10:00:00Z"),
        updatedAt: new Date("2026-09-01T10:00:00Z")
      }
    ],
    documents: [
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d2",
        userId: demoUserId,
        title: "Federal Tax Return 2025",
        category: "Financial",
        fileUrl: "/api/v1/documents/64f1a2b3c4d5e6f7a8b9c0d2/download",
        fileKey: "tax_return_2025.pdf",
        originalName: "Tax_Return_2025.pdf",
        fileSizeBytes: 2450000,
        mimeType: "application/pdf",
        extractedMetadata: {
          issuer: "Internal Revenue Service",
          identifierMasked: "XXX-XX-4819",
          issueDate: new Date("2025-04-15"),
          expiryDate: null,
          rawOcrText: "FORM 1040 U.S. Individual Income Tax Return 2025 Total Income $84,200",
          confidenceScore: 94.5
        },
        createdAt: new Date("2026-09-02T14:30:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d3",
        userId: demoUserId,
        title: "Comprehensive Health Insurance Policy",
        category: "Medical",
        fileUrl: "/api/v1/documents/64f1a2b3c4d5e6f7a8b9c0d3/download",
        fileKey: "health_insurance_policy.pdf",
        originalName: "Health_Insurance_Policy.pdf",
        fileSizeBytes: 1180000,
        mimeType: "application/pdf",
        extractedMetadata: {
          issuer: "Apex Healthcare Assurance",
          identifierMasked: "POL-XXXX-9902",
          issueDate: new Date("2026-01-01"),
          expiryDate: new Date("2027-01-01"),
          rawOcrText: "POLICY NUMBER: POL-8821-9902 COVERAGE: FULL COMPREHENSIVE EXPIRY: 2027-01-01",
          confidenceScore: 96.2
        },
        createdAt: new Date("2026-09-05T09:15:00Z")
      }
    ],
    expenses: [
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d4",
        userId: demoUserId,
        type: "income",
        category: "Salary",
        amount: 4800.0,
        currency: "USD",
        date: new Date("2026-09-01T09:00:00Z"),
        description: "Primary Software Consultant Retainer",
        createdAt: new Date("2026-09-01T09:00:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d5",
        userId: demoUserId,
        type: "expense",
        category: "Housing",
        amount: 1450.0,
        currency: "USD",
        date: new Date("2026-09-02T11:00:00Z"),
        description: "Apartment Rent & Building Maintenance",
        createdAt: new Date("2026-09-02T11:00:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d6",
        userId: demoUserId,
        type: "expense",
        category: "Food",
        amount: 145.2,
        currency: "USD",
        date: new Date("2026-09-08T18:20:00Z"),
        description: "Whole Foods Organic Groceries",
        createdAt: new Date("2026-09-08T18:20:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d7",
        userId: demoUserId,
        type: "expense",
        category: "Utilities",
        amount: 85.5,
        currency: "USD",
        date: new Date("2026-09-12T15:45:00Z"),
        description: "Gigabit Fiber Internet & Cloud Hosting",
        createdAt: new Date("2026-09-12T15:45:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d8",
        userId: demoUserId,
        type: "expense",
        category: "Medical",
        amount: 75.0,
        currency: "USD",
        date: new Date("2026-09-15T10:30:00Z"),
        description: "Routine Dental Cleaning Copay",
        createdAt: new Date("2026-09-15T10:30:00Z")
      }
    ],
    healthRecords: [
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0d9",
        userId: demoUserId,
        title: "Annual Preventative Metabolic Panel",
        recordType: "Lab Report",
        recordDate: new Date("2026-08-20T08:00:00Z"),
        aiSummary: "Fasting Blood Glucose 88 mg/dL (Normal). Total Cholesterol 178 mg/dL (Desirable range). Kidney and liver biomarker filtration levels normal.",
        tags: ["Bloodwork", "Metabolic", "Annual"],
        vitals: {
          systolic: 118,
          diastolic: 78,
          heartRate: 68,
          bloodGlucose: 88,
          weightKg: 72.5
        },
        notes: "Physician recommended maintaining current cardio workout regimen.",
        createdAt: new Date("2026-08-20T08:00:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0e0",
        userId: demoUserId,
        title: "Cardiovascular Vitals Checkup",
        recordType: "Vitals",
        recordDate: new Date("2026-09-18T09:30:00Z"),
        aiSummary: "Blood pressure reading is well within healthy American Heart Association parameters (under 120/80 mmHg). Resting heart rate indicates good aerobic endurance.",
        tags: ["Cardio", "Vitals"],
        vitals: {
          systolic: 116,
          diastolic: 76,
          heartRate: 64,
          bloodGlucose: 92,
          weightKg: 72.0
        },
        notes: "Post-morning jog reading.",
        createdAt: new Date("2026-09-18T09:30:00Z")
      }
    ],
    tasks: [
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0e1",
        userId: demoUserId,
        title: "Submit Q3 Estimated Tax Voucher",
        description: "Verify deduction receipts in Document vault and file online.",
        priority: "high",
        status: "pending",
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        category: "Financial",
        linkedResourceType: "Document",
        linkedResourceId: "64f1a2b3c4d5e6f7a8b9c0d2",
        createdAt: new Date("2026-09-20T10:00:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0e2",
        userId: demoUserId,
        title: "Schedule Bi-annual Dental Checkup",
        description: "Routine checkup and fluoride treatment with Dr. Sterling.",
        priority: "medium",
        status: "in_progress",
        dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
        category: "Health",
        linkedResourceType: "HealthRecord",
        linkedResourceId: null,
        createdAt: new Date("2026-09-21T11:00:00Z")
      },
      {
        _id: "64f1a2b3c4d5e6f7a8b9c0e3",
        userId: demoUserId,
        title: "Renew Vehicle Registration & Insurance",
        description: "Check policy validity and print updated digital cards.",
        priority: "low",
        status: "completed",
        dueDate: new Date(Date.now() - 86400000 * 3),
        category: "Personal",
        linkedResourceType: null,
        linkedResourceId: null,
        createdAt: new Date("2026-09-10T14:00:00Z")
      }
    ]
  };
};

let memoryDb = null;

const loadMemoryDb = () => {
  if (memoryDb) return memoryDb;
  ensureDataDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      memoryDb = JSON.parse(content);
    } else {
      memoryDb = getInitialSeed();
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2));
    }
  } catch (err) {
    memoryDb = getInitialSeed();
  }
  return memoryDb;
};

const saveMemoryDb = () => {
  if (!memoryDb) return;
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2));
  } catch (err) {
    console.error("Failed to write to fallback_db.json:", err);
  }
};

// Generate an ObjectId-like 24 hex string
const generateId = () => crypto.randomBytes(12).toString("hex");

// Unified Repository methods
const DataStore = {
  // USER OPERATIONS
  users: {
    async findByEmail(email) {
      if (getMongoStatus()) {
        return User.findOne({ email: email.toLowerCase() });
      }
      const db = loadMemoryDb();
      return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
    },
    async findById(id) {
      if (getMongoStatus()) {
        return User.findById(id);
      }
      const db = loadMemoryDb();
      return db.users.find((u) => String(u._id) === String(id)) || null;
    },
    async create(userData) {
      if (getMongoStatus()) {
        const newUser = new User(userData);
        return newUser.save();
      }
      const db = loadMemoryDb();
      const newUser = {
        _id: generateId(),
        ...userData,
        preferences: userData.preferences || { currency: "USD", notificationsEnabled: true },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      db.users.push(newUser);
      saveMemoryDb();
      return newUser;
    }
  },

  // DOCUMENT OPERATIONS
  documents: {
    async findByUser(userId, filter = {}) {
      if (getMongoStatus()) {
        const query = { userId, ...filter };
        return Document.find(query).sort({ createdAt: -1 });
      }
      const db = loadMemoryDb();
      return db.documents
        .filter((d) => String(d.userId) === String(userId))
        .filter((d) => {
          if (filter.category && filter.category !== "All" && d.category !== filter.category) return false;
          if (filter.search) {
            const s = filter.search.toLowerCase();
            return (
              (d.title && d.title.toLowerCase().includes(s)) ||
              (d.extractedMetadata?.issuer && d.extractedMetadata.issuer.toLowerCase().includes(s)) ||
              (d.extractedMetadata?.rawOcrText && d.extractedMetadata.rawOcrText.toLowerCase().includes(s))
            );
          }
          return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async findById(id, userId) {
      if (getMongoStatus()) {
        return Document.findOne({ _id: id, userId });
      }
      const db = loadMemoryDb();
      return db.documents.find((d) => String(d._id) === String(id) && String(d.userId) === String(userId)) || null;
    },
    async create(docData) {
      if (getMongoStatus()) {
        const newDoc = new Document(docData);
        return newDoc.save();
      }
      const db = loadMemoryDb();
      const newDoc = {
        _id: generateId(),
        ...docData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      db.documents.unshift(newDoc);
      saveMemoryDb();
      return newDoc;
    },
    async delete(id, userId) {
      if (getMongoStatus()) {
        return Document.findOneAndDelete({ _id: id, userId });
      }
      const db = loadMemoryDb();
      const idx = db.documents.findIndex((d) => String(d._id) === String(id) && String(d.userId) === String(userId));
      if (idx !== -1) {
        const removed = db.documents.splice(idx, 1)[0];
        saveMemoryDb();
        return removed;
      }
      return null;
    }
  },

  // EXPENSE OPERATIONS
  expenses: {
    async findByUser(userId, filter = {}) {
      if (getMongoStatus()) {
        const query = { userId };
        if (filter.category && filter.category !== "All") query.category = filter.category;
        if (filter.type && filter.type !== "All") query.type = filter.type;
        return Expense.find(query).sort({ date: -1, createdAt: -1 });
      }
      const db = loadMemoryDb();
      return db.expenses
        .filter((e) => String(e.userId) === String(userId))
        .filter((e) => {
          if (filter.category && filter.category !== "All" && e.category !== filter.category) return false;
          if (filter.type && filter.type !== "All" && e.type !== filter.type) return false;
          return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    async create(expenseData) {
      if (getMongoStatus()) {
        const exp = new Expense(expenseData);
        return exp.save();
      }
      const db = loadMemoryDb();
      const newExp = {
        _id: generateId(),
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date ? new Date(expenseData.date) : new Date(),
        createdAt: new Date()
      };
      db.expenses.unshift(newExp);
      saveMemoryDb();
      return newExp;
    },
    async delete(id, userId) {
      if (getMongoStatus()) {
        return Expense.findOneAndDelete({ _id: id, userId });
      }
      const db = loadMemoryDb();
      const idx = db.expenses.findIndex((e) => String(e._id) === String(id) && String(e.userId) === String(userId));
      if (idx !== -1) {
        const removed = db.expenses.splice(idx, 1)[0];
        saveMemoryDb();
        return removed;
      }
      return null;
    },
    async getAnalytics(userId) {
      const expenses = await this.findByUser(userId);
      const categoryMap = {};
      let totalSpent = 0;
      let totalIncome = 0;

      expenses.forEach((item) => {
        const amt = Number(item.amount) || 0;
        if (item.type === "income") {
          totalIncome += amt;
        } else {
          totalSpent += amt;
          categoryMap[item.category] = (categoryMap[item.category] || 0) + amt;
        }
      });

      const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
        category: cat,
        total: parseFloat(categoryMap[cat].toFixed(2)),
        percentage: totalSpent > 0 ? parseFloat(((categoryMap[cat] / totalSpent) * 100).toFixed(1)) : 0
      })).sort((a, b) => b.total - a.total);

      return {
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        netSavings: parseFloat((totalIncome - totalSpent).toFixed(2)),
        transactionCount: expenses.length,
        categoryBreakdown
      };
    }
  },

  // HEALTH RECORDS OPERATIONS
  healthRecords: {
    async findByUser(userId) {
      if (getMongoStatus()) {
        return HealthRecord.find({ userId }).sort({ recordDate: -1, createdAt: -1 });
      }
      const db = loadMemoryDb();
      return db.healthRecords
        .filter((h) => String(h.userId) === String(userId))
        .sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
    },
    async create(healthData) {
      if (getMongoStatus()) {
        const record = new HealthRecord(healthData);
        return record.save();
      }
      const db = loadMemoryDb();
      const newRecord = {
        _id: generateId(),
        ...healthData,
        tags: healthData.tags || [],
        vitals: healthData.vitals || {},
        recordDate: healthData.recordDate ? new Date(healthData.recordDate) : new Date(),
        createdAt: new Date()
      };
      db.healthRecords.unshift(newRecord);
      saveMemoryDb();
      return newRecord;
    },
    async delete(id, userId) {
      if (getMongoStatus()) {
        return HealthRecord.findOneAndDelete({ _id: id, userId });
      }
      const db = loadMemoryDb();
      const idx = db.healthRecords.findIndex((h) => String(h._id) === String(id) && String(h.userId) === String(userId));
      if (idx !== -1) {
        const removed = db.healthRecords.splice(idx, 1)[0];
        saveMemoryDb();
        return removed;
      }
      return null;
    }
  },

  // TASK OPERATIONS
  tasks: {
    async findByUser(userId, filter = {}) {
      if (getMongoStatus()) {
        const query = { userId };
        if (filter.status && filter.status !== "All") query.status = filter.status;
        if (filter.priority && filter.priority !== "All") query.priority = filter.priority;
        return Task.find(query).sort({ dueDate: 1, createdAt: -1 });
      }
      const db = loadMemoryDb();
      return db.tasks
        .filter((t) => String(t.userId) === String(userId))
        .filter((t) => {
          if (filter.status && filter.status !== "All" && t.status !== filter.status) return false;
          if (filter.priority && filter.priority !== "All" && t.priority !== filter.priority) return false;
          return true;
        })
        .sort((a, b) => {
          if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
          return 0;
        });
    },
    async create(taskData) {
      if (getMongoStatus()) {
        const task = new Task(taskData);
        return task.save();
      }
      const db = loadMemoryDb();
      const newTask = {
        _id: generateId(),
        ...taskData,
        status: taskData.status || "pending",
        priority: taskData.priority || "medium",
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        createdAt: new Date()
      };
      db.tasks.unshift(newTask);
      saveMemoryDb();
      return newTask;
    },
    async update(id, userId, updates) {
      if (getMongoStatus()) {
        return Task.findOneAndUpdate({ _id: id, userId }, { $set: updates }, { new: true });
      }
      const db = loadMemoryDb();
      const item = db.tasks.find((t) => String(t._id) === String(id) && String(t.userId) === String(userId));
      if (item) {
        Object.assign(item, updates, { updatedAt: new Date() });
        saveMemoryDb();
        return item;
      }
      return null;
    },
    async delete(id, userId) {
      if (getMongoStatus()) {
        return Task.findOneAndDelete({ _id: id, userId });
      }
      const db = loadMemoryDb();
      const idx = db.tasks.findIndex((t) => String(t._id) === String(id) && String(t.userId) === String(userId));
      if (idx !== -1) {
        const removed = db.tasks.splice(idx, 1)[0];
        saveMemoryDb();
        return removed;
      }
      return null;
    }
  }
};

module.exports = DataStore;
