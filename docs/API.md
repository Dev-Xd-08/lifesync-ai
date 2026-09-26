# 📡 LifeSync AI: REST API Gateway Specification

All endpoints are prefixed with `/api/v1`. Protected routes require the following HTTP header:
```http
Authorization: Bearer <jwt_access_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register Account
- **Endpoint**: `POST /api/v1/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jordan Miller",
  "email": "jordan@example.com",
  "password": "SecurePassword@123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jordan Miller",
    "email": "jordan@example.com",
    "avatarUrl": "https://api.dicebear.com/7.x/initials/svg?seed=Jordan%20Miller"
  }
}
```

### 1.2 Login Account
- **Endpoint**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "demo@lifesync.ai",
  "password": "LifeSync@2026"
}
```
- **Response (200 OK)**: Returns JWT bearer token and user object.

### 1.3 Get Current Profile
- **Endpoint**: `GET /api/v1/auth/me`
- **Access**: Protected

---

## 2. Document Vault Endpoints

### 2.1 List Documents
- **Endpoint**: `GET /api/v1/documents`
- **Access**: Protected
- **Query Parameters**:
  - `category` *(optional)*: `"Government" | "Academic" | "Financial" | "Medical" | "Other"`
  - `search` *(optional)*: string search term
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 2,
  "documents": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "title": "Federal Tax Return 2025",
      "category": "Financial",
      "fileUrl": "/api/v1/documents/64f1a2b3c4d5e6f7a8b9c0d2/download",
      "fileSizeBytes": 2450000,
      "mimeType": "application/pdf",
      "extractedMetadata": {
        "issuer": "Internal Revenue Service",
        "identifierMasked": "XXX-XX-4819",
        "expiryDate": null,
        "confidenceScore": 94.5
      },
      "createdAt": "2026-09-02T14:30:00.000Z"
    }
  ]
}
```

### 2.2 Upload Document with OCR
- **Endpoint**: `POST /api/v1/documents`
- **Access**: Protected
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: binary file (`.pdf`, `.png`, `.jpg`, `.txt`)
  - `title` *(optional)*: string
  - `category` *(optional)*: string
- **Response (201 Created)**: Returns saved document with OCR extracted fields.

### 2.3 Download Document File
- **Endpoint**: `GET /api/v1/documents/:id/download`
- **Access**: Protected
- **Response**: Binary file stream with `Content-Disposition: attachment`.

### 2.4 Delete Document
- **Endpoint**: `DELETE /api/v1/documents/:id`
- **Access**: Protected

---

## 3. Financial Ledger Endpoints

### 3.1 List Transactions
- **Endpoint**: `GET /api/v1/expenses`
- **Access**: Protected
- **Query Parameters**: `category`, `type` (`"income"` or `"expense"`)

### 3.2 Add Transaction
- **Endpoint**: `POST /api/v1/expenses`
- **Access**: Protected
- **Request Body**:
```json
{
  "description": "Whole Foods Groceries",
  "amount": 145.20,
  "category": "Food",
  "type": "expense",
  "date": "2026-09-15"
}
```

### 3.3 Get Spending Analytics
- **Endpoint**: `GET /api/v1/expenses/analytics`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "analytics": {
    "totalSpent": 1755.70,
    "totalIncome": 4800.00,
    "netSavings": 3044.30,
    "transactionCount": 5,
    "categoryBreakdown": [
      { "category": "Housing", "total": 1450.00, "percentage": 82.6 },
      { "category": "Food", "total": 145.20, "percentage": 8.3 }
    ]
  }
}
```

### 3.4 Delete Transaction
- **Endpoint**: `DELETE /api/v1/expenses/:id`
- **Access**: Protected

---

## 4. Task Management Endpoints

### 4.1 List Tasks
- **Endpoint**: `GET /api/v1/tasks`
- **Access**: Protected
- **Query Parameters**: `status`, `priority`

### 4.2 Create Task
- **Endpoint**: `POST /api/v1/tasks`
- **Access**: Protected
- **Request Body**:
```json
{
  "title": "Submit Q3 Estimated Tax Voucher",
  "description": "Verify deduction receipts in Document vault and file online.",
  "priority": "high",
  "category": "Financial",
  "dueDate": "2026-09-28"
}
```

### 4.3 Update Task
- **Endpoint**: `PATCH /api/v1/tasks/:id`
- **Access**: Protected
- **Request Body**: `{ "status": "completed" }`

### 4.4 Delete Task
- **Endpoint**: `DELETE /api/v1/tasks/:id`
- **Access**: Protected

---

## 5. Health Records & Vitals Endpoints

### 5.1 List Health Records
- **Endpoint**: `GET /api/v1/health`
- **Access**: Protected

### 5.2 Create Health Log with AI Summary
- **Endpoint**: `POST /api/v1/health`
- **Access**: Protected
- **Request Body**:
```json
{
  "title": "Annual Metabolic Panel",
  "recordType": "Lab Report",
  "recordDate": "2026-08-20",
  "vitals": {
    "systolic": 118,
    "diastolic": 78,
    "heartRate": 68,
    "bloodGlucose": 88,
    "weightKg": 72.5
  },
  "notes": "Physician recommended maintaining daily cardio."
}
```

### 5.3 Delete Health Record
- **Endpoint**: `DELETE /api/v1/health/:id`
- **Access**: Protected

---

## 6. AI Copilot & System Stats

### 6.1 Query LifeSync Copilot
- **Endpoint**: `POST /api/v1/ai/chat`
- **Access**: Protected
- **Request Body**:
```json
{
  "message": "What did I spend on food this month?"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "reply": "Here is your current financial summary, **Alex Vance**:\n\n• **Total Expenses**: $1755.70 across 4 transactions\n• **Total Income**: $4800.00\n• **Net Savings**: $3044.30\n• **Top Category**: **Housing** ($1450.00)\n\nSpecifically for **Food/Groceries**, you have spent **$145.20**."
}
```

### 6.2 Get Dashboard Stats
- **Endpoint**: `GET /api/v1/stats`
- **Access**: Protected

### 6.3 Public Gateway Health Check
- **Endpoint**: `GET /api/v1/health-check`
- **Access**: Public
