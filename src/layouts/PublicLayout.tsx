import { Outlet, Link, useLocation } from "react-router-dom";
import { Plus, ClipboardList, Shield } from "lucide-react";
import { useRequests } from "../context/RequestContext";

export default function PublicLayout() {
  const { settings } = useRequests();
  const location = useLocation();

  const navItems = [
    { label: "Submit Request", path: "/new-request", icon: <Plus size={15} /> },
    { label: "My Requests", path: "/requests", icon: <ClipboardList size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Public top navigation bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Brand */}
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-tight">
              {settings.portalName}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
              Poster Registration Portal
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-end items-center gap-2 w-full sm:w-auto">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <div className="w-px h-5 bg-slate-200 mx-1" />

            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all border border-slate-200"
            >
              <Shield size={13} />
              Admin
            </Link>
          </nav>

        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 font-medium">
        {settings.portalName} · Managed by {settings.chairman} · Contact: {settings.email}
      </footer>

    </div>
  );
}
