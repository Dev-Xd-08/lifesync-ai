function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 md:flex-row">
        
        {/* Brand */}
        <div className="mb-4 text-xl font-bold text-slate-900 md:mb-0">
          LifeSync AI
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <a href="#" className="transition hover:text-slate-900">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-slate-900">
            Terms of Service
          </a>
          <a href="#" className="transition hover:text-slate-900">
            Contact Support
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-sm text-slate-400 md:mt-0">
          &copy; {new Date().getFullYear()} LifeSync AI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;