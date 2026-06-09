import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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

  return (
    <div className="flex min-h-screen bg-slate-50 animate-fade-in">
      <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} isAdmin={false} />
      {sidebarOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-slate-900/40 z-10 md:hidden"
        />
      )}
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar onMenuToggle={handleMenuToggle} isAdmin={false} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
          <Footer />
      </div>
    </div>
  );
}
