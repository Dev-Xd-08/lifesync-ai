import React from "react";
import { Link } from "react-router-dom";
import {
  FolderLock,
  Receipt,
  HeartPulse,
  CheckSquare,
  Bot,
  ShieldCheck,
  Cpu,
  Database,
  ArrowRight,
  Server,
  Lock,
  Zap,
  CheckCircle2,
  Bell,
  Sparkles,
  Search,
  FileText,
  UserCheck,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

function Landing() {
  const steps = [
    {
      number: "01",
      title: "Authenticate & Isolate",
      description: "Sign in with encrypted credentials or click instant Demo Login. A dedicated tenant session is established."
    },
    {
      number: "02",
      title: "Ingest Life Records",
      description: "Upload tax forms, IDs, receipts, medical vitals, and pending tasks through our drag-and-drop vault."
    },
    {
      number: "03",
      title: "Automated OCR & Aggregation",
      description: "Tesseract extracts document issuers and dates, while MongoDB aggregation computes real-time spending metrics."
    },
    {
      number: "04",
      title: "Query LifeSync Copilot",
      description: "Ask natural language questions like 'What did I spend on food?' and get instant, context-verified answers."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero */}
      <Hero />

      {/* 3. Features Section */}
      <section id="features" className="bg-white px-6 py-24 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Complete Operations Suite
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              One Unified Life Operating System
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Eliminate personal administrative friction with five enterprise-grade pillars built on secure multi-tenancy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={FolderLock}
              badge="Tesseract OCR"
              title="Secure Document Vault"
              description="Store tax returns, IDs, and policies. Automatically extracts document numbers, issuers, and expiry dates."
            />
            <FeatureCard
              icon={Receipt}
              badge="MongoDB Aggregation"
              title="Financial Ledger & Analytics"
              description="Comprehensive income and expense logging with running totals, net savings calculation, and category distribution."
            />
            <FeatureCard
              icon={HeartPulse}
              badge="Clinical NLP"
              title="Health Records & Vitals"
              description="Track blood pressure, heart rate, and metabolic panels with automated plain-language medical summarization."
            />
            <FeatureCard
              icon={CheckSquare}
              badge="State Machine"
              title="Tasks & Deadlines"
              description="Schedule critical life tasks with priority flags, due date monitoring, and countdown tracking."
            />
            <FeatureCard
              icon={Bot}
              badge="Contextual RAG"
              title="LifeSync Intelligence Copilot"
              description="Ask natural-language questions across your live ledger, documents, and vitals with verified source citations."
            />
            <FeatureCard
              icon={ShieldCheck}
              badge="Zero-Knowledge"
              title="Tenant Isolation & Security"
              description="Enforces strict resource isolation (userId: req.user.id), Helmet HTTP security headers, and rate-limiting."
            />
          </div>
        </div>
      </section>

      {/* 4. Architecture Section */}
      <section id="architecture" className="bg-slate-900 text-white px-6 py-24 border-b border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Master System Topology
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Enterprise Multi-Tier Architecture
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Designed according to modern decoupled distributed systems standards for college capstone defense.
            </p>
          </div>

          {/* Visual Architecture Flow Diagram */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl">
            {/* Top Node: User */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-bold text-white border border-slate-700 shadow-sm">
                <UserCheck className="h-4 w-4 text-cyan-400" />
                <span>Authenticated User</span>
              </div>
              <div className="h-6 w-0.5 bg-slate-700" />
              <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2 text-xs font-semibold text-slate-300 border border-slate-700">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>JWT Bearer Authentication Gateway</span>
              </div>
              <div className="h-6 w-0.5 bg-slate-700" />
              <div className="flex items-center gap-2 rounded-xl bg-emerald-950/80 px-6 py-2 text-xs font-bold text-emerald-400 border border-emerald-800">
                <Server className="h-3.5 w-3.5" />
                <span>LifeSync Executive Dashboard</span>
              </div>
              <div className="h-8 w-0.5 bg-slate-700" />
            </div>

            {/* Core Modules 6-Box Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center space-y-1">
                <FolderLock className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-white">Documents Vault</h4>
                <p className="text-[11px] text-slate-400">Tesseract OCR Pipeline</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center space-y-1">
                <Receipt className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-white">Expenses Ledger</h4>
                <p className="text-[11px] text-slate-400">Aggregation Analytics</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center space-y-1">
                <HeartPulse className="h-5 w-5 text-rose-400 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-white">Health & Vitals</h4>
                <p className="text-[11px] text-slate-400">AI Medical Summary</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center space-y-1">
                <CheckSquare className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-white">Tasks Engine</h4>
                <p className="text-[11px] text-slate-400">Priority State Machine</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center space-y-1">
                <Bell className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-white">Event Reminders</h4>
                <p className="text-[11px] text-slate-400">Expiry Countdown Alert</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center space-y-1">
                <Bot className="h-5 w-5 text-teal-400 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-white">AI Assistant</h4>
                <p className="text-[11px] text-slate-400">Cross-Domain RAG</p>
              </div>
            </div>

            {/* Bottom Node: Secure Storage */}
            <div className="flex flex-col items-center pt-2">
              <div className="h-8 w-0.5 bg-slate-700" />
              <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-bold text-white border border-slate-700 shadow-sm">
                <Database className="h-4 w-4 text-emerald-400" />
                <span>Secure Storage: MongoDB Atlas + Encrypted Disk Vault</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI Capabilities Section */}
      <section id="ai-capabilities" className="bg-white px-6 py-24 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Applied Intelligence
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Autonomous Document & Context AI
            </h2>
            <p className="mt-3 text-base text-slate-600">
              LifeSync pairs computer vision with large language models to turn raw scans and scattered numbers into actionable intelligence.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* OCR Document Intelligence */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Cpu className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Optical Document OCR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingests PDF documents, images, and tax forms through Tesseract. Extracts raw text strings and automatically categorizes document type, issuing authority, and expiration dates.
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] text-slate-600 space-y-1">
                <div className="text-emerald-700 font-bold">✓ Issuer: Internal Revenue Service</div>
                <div>✓ Detected Expiry: 2027-01-01</div>
                <div>✓ Identifier: XXXX-XXXX-4819</div>
              </div>
            </div>

            {/* Clinical NLP Summarizer */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <HeartPulse className="h-5 w-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Clinical Health Summarizer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Synthesizes blood pressure readings, glucose levels, and medical reports into plain-language patient explanations with mandatory healthcare compliance disclaimers.
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-700 space-y-1 leading-relaxed">
                <p className="font-semibold text-slate-900">"BP reading 118/76 mmHg is within healthy AHA targets."</p>
                <p className="text-[10px] text-slate-400 italic">⚠️ Informational record summary only; not medical diagnosis.</p>
              </div>
            </div>

            {/* Contextual RAG Copilot */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Bot className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Context-Aware Copilot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Queries across your live expenses, active vault files, tasks, and vitals. Powered by Google Gemini 2.5 Flash SDK with a built-in local fallback engine.
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] space-y-1.5">
                <div className="text-slate-500 font-bold">Q: "What did I spend on groceries?"</div>
                <div className="text-slate-900 font-semibold bg-emerald-50 text-emerald-900 p-2 rounded-lg border border-emerald-200">
                  "Based on your ledger, you spent $145.20 at Whole Foods."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Security Section */}
      <section id="security" className="bg-slate-50 px-6 py-24 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
              Zero-Trust Protection
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bank-Grade Security Built from the Ground Up
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Your personal information belongs to you. Every document, financial metric, and clinical record is shielded behind cryptographic isolation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-2.5 shadow-2xs">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Multi-Tenant Isolation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every database query structurally enforces <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">userId: req.user.id</code> preventing cross-tenant data leakage.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-2.5 shadow-2xs">
              <Lock className="h-6 w-6 text-cyan-600" />
              <h3 className="text-sm font-bold text-slate-900">Bcrypt Salt Rounds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                User passwords are protected with 10–12 salt rounds before database storage. Plaintext passwords are never stored.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-2.5 shadow-2xs">
              <FolderLock className="h-6 w-6 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Isolated Disk Vault</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Files are renamed using cryptographic UUID keys and placed outside public web directories. Access requires Bearer JWT authentication.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-2.5 shadow-2xs">
              <Server className="h-6 w-6 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Helmet & Rate Limiting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equipped with Helmet security headers (CSP, HSTS) and Express-Rate-Limit to guard against brute-force attacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section id="how-it-works" className="bg-white px-6 py-24 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Simple 4-Step Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How LifeSync AI Works
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Get from sign-up to a fully orchestrated second brain in minutes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 space-y-3 hover:border-slate-300 transition"
              >
                <div className="text-2xl font-black text-slate-400">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Demo CTA */}
          <div className="mt-14 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition"
            >
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Experience with 1-Click Demo Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}

export default Landing;