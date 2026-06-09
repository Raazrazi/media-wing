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
import Results from "./pages/results/Results";
import AddResult from "./pages/results/AddResult";
import Leaderboard from "./pages/results/Leaderboard";
import MinusPoints from "./pages/results/MinusPoints";
import Programs from "./pages/results/Programs";
import Students from "./pages/results/Students";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// New page imports
import PortalHome from "./pages/PortalHome";
import PublicGallery from "./pages/PublicGallery";
import AdminGallery from "./pages/AdminGallery";
import Announcements from "./pages/Announcements";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import ResultsDashboard from "./pages/results/ResultsDashboard";

function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-100 animate-fade-in">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-10 md:hidden"
        />
      )}
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} isAdmin={true} />
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
        <Route path="results-dashboard" element={<ResultsDashboard />} />
        <Route path="announced-results" element={<Results mode="announced" />} />
        <Route path="all-results" element={<Results mode="all" />} />
        <Route path="add-result" element={<AddResult />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="minus-points" element={<MinusPoints />} />
        <Route path="programs" element={<Programs />} />
        <Route path="students" element={<Students />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Public portal routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<PortalHome />} />
        <Route path="new-request" element={<NewRequest />} />
        <Route path="requests" element={<RequestHistory />} />
        <Route path="request/:id" element={<RequestDetails />} />
        <Route path="results" element={<Results mode="public" />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="rankings" element={<Students />} />
        <Route path="programs" element={<Programs />} />
        <Route path="minus-points" element={<MinusPoints />} />
        <Route path="gallery" element={<PublicGallery />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
