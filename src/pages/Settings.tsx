import { useState, useEffect } from "react";
import { useRequests } from "../context/RequestContext";
import {
  Save,
  Trash2,
  Database,
  CheckCircle,
  AlertTriangle,
  Globe,
  User,
  Clock,
  Mail
} from "lucide-react";

export default function Settings() {
  const { settings, updateSettings, seedDemoData, clearDatabase } = useRequests();

  // Settings form local state
  const [form, setForm] = useState({
    portalName: settings.portalName,
    chairman: settings.chairman,
    deadline: String(settings.deadline),
    email: settings.email
  });

  const [feedback, setFeedback] = useState("");
  const [showResetWarning, setShowResetWarning] = useState(false);

  // Keep form in sync if settings update externally (e.g. database seed)
  useEffect(() => {
    setForm({
      portalName: settings.portalName,
      chairman: settings.chairman,
      deadline: String(settings.deadline),
      email: settings.email
    });
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineNum = parseInt(form.deadline, 10);
    
    if (isNaN(deadlineNum) || deadlineNum < 0) {
      alert("Deadline must be a positive number of hours.");
      return;
    }

    updateSettings({
      portalName: form.portalName,
      chairman: form.chairman,
      deadline: deadlineNum,
      email: form.email
    });

    setFeedback("Portal configurations updated successfully.");
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleSeed = () => {
    if (window.confirm("Seed default mock requests into LocalStorage? This will restore standard sample events.")) {
      seedDemoData();
      setFeedback("Database seeded with sample demo requests.");
      setTimeout(() => setFeedback(""), 4000);
    }
  };

  const handleReset = () => {
    clearDatabase();
    setShowResetWarning(false);
    setFeedback("Database has been completely cleared.");
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          System Preferences
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Configure submission policies, contact profiles, and database parameters.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Side: Form Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100 flex items-center gap-2">
              ⚙️ General Portal Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Globe size={14} className="text-slate-400" />
                  Portal Brand Title
                </label>
                <input
                  type="text"
                  value={form.portalName}
                  onChange={(e) => setForm({ ...form, portalName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" />
                  Media Wing Chairman
                </label>
                <input
                  type="text"
                  value={form.chairman}
                  onChange={(e) => setForm({ ...form, chairman: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400" />
                  Submission Deadline (Hours)
                </label>
                <input
                  type="number"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400" />
                  Chairman Contact Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 hover:shadow-glow-blue"
              >
                <Save size={14} />
                Save System Configurations
              </button>
            </div>
          </form>

          {feedback && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-center rounded-2xl p-4 text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
              <CheckCircle size={18} />
              {feedback}
            </div>
          )}

        </div>

        {/* Right Side: Maintenance Controls */}
        <div className="space-y-6">
          
          {/* Card 1: Maintenance */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Database Operations</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Maintenance utilities to manage LocalStorage cache database and test queue features.
            </p>
            
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSeed}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 border border-slate-200"
              >
                <Database size={14} className="text-slate-500" />
                Seed Sample Demo Data
              </button>
              
              <button
                onClick={() => setShowResetWarning(true)}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 border border-rose-100"
              >
                <Trash2 size={14} />
                Flush Database Cache
              </button>
            </div>
          </div>

          {/* Reset Warning Overlay box */}
          {showResetWarning && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-3xl p-6 shadow-sm space-y-4 animate-scale-in">
              <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                <AlertTriangle size={18} className="text-red-600 animate-bounce" />
                Confirm Database Flush
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                This action is irreversible. All submitted requests, remarks logs, and session statistics stored in your local browser cache will be wiped clean.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg transition"
                >
                  Yes, Clear Cache
                </button>
                <button
                  onClick={() => setShowResetWarning(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}