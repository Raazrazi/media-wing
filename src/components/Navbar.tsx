import { useState, useRef, useEffect } from "react";
import { Bell, Plus, Shield, Menu, LogOut, User, Lock, LayoutDashboard, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRequests } from "../context/RequestContext";
import { useAuth } from "../context/AuthContext";
import { transitions } from "../styles/animations";

interface NavbarProps {
  onMenuToggle: () => void;
  isAdmin?: boolean;
  adminUser?: string | null;
}

export default function Navbar({ onMenuToggle, isAdmin = false, adminUser = null }: NavbarProps) {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const {
    notifications,
    markNotificationsAsRead,
    settings
  } = useRequests();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const notifMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setShowAdminMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const handleLogout = () => {
      logout();
      navigate("/admin/login", { replace: true });
    };

  const handleNotifClick = () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu) {
      markNotificationsAsRead();
    }
  };

  const formatTimeAgo = (isoStr: string) => {
    const date = new Date(isoStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-30">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="font-bold text-xl text-slate-800 tracking-tight">
              {settings.portalName}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Poster & Publicity Design Queue
            </p>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">

        {/* Admin / Public View Switcher */}
        {isAdmin ? (
          <Link
            to="/"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition text-slate-700 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-200"
            title="Switch to Public View"
          >
            <Globe size={15} className="text-slate-500" />
            <span>Public View</span>
          </Link>
        ) : isAuthenticated ? (
          <Link
            to="/admin/login"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm"
            title="Admin Login"
          >
            <LayoutDashboard size={15} />
            <span>Admin Panel</span>
          </Link>
        ) : (
          <Link
            to="/admin/login"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 transition text-white px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-700 shadow-sm"
            title="Admin Login"
          >
            <Lock size={15} className="text-slate-300" />
            <span>Admin</span>
          </Link>
        )}

        {/* Notifications Center */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={handleNotifClick}
            className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-600"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={transitions.smooth}
              className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 origin-top-right"
            >
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Recent Activity Logs
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-400 text-sm">
                    No recent notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                        !notif.read ? "bg-blue-50/20" : ""
                      }`}
                    >
                      <p className="text-sm text-slate-700 leading-snug">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick New Request Button */}
        {isAdmin && (
          <div className="relative" ref={adminMenuRef}>
            <button
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 transition text-blue-700 px-3.5 py-2 rounded-xl text-sm font-semibold border border-blue-200"
            >
              <Lock size={16} className="text-blue-600" />
              <span>{adminUser || "Admin"}</span>
              <span className="text-blue-400 text-xs">▼</span>
            </button>

            {showAdminMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={transitions.smooth}
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 origin-top-right"
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Admin Portal</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-2">
                    <User size={14} />
                    {adminUser || "Admin"}
                  </p>
                </div>
                <Link
                  to="/admin/settings"
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Shield size={14} className="text-slate-400" />
                  Admin Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-slate-100 mt-2 pt-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        )}

        <Link
          to={isAdmin ? "/admin/new-request" : "/new-request"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center justify-center w-full sm:w-auto gap-2 text-sm font-semibold transition-all hover:shadow-glow-blue"
        >
          <Plus size={16} />
          New Request
        </Link>

      </div>
    </div>

    </header>
  );
}