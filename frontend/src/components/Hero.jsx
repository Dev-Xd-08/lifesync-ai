import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
} from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-20 md:py-28">

      {/* Background radial gradient glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="-ml-40 h-[400px] w-[400px] rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">

          {/* Capstone Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50/90 px-4 py-1.5 text-xs font-bold text-emerald-900 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />

            <span>
              Master Engineering Capstone Edition • Production Ready
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
            Your Digital Life.
            <br className="hidden sm:block" />

            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-700 bg-clip-text text-transparent">
              Orchestrated & Secured.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
            Break down data silos across financial expenses, encrypted identity
            documents, clinical health records, and pending tasks through
            automated OCR extraction and autonomous LLM inference.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">

            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 sm:w-auto"
            >
              <Zap className="h-4 w-4 text-emerald-400" />

              <span>Launch Demo Vault</span>

              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#architecture"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
            >
              <span>System Architecture</span>
            </a>

          </div>

          {/* Feature Highlights Trust Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Tenant-Scoped Isolation</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-cyan-600" />
              <span>Tesseract Optical OCR</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-indigo-600" />
              <span>AES-256 / SHA Redaction</span>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Hero;