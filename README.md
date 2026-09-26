# 🚀 LifeSync AI: Autonomous Digital Life Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An architectural master project and production-ready digital life operations platform ("Second Brain") built for college capstone submission and technical defense. **LifeSync AI** unifies five essential life operations—**Encrypted Document Vault**, **Financial Expenses Ledger**, **Health & Biometrics Records**, **Tasks & Deadlines Engine**, and an **Autonomous Context-Aware AI Copilot**—with zero-trust multi-tenant data isolation.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Core Engineering Pillars](#-core-engineering-pillars)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Production Security Specifications](#-production-security-specifications)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Evaluation & 1-Click Demo Mode](#-evaluation--1-click-demo-mode)
- [REST API Specification Reference](#-rest-api-specification-reference)
- [Academic Defense Documentation](#-academic-defense-documentation)

---

## 🏛 System Architecture

```
                                  [ CLIENT TIER ]
                    React 19 + Vite + Tailwind CSS + Lucide Icons
                                         │
                                         ▼
                                  [ ROUTING & AUTH ]
                        Protected Routes / Axios Interceptors
                                         │
                         HTTPS / JSON Web Tokens (Bearer)
                                         │
                                         ▼
                                 [ API GATEWAY TIER ]
                        Node.js + Express.js REST Framework
                     ├── Rate Limiter (express-rate-limit)
                     ├── Security Headers (Helmet)
                     ├── CORS Policy Enforcement
                     └── Centralized Error Handling
                                         │
                 ┌───────────────────────┼────────────────────────┐
                 ▼                       ▼                        ▼
       [ CONTROLLERS & SERVICES ] [ FILE PIPELINE ]     [ AI INFERENCE PIPELINE ]
       ├── Auth (Bcrypt / JWT)    ├── Multer (Disk/Mem) ├── Tesseract OCR Engine
       ├── Expenses & Analytics   ├── Magic-Byte Check  ├── Gemini LLM Summarizer
       ├── Task & Reminder Engine └── Secure Vault      └── Contextual RAG Copilot
       └── Health Records
                 │                       │                        │
                 └───────────────────────┼────────────────────────┘
                                         ▼
                                  [ DATABASE TIER ]
                           MongoDB (Mongoose ODM)
                 ├── Collections: Users, Documents, Expenses, Tasks, HealthRecords
                 └── Indexes: Compound, Expiry, Text Search + Graceful In-Memory Fallback
```

---

## 🌟 Core Engineering Pillars

### 1. 📂 Secure Document Vault with Tesseract OCR
- Multipart file upload pipeline using **Multer** with MIME-type and magic-byte validation.
- Files stored on encrypted disk with cryptographically random UUID file keys (never exposed under original file names).
- Integrated **Tesseract.js** optical character recognition extracting document issuers, expiration dates, and sensitive identifiers.
- Automatic masking of sensitive identifiers (e.g. `XXXX-XXXX-1234`).
- Authenticated file download stream (`GET /api/v1/documents/:id/download`) and secure deletion.

### 2. 💰 Financial Ledger & MongoDB Aggregation Analytics
- Complete income and expense tracking with category classification (Housing, Food, Utilities, Transport, Medical, Salary).
- MongoDB Aggregation pipelines calculating real-time running totals, net savings, cash reserves, and category spending distributions.
- Instant debit vs. credit tracking.

### 3. 🩺 Health Records & Clinical AI Summarization
- Biometric vitals monitoring (Blood pressure: systolic/diastolic, resting pulse, fasting glucose, weight).
- Automated AI medical summarization with compliance safeguards and required healthcare disclaimers.
- Categorization across lab reports, prescriptions, vaccines, and doctor consultation notes.

### 4. 📋 Tasks, Deadlines & Reminder Engine
- State machine cycling through `pending`, `in_progress`, and `completed` states.
- Priority levels (`high`, `medium`, `low`) and due date countdown monitoring.
- Filterable views for pending, urgent, and completed commitments.

### 5. 🤖 LifeSync Contextual Copilot (RAG Pipeline)
- Dynamic context-retrieval engine querying across active user expenses, vault documents, pending tasks, and health logs.
- Synthesizes natural-language answers using the official **Google Gemini API** (with a specialized local reasoning engine as automatic zero-crash fallback when offline).

---

## 🛠 Tech Stack & Dependencies

| Layer | Primary Technologies | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons | Ultra-fast HMR, zero-runtime styling overhead, sleek modern vector iconography |
| **Client HTTP** | Axios | Request/Response interceptors for automated JWT Bearer injection |
| **Backend** | Node.js (LTS), Express 5.x | Event-driven I/O, robust asynchronous middleware pipeline |
| **Database** | MongoDB, Mongoose ODM | Document-oriented schema aligning with heterogeneous personal data |
| **Persistence** | Resilient Storage Layer | Dual-mode: Connects to MongoDB Atlas or local MongoDB; includes automated in-memory store for instant zero-setup demonstration |
| **Auth** | JSON Web Tokens, Bcrypt | Stateless authentication with hardened password salt rounds |
| **OCR & AI** | Tesseract.js, Google Gemini SDK | Optical text extraction on uploaded buffers paired with LLM context inference |
| **Security** | Helmet, Express-Rate-Limit, CORS | Protection against XSS, clickjacking, brute-force attacks, and open-relay risks |

---

## 🔒 Production Security Specifications

- **Multi-Tenant Isolation**: Every database query enforces:
  $$\text{Query Filter} = \{\, \_id: \text{resourceId},\; userId: \text{req.user.id} \,\}$$
- **Password Hardening**: Passwords hashed with Bcrypt using 10–12 salt rounds before database persistence.
- **Identifier Redaction**: Sensitive government and financial IDs are sanitized to non-reversible masked tokens.
- **Protected File Access**: File keys are generated via `crypto.randomUUID()`. Direct static access to the `uploads/` directory is blocked; files are served solely via authenticated streaming endpoints.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18.x, v20.x, or v22+)
- **npm** (v9+ or v10+)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Dev-Xd-08/lifesync-ai.git
cd lifesync-ai

# Install root, backend, and frontend packages
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Configure Environment Variables

Create `.env` in `backend/`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/lifesync_ai
JWT_SECRET=lifesync_super_secret_jwt_key_2026_dev
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=15
```

Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

> **Note on MongoDB & Gemini**: If MongoDB is not running locally, LifeSync AI automatically boots its **Resilient Local Store** with pre-seeded demo records so you can run and evaluate the system immediately without external server setup. If a `GEMINI_API_KEY` is not provided, the system seamlessly uses its built-in contextual reasoning engine.

### 3. Run the Full Stack Application

In terminal 1 (Backend):
```bash
npm run dev:backend
```

In terminal 2 (Frontend):
```bash
npm run dev:frontend
```

Open your browser at **`http://localhost:5173`**.

### 4. Run Automated End-to-End Tests

To execute the automated 19-step verification audit across auth, vault, ledger, health NLP, copilot, and tenant isolation:
```bash
npm test
```

---

## ⚡ Evaluation & 1-Click Demo Mode

For examiners, instructors, or peer reviewers evaluating the platform:
1. Navigate to `http://localhost:5173/login`.
2. Click the **"Instant 1-Click Demo Login"** button.
3. You will immediately be authenticated as **Alex Vance** (`demo@lifesync.ai`) with pre-populated documents, expenses, vitals, and tasks ready for immediate inspection and live AI query testing.

---

## 📡 REST API Specification Reference

All endpoints are mounted under `/api/v1`:

### Authentication
- `POST /api/v1/auth/register` — Create a new tenant account
- `POST /api/v1/auth/login` — Authenticate and receive JWT Bearer token
- `GET /api/v1/auth/me` — Retrieve authenticated user profile `[Protected]`

### Document Vault
- `GET /api/v1/documents` — List user documents (supports `?category=` & `?search=`) `[Protected]`
- `POST /api/v1/documents` — Upload file via `multipart/form-data` with automated OCR `[Protected]`
- `GET /api/v1/documents/:id/download` — Stream decrypted file from vault `[Protected]`
- `DELETE /api/v1/documents/:id` — Permanently delete document and purge file from disk `[Protected]`

### Financial Ledger
- `GET /api/v1/expenses` — Retrieve transactions (supports `?category=` & `?type=`) `[Protected]`
- `POST /api/v1/expenses` — Record debit or credit transaction `[Protected]`
- `GET /api/v1/expenses/analytics` — MongoDB aggregation spending breakdown `[Protected]`
- `DELETE /api/v1/expenses/:id` — Delete transaction entry `[Protected]`

### Tasks & Reminders
- `GET /api/v1/tasks` — List tasks sorted by priority and due date `[Protected]`
- `POST /api/v1/tasks` — Create task with category and deadline `[Protected]`
- `PATCH /api/v1/tasks/:id` — Update status (`pending` / `completed`) or details `[Protected]`
- `DELETE /api/v1/tasks/:id` — Remove task `[Protected]`

### Health Records & Vitals
- `GET /api/v1/health` — Retrieve health logs and biometrics `[Protected]`
- `POST /api/v1/health` — Log vitals/reports with automated AI clinical summary `[Protected]`
- `DELETE /api/v1/health/:id` — Remove health record `[Protected]`

### AI Copilot & System Stats
- `POST /api/v1/ai/chat` — Contextual Copilot query across all user records `[Protected]`
- `GET /api/v1/stats` — Consolidated dashboard KPIs and unified recent activity stream `[Protected]`
- `GET /api/v1/health-check` — Public system status and gateway uptime check

---

## 🎓 Academic Defense Documentation

Comprehensive artifacts prepared for capstone submission and technical viva defense:
- [Software Requirements Specification (SRS)](docs/SRS.md)
- [System Architecture & Security Model](docs/ARCHITECTURE.md)
- [REST API Specification & Examples](docs/API.md)
- [Database Schema & ER Diagrams](docs/DATABASE.md)

---

## ⚖️ License & Academic Integrity

Developed for academic demonstration and capstone submission. Licensed under the MIT License.
