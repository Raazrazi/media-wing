import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { pageTransition } from "../styles/animations";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser } = useAuth();
  const location = useLocation();

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} isAdmin={true} />
      {sidebarOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden"
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onMenuToggle={handleMenuToggle} isAdmin={true} adminUser={adminUser} />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageTransition}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
