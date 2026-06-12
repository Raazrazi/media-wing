import { Link, useLocation } from "react-router-dom";
import { useRequests } from "../context/RequestContext";
import type { PosterRequest } from "../types/Request";
import StatusBadge from "./StatusBadge";
import { Eye, Calendar, User, Tag, Trash2 } from "lucide-react";

interface RequestTableProps {
  requests: PosterRequest[];
  title?: string;
  limit?: number;
}

export default function RequestTable({
  requests,
  title = "Poster Requests Queue",
  limit
}: RequestTableProps) {
  const { deleteRequest } = useRequests();
  const location = useLocation();
  const showAction = location.pathname.startsWith("/admin");
  const displayRequests = limit ? requests.slice(0, limit) : requests;

  const getPriorityStyle = (priority: PosterRequest["priority"]) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-200";
      case "High":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-glow-blue overflow-hidden animate-slide-up">
      
      {/* Table Title Bar */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Showing {displayRequests.length} of {requests.length} total requests
          </p>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto custom-scrollbar hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/50 border-b border-slate-200/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Request ID
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Program & Category
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Organizing Body
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Event Schedule
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Priority
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>
              {showAction && (
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayRequests.length === 0 ? (
              <tr>
                <td colSpan={showAction ? 7 : 6} className="text-center py-16 text-slate-400 bg-white">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📭</span>
                    <p className="text-sm font-semibold">No requests found in this list</p>
                    <p className="text-xs text-slate-400">Try adjusting your filters or submit a new request</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayRequests.map((request) => (
                <tr
                  key={request.requestId}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* ID */}
                  <td className="px-6 py-4.5 font-bold text-slate-700 text-sm">
                    {request.requestId}
                  </td>

                  {/* Program Title & Category */}
                  <td className="px-6 py-4.5">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                        {request.programName}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {request.programTitle}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 uppercase tracking-wide">
                        <Tag size={8} />
                        {request.category}
                      </span>
                    </div>
                  </td>

                  {/* Organizing Body */}
                  <td className="px-6 py-4.5 text-slate-600 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-slate-400" />
                      {request.committee}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4.5 text-slate-600 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(request.eventDateTime).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4.5 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${getPriorityStyle(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4.5">
                    <StatusBadge status={request.status} />
                  </td>

                  {showAction && (
                    <td className="px-6 py-4.5 text-center space-y-2">
                      <div className="flex flex-wrap justify-center gap-2">
                        <Link
                          to={`/admin/request/${request.requestId}`}
                          className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-glow-blue"
                        >
                          <Eye size={12} />
                          View
                        </Link>
                        <button
                          onClick={async () => {
                            try {
                              await deleteRequest(request.requestId);
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-glow-red"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {displayRequests.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 text-center text-slate-500">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm font-semibold">No requests found in this list</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or submit a new request</p>
          </div>
        ) : (
          displayRequests.map((request) => (
            <article key={request.requestId} className="group rounded-3xl border border-slate-200/80 bg-slate-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Request ID</p>
                  <p className="font-bold text-slate-800 mt-2">{request.requestId}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getPriorityStyle(request.priority)}`}>
                  {request.priority}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Program</p>
                  <p className="font-semibold text-slate-800 mt-2">{request.programName}</p>
                  <p className="text-xs text-slate-500 mt-1">{request.programTitle}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs text-slate-500">
                    <Tag size={12} />
                    {request.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Committee</p>
                    <p className="font-semibold text-slate-800 mt-2">{request.committee}</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Schedule</p>
                    <p className="font-semibold text-slate-800 mt-2">
                      {new Date(request.eventDateTime).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Status</p>
                      <div className="mt-2"><StatusBadge status={request.status} /></div>
                    </div>
                    {showAction && (
                      <Link
                        to={`/admin/request/${request.requestId}`}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-2xl text-xs font-bold transition-all"
                      >
                        <Eye size={12} />
                        View
                      </Link>
                    )}
                  </div>
                  {showAction && (
                    <button
                      onClick={async () => {
                        try {
                          await deleteRequest(request.requestId);
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-2xl text-xs font-bold transition-all"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}