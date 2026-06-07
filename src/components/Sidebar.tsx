import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Settings,
  FileSpreadsheet,
  Shield,
  X
} from "lucide-react";
import { useRequests } from "../context/RequestContext";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const { settings, currentRole } = useRequests();

  const menu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "New Request",
      path: "/admin/new-request",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "Requests",
      path: "/admin/requests",
      icon: <FileText size={20} />,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FileSpreadsheet size={20} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-slate-950 text-white flex flex-col border-r border-slate-800 shadow-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-blue-500 uppercase">
            {settings.portalName.split(" ").slice(0, 2).join(" ")}
          </h1>
          <p className="text-slate-400 text-xs font-medium tracking-wide mt-1 uppercase">
            {settings.portalName.split(" ").slice(2).join(" ") || "Media Portal"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800/70 hover:text-white transition"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg mb-2 text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-blue-600/90 text-white shadow-glow-blue active-nav-glow"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`
            }
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Session Info Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <Shield size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Active Session
            </p>
            <p className="text-sm font-semibold text-slate-200 truncate" title={currentRole}>
              {currentRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}