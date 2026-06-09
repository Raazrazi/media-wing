import { useRequests } from "../../context/RequestContext";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

export default function Leaderboard() {
  const contextData = useRequests();
  const results = Array.isArray(contextData?.results) ? contextData.results : [];
  const minusPoints = Array.isArray(contextData?.minusPoints) ? contextData.minusPoints : [];

  const classes: ("SIDRA" | "USRA" | "WAFD" | "WIDAD" | "ITHIHAD" | "IFADA")[] = ["SIDRA", "USRA", "WAFD", "WIDAD", "ITHIHAD", "IFADA"];

  // Calculate dynamic standings
  const standings = classes.map((cls) => {
    // 1. Earned points from published results
    const earned = results
      .filter((r) => r.className === cls && r.isPublished)
      .reduce((sum, r) => sum + r.points, 0);

    // 2. Minus points deducted
    const minus = minusPoints
      .filter((m) => m.className === cls)
      .reduce((sum, m) => sum + m.points, 0);

    const net = earned - minus;

    return {
      class: cls,
      earned,
      minus,
      net
    };
  });

  // Sort standings by Net points desc
  const sortedStandings = standings
    .sort((a, b) => b.net - a.net)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="text-yellow-500 animate-bounce" />
            Championship Leaderboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Aggregate point standings calculated dynamically.
          </p>
        </div>
      </div>

      {/* Standings table register */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Class Union</th>
                <th className="px-6 py-4">Earned Points</th>
                <th className="px-6 py-4">Minus Deductions</th>
                <th className="px-6 py-4">Aggregate Net Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {sortedStandings.map((item) => (
                <tr key={item.class} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black">
                    {item.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full font-black text-xs">
                        #1
                      </span>
                    ) : item.rank === 2 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-black text-xs">
                        #2
                      </span>
                    ) : item.rank === 3 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-orange-100 text-orange-800 border border-orange-200 rounded-full font-black text-xs">
                        #3
                      </span>
                    ) : (
                      <span className="text-slate-500">#{item.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-slate-800">{item.class}</span>
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={14} />
                      {item.earned} pts
                    </div>
                  </td>
                  <td className="px-6 py-4 text-rose-600 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <TrendingDown size={14} />
                      -{item.minus} pts
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-blue-600 text-base">
                    {item.net} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}