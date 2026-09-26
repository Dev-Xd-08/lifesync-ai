# 🗄 LifeSync AI: Database Architecture & Data Models

This document details the MongoDB / Mongoose entity-relationship models, indexing strategies, and aggregation pipelines employed across **LifeSync AI**.

---

## 1. Entity-Relationship (ER) Schema

```
 ┌──────────────────────┐         1:N         ┌────────────────────────────────┐
 │        USERS         ├────────────────────►│           DOCUMENTS            │
 ├──────────────────────┤                     ├────────────────────────────────┤
 │ _id: ObjectId [PK]   │                     │ _id: ObjectId [PK]             │
 │ name: String         │                     │ userId: ObjectId [FK]          │
 │ email: String (UQ)   │                     │ title: String                  │
 │ passwordHash: String │                     │ category: Enum                 │
 │ avatarUrl: String    │                     │ fileUrl: String                │
 │ preferences: Object  │                     │ fileKey: String (UQ)           │
 │ createdAt: Date      │                     │ fileSizeBytes: Number          │
 └──────────┬───────────┘                     │ mimeType: String               │
            │                                 │ extractedMetadata: Object      │
            │                                 │   ├── issuer: String           │
            │                                 │   ├── identifierMasked: String │
            │                                 │   └── expiryDate: Date         │
            │                                 │ createdAt: Date                │
            │                                 └────────────────────────────────┘
            │
            │ 1:N                             ┌────────────────────────────────┐
            ├────────────────────────────────►│            EXPENSES            │
            │                                 ├────────────────────────────────┤
            │                                 │ _id: ObjectId [PK]             │
            │                                 │ userId: ObjectId [FK]          │
            │                                 │ type: "income" | "expense"     │
            │                                 │ category: String               │
            │                                 │ amount: Number                 │
            │                                 │ currency: String               │
            │                                 │ date: Date                     │
            │                                 │ description: String            │
            │                                 │ createdAt: Date                │
            │                                 └────────────────────────────────┘
            │
            │ 1:N                             ┌────────────────────────────────┐
            ├────────────────────────────────►│         HEALTH_RECORDS         │
            │                                 ├────────────────────────────────┤
            │                                 │ _id: ObjectId [PK]             │
            │                                 │ userId: ObjectId [FK]          │
            │                                 │ title: String                  │
            │                                 │ recordType: String             │
            │                                 │ recordDate: Date               │
            │                                 │ vitals: Object                 │
            │                                 │   ├── systolic: Number         │
            │                                 │   ├── diastolic: Number        │
            │                                 │   ├── heartRate: Number        │
            │                                 │   ├── bloodGlucose: Number     │
            │                                 │   └── weightKg: Number         │
            │                                 │ aiSummary: String              │
            │                                 │ tags: [String]                 │
            │                                 │ createdAt: Date                │
            │                                 └────────────────────────────────┘
            │
            │ 1:N                             ┌────────────────────────────────┐
            └────────────────────────────────►│             TASKS              │
                                              ├────────────────────────────────┤
                                              │ _id: ObjectId [PK]             │
                                              │ userId: ObjectId [FK]          │
                                              │ title: String                  │
                                              │ description: String            │
                                              │ priority: "low"|"med"|"high"   │
                                              │ status: "pending"|"completed"  │
                                              │ dueDate: Date                  │
                                              │ category: String               │
                                              │ createdAt: Date                │
                                              └────────────────────────────────┘
```

---

## 2. Collection Definitions & Schemas

### 2.1 `User`
- `_id`: 24-character hexadecimal ObjectId (Primary Key).
- `name`: String, required, max length 100 characters.
- `email`: String, required, unique, lowercase, regex email pattern.
- `passwordHash`: String, Bcrypt salted cryptographic hash.
- `avatarUrl`: String, CDN reference or DiceBear dynamic seed.
- `preferences`: Embedded document `{ currency: String, notificationsEnabled: Boolean }`.

### 2.2 `Document`
- `_id`: ObjectId (Primary Key).
- `userId`: ObjectId reference to `User`, indexed.
- `title`: String, document display name.
- `category`: Enum: `["Government", "Academic", "Financial", "Medical", "Other"]`.
- `fileKey`: String, cryptographically random UUID filename.
- `fileSizeBytes`: Number, exact byte length.
- `mimeType`: String (e.g. `application/pdf`, `image/png`).
- `extractedMetadata`:
  - `issuer`: Name of issuing authority detected via OCR.
  - `identifierMasked`: Masked identity string (`XXXX-XXXX-1234`).
  - `issueDate`: Date.
  - `expiryDate`: Date (indexed for deadline checking).
  - `rawOcrText`: First 1500 characters of OCR extracted content.
  - `confidenceScore`: Tesseract OCR recognition confidence.

### 2.3 `Expense`
- `_id`: ObjectId (Primary Key).
- `userId`: ObjectId reference to `User`, indexed.
- `type`: Enum: `["income", "expense"]`.
- `category`: String (e.g. `Housing`, `Food`, `Utilities`, `Medical`, `Salary`).
- `amount`: Floating-point Number, minimum `0.01`.
- `date`: Date timestamp, indexed for chronological sorting.
- `description`: String.

### 2.4 `HealthRecord`
- `_id`: ObjectId (Primary Key).
- `userId`: ObjectId reference to `User`, indexed.
- `title`: String, checkup or panel title.
- `recordType`: Enum: `["Vitals", "Lab Report", "Prescription", "Vaccine", "Consultation"]`.
- `recordDate`: Date.
- `vitals`: Embedded object `{ systolic, diastolic, heartRate, bloodGlucose, weightKg }`.
- `aiSummary`: String containing clinical notes + mandatory disclaimer.

### 2.5 `Task`
- `_id`: ObjectId (Primary Key).
- `userId`: ObjectId reference to `User`, indexed.
- `title`: String.
- `priority`: Enum: `["low", "medium", "high"]`.
- `status`: Enum: `["pending", "in_progress", "completed"]`.
- `dueDate`: Date, indexed.
- `category`: String.

---

## 3. Database Indexes

| Collection | Indexed Fields | Index Type | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `{ email: 1 }` | Unique | Prevent duplicate registrations & speed up login lookup |
| `documents` | `{ userId: 1, createdAt: -1 }` | Compound | Fast user-scoped file listing by date |
| `documents` | `{ title: "text", "extractedMetadata.issuer": "text" }` | Text Index | Full-text global document search |
| `expenses` | `{ userId: 1, date: -1 }` | Compound | Chronological ledger rendering |
| `expenses` | `{ userId: 1, category: 1 }` | Compound | Category filtering and aggregation acceleration |
| `tasks` | `{ userId: 1, dueDate: 1, status: 1 }` | Compound | Rapid lookup of overdue and upcoming commitments |
| `health_records` | `{ userId: 1, recordDate: -1 }` | Compound | Chronological biometric vitals queries |

---

## 4. Key MongoDB Aggregation Pipeline

### Category Spending Breakdown Pipeline
```javascript
[
  { 
    $match: { 
      userId: new ObjectId(currentUserId),
      type: "expense" 
    } 
  },
  { 
    $group: { 
      _id: "$category", 
      totalSpent: { $sum: "$amount" },
      transactionCount: { $sum: 1 }
    } 
  },
  { 
    $sort: { totalSpent: -1 } 
  },
  {
    $project: {
      category: "$_id",
      totalSpent: 1,
      transactionCount: 1,
      _id: 0
    }
  }
]
```
