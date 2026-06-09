import { useRequests } from "../../context/RequestContext";
import { Calendar, CheckCircle, Clock, MapPin, Users } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Programs() {
  const contextData = useRequests();
  const requests = Array.isArray(contextData?.requests) ? contextData.requests : [];
  const results = Array.isArray(contextData?.results) ? contextData.results : [];
  const isLoading = contextData?.isLoading;

  const approvedPrograms = requests.filter(
    (r) => r.status === "Approved" || r.status === "Completed"
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Calendar className="text-blue-500" />
            Union Programs Archive
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Historical retrospective of Union approved and completed activities.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
          <span className="text-blue-700 font-black text-xl">{approvedPrograms.length}</span>
          <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">Programs</span>
        </div>
      </div>

      {/* Grid */}
      {approvedPrograms.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-400 font-semibold">
          No approved or completed programs found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedPrograms.map((program, i) => {
            const winnersCount = results.filter(
              (r) => r.programName.toLowerCase() === program.programName.toLowerCase() && r.isPublished
            ).length;

            return (
              <div
                key={program.requestId}
                className="glass-card rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 hover:shadow-glow-blue animate-scale-in"
                style={{ animationDelay: `${i * 60}ms` }}
                tabIndex={0}
                aria-label={`Program: ${program.programName}`}
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-blue-100">
                      {program.category}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      program.status === "Completed"
                        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                        : "text-amber-600 bg-amber-50 border-amber-100"
                    }`}>
                      {program.status === "Completed"
                        ? <><CheckCircle size={10} /> Completed</>
                        : <><Clock size={10} /> Approved</>
                      }
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-extrabold text-slate-800 text-base tracking-tight leading-snug line-clamp-2">
                    {program.programName}
                  </h2>
                  <p className="text-slate-400 text-xs font-semibold italic">"{program.programTitle}"</p>

                  {/* Details */}
                  <div className="space-y-1.5 bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 text-[11px] font-semibold text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <Clock size={10} className="text-slate-400 shrink-0" />
                      {new Date(program.eventDateTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={10} className="text-slate-400 shrink-0" />
                      {program.venue}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users size={10} className="text-slate-400 shrink-0" />
                      {program.committee}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Placements Recorded</span>
                  <span className={`px-2.5 py-0.5 rounded-full border font-black ${
                    winnersCount > 0
                      ? "text-blue-600 bg-blue-50 border-blue-100"
                      : "text-slate-400 bg-slate-50 border-slate-200"
                  }`}>
                    {winnersCount} {winnersCount === 1 ? "Winner" : "Winners"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
