import { useState } from "react";
import { useRequests } from "../context/RequestContext";
import { Volume2, Calendar, AlertTriangle, BellRing } from "lucide-react";

export default function Announcements() {
  const contextData = useRequests();
  const announcements = Array.isArray(contextData?.announcements) ? contextData.announcements : [];
  const [filterImportant, setFilterImportant] = useState(false);

  const filtered = announcements.filter(
    (a) => !filterImportant || a.isImportant
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Volume2 className="text-blue-600" />
            Notice Board & Announcements
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Keep track of upcoming deadlines, general announcements, and union reminders.
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setFilterImportant(!filterImportant)}
          className={`px-4.5 py-2.5 text-xs font-extrabold rounded-xl border transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
            filterImportant
              ? "bg-amber-100 border-amber-200 text-amber-700 shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <AlertTriangle size={14} />
          {filterImportant ? "Showing Alert Bulletins" : "Filter Urgent Notices"}
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filtered.length === 0 ? (
          <div className="bg-white border rounded-3xl p-16 text-center text-slate-400 font-semibold shadow-sm">
            No announcements found matching the criteria.
          </div>
        ) : (
          filtered.map((announce) => (
            <div
              key={announce._id || announce.title}
              className={`bg-white border rounded-3xl p-6 shadow-sm flex gap-5 items-start relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                announce.isImportant
                  ? "border-amber-300 bg-amber-50/10"
                  : "border-slate-200"
              }`}
            >
              {announce.isImportant && (
                <div className="absolute top-0 left-0 w-3 h-full bg-amber-500" />
              )}

              <div
                className={`p-3 rounded-2xl shrink-0 border ${
                  announce.isImportant
                    ? "bg-amber-100 text-amber-600 border-amber-200"
                    : "bg-slate-50 text-slate-500 border-slate-100"
                }`}
              >
                <BellRing size={20} className={announce.isImportant ? "animate-swing" : ""} />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-slate-800 text-base tracking-tight leading-snug">
                    {announce.title}
                  </h2>
                  {announce.isImportant && (
                    <span className="bg-amber-100 border border-amber-200 text-amber-800 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0">
                      Alert bulletin
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {announce.content}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2.5 border-t border-slate-100 mt-2">
                  <Calendar size={10} />
                  Published Date: {new Date(announce.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
