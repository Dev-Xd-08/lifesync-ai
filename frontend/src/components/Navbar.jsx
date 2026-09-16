import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            LifeSync AI
          </h1>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-slate-600 hover:text-slate-900">
            Features
          </a>

          <a href="#security" className="text-slate-600 hover:text-slate-900">
            Security
          </a>

          <a href="#about" className="text-slate-600 hover:text-slate-900">
            About
          </a>
        </div>

        <Link 
          to="/dashboard"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Get Started
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;