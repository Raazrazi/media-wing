import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Settings,
  FileSpreadsheet,
  Shield,
  Trophy,
  Image as ImageIcon,
  Volume2,
  MinusCircle,
  Calendar,
  Users,
  Home,
  X
} from "lucide-react";
import { useRequests } from "../context/RequestContext";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  isAdmin?: boolean;
}

export default function Sidebar({ open = false, onClose, isAdmin = false }: SidebarProps) {
  const { settings, currentRole } = useRequests();

  const publicMenu = [
    {
      section: "Public Portal",
      items: [
        { name: "Home", path: "/home", icon: <Home size={18} /> },
        { name: "Submit Request", path: "/new-request", icon: <PlusCircle size={18} /> },
        { name: "My Requests", path: "/requests", icon: <FileText size={18} /> },
        { name: "Results", path: "/results", icon: <Trophy size={18} /> },
        { name: "Leaderboard", path: "/leaderboard", icon: <Trophy size={18} /> },
        { name: "Rankings", path: "/rankings", icon: <Users size={18} /> },
        { name: "Programs", path: "/programs", icon: <Calendar size={18} /> },
        { name: "Gallery", path: "/gallery", icon: <ImageIcon size={18} /> },
        { name: "Notices", path: "/announcements", icon: <Volume2 size={18} /> },
      ],
    },
  ];

  const adminMenu = [
    {
      section: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: <LayoutDashboard size={18} />,
        },
        {
          name: "Analytics",
          path: "/admin/analytics",
          icon: <BarChart3 size={18} />,
        },
      ],
    },
    {
      section: "Poster Requests",
      items: [
        {
          name: "New Request",
          path: "/admin/new-request",
          icon: <PlusCircle size={18} />,
        },
        {
          name: "Request Queue",
          path: "/admin/requests",
          icon: <FileText size={18} />,
        },
        {
          name: "Reports",
          path: "/admin/reports",
          icon: <FileSpreadsheet size={18} />,
        },
      ],
    },
    {
      section: "Championship",
      items: [
        {
          name: "Results Dashboard",
          path: "/admin/results-dashboard",
          icon: <Trophy size={18} />,
        },
        {
          name: "Announced Results",
          path: "/admin/announced-results",
          icon: <Trophy size={18} />,
        },
        {
          name: "All Results",
          path: "/admin/all-results",
          icon: <Trophy size={18} />,
        },
        {
          name: "Add Result",
          path: "/admin/add-result",
          icon: <PlusCircle size={18} />,
        },
        {
          name: "Leaderboard",
          path: "/admin/leaderboard",
          icon: <Trophy size={18} />,
        },
        {
          name: "Minus Points",
          path: "/admin/minus-points",
          icon: <MinusCircle size={18} />,
        },
        {
          name: "Programs Archive",
          path: "/admin/programs",
          icon: <Calendar size={18} />,
        },
        {
          name: "Student Rankings",
          path: "/admin/students",
          icon: <Users size={18} />,
        },
      ],
    },
    {
      section: "Media & Content",
      items: [
        {
          name: "Media Gallery",
          path: "/admin/gallery",
          icon: <ImageIcon size={18} />,
        },
        {
          name: "Announcements",
          path: "/admin/announcements",
          icon: <Volume2 size={18} />,
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          name: "Settings",
          path: "/admin/settings",
          icon: <Settings size={18} />,
        },
      ],
    },
  ];

  const menu = isAdmin ? adminMenu : publicMenu;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-slate-950 text-white flex flex-col border-r border-slate-800 shadow-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-start justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-base font-black tracking-wider text-blue-400 uppercase">
            {(settings?.portalName || "Media Portal").split(" ").slice(0, 2).join(" ")}
          </h1>
          <p className="text-slate-500 text-[10px] font-bold tracking-widest mt-0.5 uppercase">
            {(settings?.portalName || "").split(" ").slice(2).join(" ") || "Control Center"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800/70 hover:text-white transition"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-5">
        {menu.map((group) => (
          <div key={group.section}>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 mb-1.5">
              {group.section}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-semibold transition-all duration-150 group ${
                    isActive
                      ? "bg-blue-600/90 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                  }`
                }
              >
                <span className="shrink-0 transition-transform duration-150 group-hover:scale-110">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User Session Info Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0">
            <Shield size={16} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Active Session
            </p>
            <p
              className="text-xs font-bold text-slate-200 truncate"
              title={currentRole}
            >
              {currentRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}