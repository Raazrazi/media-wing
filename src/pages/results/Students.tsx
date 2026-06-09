import { useRequests } from "../../context/RequestContext";
import { Users , TrendingUp } from "lucide-react";

interface StudentStanding {
  name: string;
  className: string;
  points: number;
}

export default function Students() {
  const contextData = useRequests();
  const results = Array.isArray(contextData?.results) ? contextData.results : [];

  // Aggregate points by student
  const studentMap: Record<string, { className: string; points: number }> = {};

  results
    .filter((r) => r.isPublished)
    .forEach((r) => {
      const key = r.studentName.trim();
      if (!studentMap[key]) {
        studentMap[key] = {
          className: r.className,
          points: 0
        };
      }
      studentMap[key].points += r.points;
    });

  const studentStandings: StudentStanding[] = Object.entries(studentMap).map(
    ([name, data]) => ({
      name,
      className: data.className,
      points: data.points
    })
  );

  // Sort standings by points descending
  const sortedStandings = studentStandings
    .sort((a, b) => b.points - a.points)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Users />
            Student Rankings
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Individual student performance and aggregate points standings.
          </p>
        </div>
      </div>

      {/* Rankings table register */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Class Union</th>
                <th className="px-6 py-4">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {sortedStandings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 font-semibold">
                    No student placement records found in published results.
                  </td>
                </tr>
              ) : (
                sortedStandings.map((student) => (
                  <tr key={student.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-black">
                      {student.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full font-black text-xs">
                          #1
                        </span>
                      ) : student.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-black text-xs">
                          #2
                        </span>
                      ) : student.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-orange-100 text-orange-800 border border-orange-200 rounded-full font-black text-xs">
                          #3
                        </span>
                      ) : (
                        <span className="text-slate-500">#{student.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-800">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-100 text-slate-600 border-slate-200">
                        {student.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-blue-600 text-base">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-emerald-500" />
                        {student.points} pts
                      </div>
                    </td>
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