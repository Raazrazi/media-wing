import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useRequests } from "../context/RequestContext";
import StatusBadge from "../components/StatusBadge";
import {
  Calendar,
  MapPin,
  Users,
  Mail,
  FileText,
  ArrowLeft,
  Shield,
  MessageSquare,
  Bookmark,
  CheckCircle,
  Award
} from "lucide-react";
import type { PosterRequest } from "../types/Request";

export default function RequestDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { requests, currentRole, updateRequestStatus } = useRequests();
  const isAdmin = location.pathname.startsWith("/admin");
  const backPath = isAdmin ? "/admin/requests" : "/requests";

  const request = requests.find(r => r.requestId === id);

  // Review states
  const [status, setStatus] = useState<PosterRequest["status"]>(request?.status || "Pending");
  const [remarks, setRemarks] = useState(request?.remarks || "");
  const [successMsg, setSuccessMsg] = useState("");

  if (!request) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 animate-scale-in">
        <span className="text-5xl">🔍</span>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Request Not Found</h2>
        <p className="text-slate-500 text-sm">
          We could not find any active publicity request registered with ID <strong className="text-slate-800">{id}</strong>.
        </p>
        <div className="pt-4">
          <Link
            to={backPath}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-sm"
          >
            Return to Requests Queue
          </Link>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRequestStatus(request.requestId, status, remarks);
    setSuccessMsg("Request review status saved successfully.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const isReviewer = currentRole === "Media Chairman" || currentRole === "Media Wing Administrator";

  // Visual status step calculator
  const statusSteps = [
    { label: "Submitted", active: true, checked: true },
    { label: "In Review", active: true, checked: request.status !== "Pending" || remarks !== "" },
    { 
      label: request.status === "Rejected" ? "Rejected" : request.status === "Completed" ? "Completed" : "Decided", 
      active: ["Approved", "Rejected", "Completed"].includes(request.status),
      checked: ["Approved", "Rejected", "Completed"].includes(request.status)
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-5 border-slate-200 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
            <Link to={backPath} className="hover:text-blue-500 transition-colors">Queue Database</Link>
            <span>/</span>
            <span className="text-slate-600">{request.requestId}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Request: {request.programName}
          </h1>
        </div>
        <Link
          to={backPath}
          className="text-slate-400 hover:text-slate-600 font-semibold text-sm flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Registry
        </Link>
      </div>

      {/* Progress Timeline Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Req ID</span>
              <span className="text-sm font-extrabold text-slate-800">{request.requestId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Submission Status</span>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={request.status} />
                <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase ${getPriorityColor(request.priority)}`}>
                  {request.priority} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Visual steps */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-sm w-full">
            {statusSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                    step.checked 
                      ? "bg-blue-600 border-blue-600 text-white shadow-glow-blue" 
                      : step.active 
                      ? "bg-white border-blue-600 text-blue-600" 
                      : "bg-white border-slate-200 text-slate-300"
                  }`}>
                    {step.checked ? "✓" : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold mt-1 tracking-wide uppercase ${
                    step.active ? "text-slate-800" : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`h-[2px] flex-1 ${
                    statusSteps[idx+1].checked ? "bg-blue-600" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Double-Col Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Event schedule details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              Event Logistics
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date & Time</span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">
                    {new Date(request.eventDateTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Venue</span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">{request.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-green-50 text-green-500 rounded-xl">
                  <Users size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Organizing Committee</span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">{request.committee}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl">
                  <Bookmark size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Design Category</span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">{request.category}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Poster requirements & descriptions */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100 flex items-center gap-2">
              <FileText size={18} className="text-blue-500" />
              Design Specification details
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Program Description</span>
                <p className="text-slate-700 text-sm mt-1.5 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4.5 font-medium">
                  {request.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Poster Content & Dimensions</span>
                <p className="text-slate-700 text-sm mt-1.5 leading-relaxed bg-blue-50/10 border border-blue-50/20 rounded-2xl p-4.5 font-medium">
                  {request.posterRequirements}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Single-Col Column */}
        <div className="space-y-6">
          
          {/* Card 3: Liaison officer contact card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Liaison Information</h3>
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">
                  👤
                </div>
                <div className="overflow-hidden">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Coordinator</span>
                  <span className="text-sm font-semibold text-slate-700 block truncate">{request.contactPerson}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                  <a href={`mailto:${request.email}`} className="text-sm font-bold text-blue-600 block hover:underline">{request.email}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Remarks Box (visible if exists and user not reviewer or reviewer editing) */}
          {request.remarks && (
            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 text-slate-800 opacity-20 pointer-events-none transform -translate-y-2 translate-x-2">
                <MessageSquare size={120} />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-500/30">
                <Award size={10} />
                Chairman Remarks
              </div>
              <p className="text-slate-300 text-xs italic leading-relaxed mt-3 relative z-10">
                "{request.remarks}"
              </p>
              <div className="text-[10px] text-slate-500 font-bold tracking-wide uppercase mt-4">
                Assigned by Media Wing Review
              </div>
            </div>
          )}

          {/* Card 5: Review Action Panel (for media wing admins) */}
          {isReviewer ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Shield size={18} className="text-blue-600" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Admin Review Panel</h3>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Action Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approve Request</option>
                    <option value="Rejected">Reject Request</option>
                    <option value="On Hold">Hold Submission</option>
                    <option value="Completed">Mark as Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Administrative Remarks</label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter approval conditions, reject explanation or guidelines..."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition"
                >
                  Save Review Decision
                </button>
              </form>

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-center rounded-xl p-2.5 text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                  <CheckCircle size={14} />
                  {successMsg}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center text-xs text-slate-400 font-medium">
              🔑 Administrative action controls are locked. Please switch roles in the Navbar to modify status.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}