import { useRequests } from "../../context/RequestContext";
import { Link } from "react-router-dom";
import {
  Trophy,
  Award,
  PlusCircle,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  Shield,
  
} from "lucide-react";

export default function ResultsDashboard() {
  const contextData = useRequests();
  const results = Array.isArray(contextData?.results) ? contextData.results : [];
  

  // Calculations
  const draftResults = results.filter((r) => !r.isPublished);
  const publishedResults = results.filter((r) => r.isPublished);

  const totalProgramsCount = new Set(results.map((r) => r.programName.toLowerCase())).size;
  const totalParticipantsCount = new Set(results.map((r) => r.studentName.toLowerCase())).size;

  // Leaderboard standings calculation
  const classes: ("SIDRA" | "USRA" | "WAFD" | "WIDAD" | "ITHIHAD" | "IFADA")[] = ["SIDRA", "USRA", "WAFD", "WIDAD", "ITHIHAD", "IFADA"];
  const leaderboardStandings = classes
    .map((cls) => {
      const earned = results
        .filter((r) => r.className === cls && r.isPublished)
        .reduce((sum, r) => sum + r.points, 0);
      return { class: cls, points: earned };
    })
    .sort((a, b) => b.points - a.points)
    .slice(0, 3); // top 3 for preview widget

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section (Module H Requirement) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 p-8 text-white border border-blue-800 shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
          <Trophy size={220} />
        </div>
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-blue-400/20">
            <Shield size={12} />
            Administrator Portal
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-none uppercase">
            Result Management System
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage, Review, Publish and Analyze Competition Results. Calculate aggregate points standings and apply class deductions.
          </p>
        </div>
      </div>

      {/* Quick Actions Panel (Module H Requirement) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-base mb-4">Quick Placements Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/add-result"
            className="flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl transition group text-blue-700"
          >
            <div className="flex items-center gap-3">
              <PlusCircle size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Add Event Result</span>
            </div>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            to="/admin/results"
            className="flex items-center justify-between p-4 bg-amber-50/50 hover:bg-amber-50 border border-amber-100 rounded-2xl transition group text-amber-700"
          >
            <div className="flex items-center gap-3">
              <Clock size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Review Drafts</span>
            </div>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            to="/admin/results"
            className="flex items-center justify-between p-4 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-2xl transition group text-emerald-700"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Published Results</span>
            </div>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* Metrics Statistics Grid (Module H Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Draft Results</p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">{draftResults.length}</h2>
          </div>
          <span className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Clock size={20} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Published Results</p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">{publishedResults.length}</h2>
          </div>
          <span className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <CheckCircle size={20} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Programs</p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">{totalProgramsCount}</h2>
          </div>
          <span className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Layers size={20} />
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Participants</p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">{totalParticipantsCount}</h2>
          </div>
          <span className="p-3 bg-purple-50 text-purple-500 rounded-xl">
            <Award size={20} />
          </span>
        </div>
      </div>

      {/* Widgets Grid: Drafts (Left) + Leaderboard & Published (Right) */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Draft Results Widget */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3 border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm">Recent Draft Placements</h3>
            <Link to="/admin/results" className="text-blue-600 hover:text-blue-700 font-bold text-xs">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {draftResults.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center font-semibold">
                No draft results awaiting verification.
              </p>
            ) : (
              draftResults.slice(0, 4).map((r) => (
                <div key={r._id} className="py-3 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <p className="font-bold text-slate-800">{r.programName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {r.studentName} ({r.className}) - {r.prize} Place
                    </p>
                  </div>
                  <Link
                    to="/admin/results"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-blue-100 transition"
                  >
                    Verify & Publish
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leaderboard Preview & Recent Published */}
        <div className="space-y-6">
          {/* Leaderboard Standings Preview Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <Trophy size={16} className="text-yellow-500" />
                Leaderboard Standings
              </h3>
              <Link to="/admin/leaderboard" className="text-blue-600 hover:text-blue-700 font-bold text-xs">
                Inspect
              </Link>
            </div>
            <div className="space-y-3">
              {leaderboardStandings.map((standing, index) => (
                <div key={standing.class} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span className="text-slate-700">{standing.class}</span>
                  </div>
                  <span className="text-blue-600 font-black">{standing.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Published Results Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm">Recent Published Placements</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {publishedResults.length === 0 ? (
                <p className="text-slate-400 text-xs py-6 text-center font-semibold">
                  No published results recorded.
                </p>
              ) : (
                publishedResults.slice(0, 3).map((r) => (
                  <div key={r._id} className="py-2.5 flex justify-between items-center text-xs font-semibold">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{r.programName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {r.studentName} - {r.prize} Place
                      </p>
                    </div>
                    <span className="text-emerald-600 font-bold">+{r.points} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
