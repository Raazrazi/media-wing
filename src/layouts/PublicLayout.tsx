import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { pageTransition } from "../styles/animations";

export default function PublicLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const isSplashScreen = location.pathname === "/";

  return (
    <div className="flex min-h-screen bg-slate-50 animate-fade-in">
      {!isSplashScreen && <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} isAdmin={false} />}
      {!isSplashScreen && sidebarOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-slate-900/40 z-10 md:hidden"
        />
      )}
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {!isSplashScreen && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={sidebarOpen ? { opacity: 0, y: -100 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:relative md:opacity-100 md:translate-y-0"
            style={{
              pointerEvents: sidebarOpen ? "none" : "auto",
              position: sidebarOpen ? "fixed" : "relative",
            }}
          >
            <Navbar onMenuToggle={handleMenuToggle} isAdmin={false} />
          </motion.div>
        )}
        
        <main className={isSplashScreen ? "flex-1 overflow-y-auto" : "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar"}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageTransition} className={isSplashScreen ? "w-full h-full" : "max-w-7xl mx-auto"}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        {!isSplashScreen && <Footer />}
      </div>
    </div>
  );
}
