import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/Dashboard";
import NewRequest from "./pages/NewRequest";
import RequestHistory from "./pages/RequestHistory";
import RequestDetails from "./pages/RequestDetails";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-10 md:hidden"
        />
      )}
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Parent admin route - protects ALL /admin/* paths */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminShell />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="new-request" element={<NewRequest />} />
        <Route path="requests" element={<RequestHistory />} />
        <Route path="request/:id" element={<RequestDetails />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/" element={<PublicLayout />}>
        <Route index element={<NewRequest />} />
        <Route path="new-request" element={<NewRequest />} />
        <Route path="requests" element={<RequestHistory />} />
        <Route path="request/:id" element={<RequestDetails />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
