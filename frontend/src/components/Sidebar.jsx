import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // Helper function to highlight the active link
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors";
    return location.pathname === path
      ? `${baseClass} bg-slate-100 text-slate-900`
      : `${baseClass} text-slate-600 hover:bg-slate-50 hover:text-slate-900`;
  };

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-200 bg-white md:flex">
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-900">LifeSync AI</h2>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        <Link to="/dashboard" className={getLinkClass("/dashboard")}>
          <span>📊</span> Overview
        </Link>
        <Link to="/documents" className={getLinkClass("/documents")}>
          <span>📄</span> Documents
        </Link>
        <Link to="/expenses" className={getLinkClass("/expenses")}>
          <span>💰</span> Expenses
        </Link>
        <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-400 cursor-not-allowed">
          <span>❤️</span> Health (Coming Soon)
        </Link>
        <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-400 cursor-not-allowed">
          <span>✓</span> Tasks (Coming Soon)
        </Link>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <span>🚪</span> Logout
        </Link>
      </div>

    </aside>
  );
}

export default Sidebar;