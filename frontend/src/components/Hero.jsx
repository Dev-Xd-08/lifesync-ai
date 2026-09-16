import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-24 md:py-32">

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-slate-200/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            🤖 AI-Powered Digital Life Management
          </div>

          {/* Main heading */}
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
            Your Digital Life.
            <br />

            <span className="text-slate-500">
              One Secure Place.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Manage your documents, expenses, health records,
            tasks, and personal information — all from one
            intelligent and secure platform.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <Link 
              to="/dashboard"
              className="w-full rounded-xl bg-slate-900 px-7 py-3.5 text-center font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-700 sm:w-auto"
            >
              Get Started →
            </Link>

            <a
              href="#features"
              className="w-full rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-center font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
            >
              Explore Features
            </a>

          </div>

          {/* Trust text */}
          <p className="mt-8 text-sm text-slate-500">
            Secure • Intelligent • Organized
          </p>

        </div>
      </div>

    </section>
  );
}

export default Hero;