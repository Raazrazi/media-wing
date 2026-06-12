import { useState } from "react";
import { useRequests } from "../../context/RequestContext";
import { Search, Trophy, Globe, EyeOff, Trash2, CheckSquare } from "lucide-react";

export default function Results({ mode = "public" }: { mode?: "all" | "announced" | "public" }) {
  const contextData = useRequests();
  const results = Array.isArray(contextData?.results) ? contextData.results : [];
  const deleteResult = contextData?.deleteResult;
  const publishResult = contextData?.publishResult;
  
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAdminView = mode === "all" || mode === "announced";
  const isAllMode = mode === "all";

  // Filter based on mode & query
  const filteredResults = results.filter((item) => {
    const matchesSearch = item.programName.toLowerCase().includes(search.toLowerCase()) ||
                          item.studentName.toLowerCase().includes(search.toLowerCase());
    
    let matchesVisibility = true;
    if (mode === "public" || mode === "announced") {
      matchesVisibility = item.isPublished;
    } else if (mode === "all") {
      matchesVisibility = true;
    }
    
    return matchesSearch && matchesVisibility;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredResults.map(r => r._id).filter(Boolean) as string[]);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handlePublishSelected = () => {
    selectedIds.forEach(id => {
      if (publishResult) {
        publishResult(id, true);
      }
    });
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Widget */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            {mode === "announced" ? "Announced Results" : mode === "all" ? "All Results" : "Competition Results"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isAdminView 
              ? mode === "announced" 
                ? "View officially published class competition results." 
                : "Review all draft and published results. Select drafts to publish." 
              : "Official published program winners list."}
          </p>
        </div>
        
        {/* Bulk Action Button for Admin All Results mode */}
        {isAllMode && selectedIds.length > 0 && (
          <button
            onClick={handlePublishSelected}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-sm"
          >
            <CheckSquare size={16} />
            Publish Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full sm:max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by program or student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
        />
      </div>

      {/* Mobile Result Cards */}
      <div className="space-y-4 sm:hidden">
        {filteredResults.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center text-slate-500 font-semibold">
            No results found.
          </div>
        ) : (
          filteredResults.map((item) => (
            <div key={item._id || `${item.programName}-${item.studentName}`} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-[0.25em] font-bold">Program</p>
                  <p className="text-base font-black text-slate-900">{item.programName}</p>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                  {item.prize} Place
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-2xl p-3">
                  <p className="text-slate-400 text-[10px] uppercase tracking-[0.25em] font-semibold">Student</p>
                  <p className="font-semibold text-slate-800">{item.studentName}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3">
                  <p className="text-slate-400 text-[10px] uppercase tracking-[0.25em] font-semibold">Class</p>
                  <p className="font-semibold text-slate-800">{item.className}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="px-3 py-2 rounded-2xl bg-blue-50 text-blue-700 font-semibold">+{item.points} pts</span>
                {item.isPublished ? (
                  <span className="px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-semibold">Published</span>
                ) : (
                  <span className="px-3 py-2 rounded-2xl bg-slate-50 text-slate-600 font-semibold">Draft</span>
                )}
              </div>

              {isAdminView && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => item._id && publishResult && publishResult(item._id, !item.isPublished)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      item.isPublished
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {item.isPublished ? "Hide" : "Publish"}
                  </button>
                  <button
                    onClick={() => item._id && deleteResult && deleteResult(item._id)}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Results Table */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                {isAllMode && (
                  <th className="px-6 py-4 w-12">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={filteredResults.length > 0 && selectedIds.length === filteredResults.length}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                <th className="px-6 py-4">Program Name</th>
                <th className="px-6 py-4">Winner Student</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Prize</th>
                <th className="px-6 py-4">Awarded Points</th>
                {isAdminView && <th className="px-6 py-4 text-center">Admin Controls</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={isAllMode ? 7 : (isAdminView ? 6 : 5)} className="text-center py-12 text-slate-400 font-semibold">
                    No results found.
                  </td>
                </tr>
              ) : (
                filteredResults.map((item) => (
                  <tr key={item._id || `${item.programName}-${item.studentName}`} className="hover:bg-slate-50/50 transition-colors">
                    {isAllMode && (
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox"
                          checked={item._id ? selectedIds.includes(item._id) : false}
                          onChange={() => item._id && handleSelectOne(item._id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 font-bold text-slate-800">{item.programName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{item.studentName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-100 text-slate-600 border-slate-200">
                        {item.className}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        item.prize === "1st"
                          ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                          : item.prize === "2nd"
                          ? "bg-slate-100 text-slate-800 border-slate-300"
                          : "bg-orange-50 text-orange-800 border-orange-200"
                      }`}>
                        {item.prize} Place
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-blue-600">+{item.points} pts</td>
                    {isAdminView && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => item._id && publishResult && publishResult(item._id, !item.isPublished)}
                            className={`p-1.5 rounded-xl border transition cursor-pointer ${
                              item.isPublished
                                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                            }`}
                            title={item.isPublished ? "Published (click to hide)" : "Draft (click to publish)"}
                          >
                            {item.isPublished ? <Globe size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => item._id && deleteResult && deleteResult(item._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition cursor-pointer"
                            title="Delete Result"
                          >
                            <Trash2 size={16} />
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
      </div>
    </div>
  );
}