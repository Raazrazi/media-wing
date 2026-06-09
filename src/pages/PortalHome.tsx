import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRequests } from "../context/RequestContext";
import {
  Trophy,
  Calendar,
  Image as ImageIcon,
  Play,
  Volume2,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle,
  Clock
} from "lucide-react";

export default function PortalHome() {
  const contextData = useRequests();
  const requests = Array.isArray(contextData?.requests) ? contextData.requests : [];
  const results = Array.isArray(contextData?.results) ? contextData.results : [];
  const galleryItems = Array.isArray(contextData?.galleryItems) ? contextData.galleryItems : [];
  const announcements = Array.isArray(contextData?.announcements) ? contextData.announcements : [];
  const [showWelcome, setShowWelcome] = useState(false);

  // Welcome Popup Check (First visit only)
  useEffect(() => {
    const hasVisited = localStorage.getItem("visited_result_portal_once");
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem("visited_result_portal_once", "true");
    setShowWelcome(false);
  };



  // 1. Latest Poster
  const latestPoster = galleryItems.find(
    (item) => item.category === "Posters" && item.isPublished
  ) || galleryItems.find((item) => item.category === "Posters");

  // 2. Latest Video
  const latestVideo = galleryItems.find(
    (item) => item.category === "Videos" && item.isPublished
  ) || galleryItems.find((item) => item.category === "Videos");

  // 3. Latest Result
  const latestResult = results.find((r) => r.isPublished) || results[0];

  // 4. Upcoming Program (Not rejected, date in future)
  const now = new Date();
  const upcomingProgram = requests
    .filter((r) => r.status !== "Rejected" && new Date(r.eventDateTime) > now)
    .sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime())[0];

  // Time remaining countdown formatter
  const getTimeRemaining = (dateTimeStr: string) => {
    const target = new Date(dateTimeStr);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return "Event starting now";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    return `${hours}h ${Math.floor((diff / (1000 * 60)) % 60)}m remaining`;
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      {/* Welcome Popup (Module I) */}
      {showWelcome && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-scale-in">
            {/* Background design */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />

            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
                <Sparkles size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Welcome to Result Portal
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Manage campus competitions, publish result queues, and explore rankings efficiently.
                </p>
              </div>

              {/* Features checklist */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-left space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Core Portal Features
                </p>
                <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Draft Result Storage & Approval</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Championship Leaderboard stand-ups</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Individual Student Performance Rankings</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Media Archive & Gallery Distribution</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Analytics & Auditing Exports</span>
                </div>
              </div>

              <button
                onClick={closeWelcome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition shadow-md hover:shadow-glow-blue cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-950 to-blue-950 p-8 md:p-12 text-white border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
          <Trophy size={320} />
        </div>

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-500/30">
            <Sparkles size={12} className="animate-spin-slow" />
            Students' Union Hub
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300">
            Union Media & Results Portal
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            The central digital system for submitting poster requests, checking live competition standings, viewing student ranks, and browsing the publicity media gallery.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/new-request"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition flex items-center gap-2 hover:shadow-glow-blue"
            >
              <Plus size={16} />
              Submit Poster Request
            </Link>
            <Link
              to="/results"
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm px-6 py-3.5 rounded-2xl border border-slate-700 transition flex items-center gap-2"
            >
              Inspect Competition Results
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Featured Content (Left) + Announcements (Right) */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Featured Content (Module N) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                Featured Content
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Highlights from around the Union campus
              </p>
            </div>
            <Link
              to="/gallery"
              className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1"
            >
              View Gallery <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Latest Poster */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="relative aspect-video bg-slate-900">
                  {latestPoster ? (
                    <img
                      src={latestPoster.thumbnail}
                      alt={latestPoster.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Latest Poster
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                    {latestPoster ? latestPoster.title : "No poster published"}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {latestPoster ? latestPoster.description : "Check back later for newly designed promotional posters."}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  to="/gallery"
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <ImageIcon size={14} /> Browse Gallery
                </Link>
              </div>
            </div>

            {/* Latest Video */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="relative aspect-video bg-slate-950 flex items-center justify-center group overflow-hidden">
                  {latestVideo ? (
                    <>
                      <img
                        src={latestVideo.thumbnail}
                        alt={latestVideo.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/20" />
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-slate-900 shadow-md group-hover:scale-110 transition z-10">
                        <Play size={20} className="ml-1" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Play size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10">
                    Latest Video
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                    {latestVideo ? latestVideo.title : "No video uploaded"}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {latestVideo ? latestVideo.description : "Browse the publicity reel compilation videos."}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  to="/gallery"
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Play size={14} /> Watch Media Reels
                </Link>
              </div>
            </div>

            {/* Latest Result Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b pb-2 border-slate-100">
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Latest Result
                  </span>
                  <Trophy size={16} className="text-yellow-500 animate-pulse" />
                </div>

                {latestResult ? (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-800 text-base">
                      {latestResult.programName}
                    </h3>
                    <div className="space-y-2 bg-slate-50 rounded-xl p-3 border border-slate-200/40 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Student:</span>
                        <span className="text-slate-800">{latestResult.studentName} ({latestResult.className})</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Rank / Prize:</span>
                        <span className="text-blue-600">{latestResult.prize} Place</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Awarded Points:</span>
                        <span className="text-emerald-600">+{latestResult.points} Points</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs py-6 text-center">No published results found.</p>
                )}
              </div>
              <Link
                to="/results"
                className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                Inspect Standings Board <ArrowRight size={12} />
              </Link>
            </div>

            {/* Upcoming Event Alert Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b pb-2 border-slate-100">
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Upcoming Program
                  </span>
                  <Calendar size={16} className="text-blue-500" />
                </div>

                {upcomingProgram ? (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-800 text-base line-clamp-1">
                      {upcomingProgram.programName}
                    </h3>
                    <div className="space-y-2 bg-slate-50 rounded-xl p-3 border border-slate-200/40 text-xs">
                      <div className="flex items-center gap-2 font-semibold">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-slate-800">{getTimeRemaining(upcomingProgram.eventDateTime)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Venue:</span>
                        <span className="text-slate-800 truncate max-w-[150px]">{upcomingProgram.venue}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Committee:</span>
                        <span className="text-slate-800 truncate max-w-[150px]">{upcomingProgram.committee}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs py-6 text-center">No upcoming events scheduled.</p>
                )}
              </div>
              <Link
                to="/new-request"
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Plus size={12} /> Register Poster Request
              </Link>
            </div>
          </div>
        </div>

        {/* Announcements List Section */}
        <div className="space-y-6">
          <div className="border-b pb-3 border-slate-200">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Volume2 className="text-blue-600 animate-bounce" size={20} />
              Announcements
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Notice board & union activity alerts
            </p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {announcements.length === 0 ? (
              <div className="bg-white border rounded-3xl p-8 text-center text-slate-400 text-sm">
                No active announcements at this time.
              </div>
            ) : (
              announcements.map((announce) => (
                <div
                  key={announce._id || announce.title}
                  className={`bg-white border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden transition-all hover:translate-x-1 ${
                    announce.isImportant
                      ? "border-amber-300 bg-amber-50/15"
                      : "border-slate-200/80"
                  }`}
                >
                  {announce.isImportant && (
                    <div className="absolute top-0 right-0 w-3 h-full bg-amber-500" />
                  )}

                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug">
                      {announce.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {announce.content}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1 border-t border-slate-100">
                    <Info size={10} />
                    Posted: {new Date(announce.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
