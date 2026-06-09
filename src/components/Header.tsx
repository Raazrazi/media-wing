import { Link } from "react-router-dom";
import { Bell, Menu, LogOut } from "lucide-react";
import { useRequests } from "../context/RequestContext";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { logout } = useAuth();
  const { settings } = useRequests();
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
      <button
        type="button"
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{settings.portalName}</h1>
        <p className="text-xs text-slate-500">Poster & Publicity Design Queue</p>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-600">
          <Bell size={20} />
        </Link>
        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-600"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
