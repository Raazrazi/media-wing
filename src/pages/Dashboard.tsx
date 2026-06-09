import { useRequests } from "../context/RequestContext";
import RequestTable from "../components/RequestTable";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Layers
} from "lucide-react";

export default function Dashboard() {
  const contextData = useRequests();
  const requests = Array.isArray(contextData?.requests) ? contextData.requests : [];
  
  // Metrics calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const rejectedCount = requests.filter(r => r.status === "Rejected").length;

  // Upcoming programs (scheduled after now)
  const nowTime = new Date().getTime();
  const upcomingPrograms = requests.filter(r => {
    const time = new Date(r.eventDateTime).getTime();
    return time > nowTime && r.status !== "Rejected";
  });

  // Programs scheduled within the next 30 days
  const thirtyDaysLater = nowTime + 1000 * 60 * 60 * 24 * 30;
  const next30DaysCount = upcomingPrograms.filter(r => {
    const time = new Date(r.eventDateTime).getTime();
    return time <= thirtyDaysLater;
  }).length;

  const stats = [
    {
      title: "Total Requests",
      value: totalCount,
      icon: <FileText size={24} />,
      color: "bg-blue-600",
      glowColor: "shadow-glow-blue",
      percentage: "100%"
    },
    {
      title: "Pending Approval",
      value: pendingCount,
      icon: <Clock size={24} />,
      color: "bg-amber-500",
      glowColor: "shadow-glow-yellow",
      percentage: totalCount > 0 ? `${Math.round((pendingCount / totalCount) * 100)}%` : "0%"
    },
    {
      title: "Approved Designs",
      value: approvedCount,
      icon: <CheckCircle size={24} />,
      color: "bg-emerald-500",
      glowColor: "shadow-glow-green",
      percentage: totalCount > 0 ? `${Math.round((approvedCount / totalCount) * 100)}%` : "0%"
    },
    {
      title: "Rejected / Defunct",
      value: rejectedCount,
      icon: <XCircle size={24} />,
      color: "bg-rose-500",
      glowColor: "shadow-glow-purple",
      percentage: totalCount > 0 ? `${Math.round((rejectedCount / totalCount) * 100)}%` : "0%"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Monitor poster requirements, designer queues, and program approvals.
          </p>
        </div>
        
        <Link
          to="/new-request"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition-all hover:shadow-glow-blue"
        >
          <Plus size={16} />
          Create Poster Request
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className={`bg-white rounded-3xl border border-slate-200/80 p-6 flex justify-between items-center transition-all hover:-translate-y-1 hover:shadow-lg ${item.glowColor}`}
          >
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {item.title}
              </p>
              <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">
                {item.value}
              </h2>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full mt-2 inline-block">
                {item.percentage} of queue
              </span>
            </div>

            <div className={`${item.color} p-3.5 rounded-2xl text-white shadow-sm`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Hero Alert & Quick Actions Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Notice Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[200px]">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
            <Calendar size={220} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-blue-500/30">
              <Award size={12} />
              Activity Status
            </div>
            <h2 className="text-2xl font-bold mt-4 tracking-tight">
              Upcoming Scheduled Events
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-lg leading-relaxed">
              We have detected <strong className="text-white font-semibold">{next30DaysCount} programs</strong> registered on the calendar within the next 30 days. The design wing is actively reviewing queues.
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <Link
              to="/admin/requests"
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              Inspect Events Calendar
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/85 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Quick Shortcuts</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Frequent administrative functions</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              to="/admin/new-request"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 transition border border-blue-100/30 text-blue-700 text-center"
            >
              <Plus size={20} />
              <span className="text-xs font-bold">New Poster</span>
            </Link>
            <Link
              to="/admin/requests"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 transition border border-amber-100/30 text-amber-700 text-center"
            >
              <Layers size={20} />
              <span className="text-xs font-bold">Manage Queue</span>
            </Link>
            <Link
              to="/admin/analytics"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition border border-purple-100/30 text-purple-700 text-center"
            >
              <TrendingUp size={20} />
              <span className="text-xs font-bold">Analytics</span>
            </Link>
            <Link
              to="/admin/reports"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 transition border border-emerald-100/30 text-emerald-700 text-center"
            >
              <FileText size={20} />
              <span className="text-xs font-bold">Export Audit</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Request List */}
      <div>
        <RequestTable
          requests={requests}
          limit={5}
          title="Recent Publicity Registrations"
        />
      </div>

    </div>
  );
}