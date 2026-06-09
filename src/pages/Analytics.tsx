import { useMemo } from "react";
import { useRequests } from "../context/RequestContext";
import DashboardCard from "../components/DashboardCard";
import {
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  Trophy,
  Award
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

export default function Analytics() {
  const contextData = useRequests();
  const requests = Array.isArray(contextData?.requests) ? contextData.requests : [];
  const results = Array.isArray(contextData?.results) ? contextData.results : [];
  const minusPoints = Array.isArray(contextData?.minusPoints) ? contextData.minusPoints : [];
  
  // ── Poster Request Metrics ──────────────────────────────────────
  const totalRequests = requests.length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const completedCount = requests.filter(r => r.status === "Completed").length;
  const successCount = approvedCount + completedCount;
  const approvalRate = totalRequests > 0
    ? `${Math.round((successCount / totalRequests) * 100)}%`
    : "0%";

  const activeCommitteesCount = useMemo(() =>
    new Set(requests.map(r => r.committee)).size, [requests]);

  // Monthly request data
  const monthlyData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const currentYear = new Date().getFullYear();
    const counts = Array(12).fill(0);
    requests.forEach(r => {
      const d = new Date(r.createdAt);
      if (d.getFullYear() === currentYear) counts[d.getMonth()]++;
    });
    return months
      .map((name, idx) => ({ name, Requests: counts[idx] }))
      .filter((_, idx) => idx <= new Date().getMonth() || counts[idx] > 0);
  }, [requests]);

  // Status distribution
  const statusData = useMemo(() => {
    const statuses = ["Pending","Approved","Rejected","Completed","On Hold"];
    const colors   = ["#f59e0b","#10b981","#ef4444","#3b82f6","#8b5cf6"];
    return statuses
      .map((name, idx) => ({ name, value: requests.filter(r => r.status === name).length, color: colors[idx] }))
      .filter(item => item.value > 0);
  }, [requests]);

  // Top committees
  const committeeData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => { counts[r.committee] = (counts[r.committee] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.length > 18 ? `${name.slice(0, 15)}…` : name, Requests: count }))
      .sort((a, b) => b.Requests - a.Requests)
      .slice(0, 5);
  }, [requests]);

  // ── Championship / Results Metrics ─────────────────────────────
  const publishedResults = results.filter(r => r.isPublished);
  const draftResults     = results.filter(r => !r.isPublished);

  // Class performance (earned vs minus)
  const classes: string[] = ["SIDRA", "USRA", "WAFD", "WIDAD", "ITHIHAD", "IFADA"];
  const classPerformanceData = useMemo(() =>
    classes.map(cls => {
      const earned = publishedResults.filter(r => r.className === cls).reduce((s, r) => s + r.points, 0);
      const minus  = minusPoints.filter(m => m.className === cls).reduce((s, m) => s + m.points, 0);
      return { class: cls, Earned: earned, Deducted: minus, Net: earned - minus };
    }), [publishedResults, minusPoints]);

  // Prize distribution
  const prizeData = useMemo(() => [
    { name: "1st Place", value: publishedResults.filter(r => r.prize === "1st").length, color: "#eab308" },
    { name: "2nd Place", value: publishedResults.filter(r => r.prize === "2nd").length, color: "#94a3b8" },
    { name: "3rd Place", value: publishedResults.filter(r => r.prize === "3rd").length, color: "#f97316" },
  ].filter(d => d.value > 0), [publishedResults]);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Analytics Center</h1>
        <p className="text-slate-500 mt-1 font-medium">Statistical insights across requests, results, and championship standings.</p>
      </div>

      {/* ── Request Summary Cards ── */}
      <div>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Poster Requests</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <DashboardCard title="Total Submissions"   value={totalRequests}          icon={<FileText size={20}  />} color="bg-blue-600"   />
          <DashboardCard title="Approval Rate"       value={approvalRate}           icon={<TrendingUp size={20}/>} color="bg-emerald-600"/>
          <DashboardCard title="Active Committees"   value={activeCommitteesCount}  icon={<Users size={20}    />} color="bg-purple-600" />
          <DashboardCard title="This Month"          value={requests.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
                         icon={<BarChart3 size={20}/>} color="bg-amber-600" />
        </div>
      </div>

      {/* ── Championship Summary Cards ── */}
      <div>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Championship Results</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <DashboardCard title="Total Results"      value={results.length}          icon={<Trophy size={20}/>}  color="bg-yellow-500" />
          <DashboardCard title="Published"          value={publishedResults.length} icon={<Award size={20} />}  color="bg-emerald-600"/>
          <DashboardCard title="Pending Draft"      value={draftResults.length}     icon={<FileText size={20}/>}color="bg-amber-500"  />
          <DashboardCard title="Minus Deductions"   value={minusPoints.length}      icon={<TrendingUp size={20}/>} color="bg-rose-500"/>
        </div>
      </div>

      {/* ── Charts Grid (Requests) ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Monthly Requests Area Chart */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-1">Submissions by Month</h2>
          <p className="text-xs text-slate-400 font-medium mb-4">Monthly request log progression</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false}/>
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false}/>
                <Tooltip contentStyle={{ backgroundColor:"#1e293b", border:"none", borderRadius:"12px", color:"#fff" }} itemStyle={{ color:"#3b82f6" }}/>
                <Area type="monotone" dataKey="Requests" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReq)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-1">Queue Status Distribution</h2>
          <p className="text-xs text-slate-400 font-medium mb-4">Breakdown by current approval state</p>
          <div className="h-64 flex flex-col md:flex-row items-center justify-center gap-4">
            {statusData.length === 0 ? (
              <div className="text-slate-400 text-sm">No data available</div>
            ) : (
              <>
                <div className="w-full md:w-3/5 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor:"#1e293b", border:"none", borderRadius:"12px", color:"#fff" }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 shrink-0 md:w-2/5">
                  {statusData.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-xs font-semibold">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}/>
                      <span className="text-slate-500">{item.name}:</span>
                      <span className="text-slate-800">{item.value} ({Math.round((item.value / totalRequests) * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Top Committees Bar Chart */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-1">Top Submitting Committees</h2>
          <p className="text-xs text-slate-400 font-medium mb-4">Groups with highest submission volumes</p>
          <div className="h-64">
            {committeeData.length === 0 ? (
              <div className="text-slate-400 text-sm flex items-center justify-center h-full">No committee data registered</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={committeeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false}/>
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false}/>
                  <Tooltip contentStyle={{ backgroundColor:"#1e293b", border:"none", borderRadius:"12px", color:"#fff" }} itemStyle={{ color:"#10b981" }}/>
                  <Bar dataKey="Requests" fill="#10b981" radius={[8,8,0,0]} barSize={36}/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Class Championship Performance Bar Chart */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-1">Class Championship Performance</h2>
          <p className="text-xs text-slate-400 font-medium mb-4">Earned vs deducted points by class union</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="class" stroke="#94a3b8" fontSize={11} tickLine={false}/>
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false}/>
                <Tooltip contentStyle={{ backgroundColor:"#1e293b", border:"none", borderRadius:"12px", color:"#fff" }}/>
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}/>
                <Bar dataKey="Earned"   fill="#10b981" radius={[6,6,0,0]} barSize={18}/>
                <Bar dataKey="Deducted" fill="#ef4444" radius={[6,6,0,0]} barSize={18}/>
                <Bar dataKey="Net"      fill="#3b82f6" radius={[6,6,0,0]} barSize={18}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prize Distribution Pie (full width) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h2 className="font-bold text-slate-800 text-base mb-1">Prize Distribution</h2>
          <p className="text-xs text-slate-400 font-medium mb-4">Published placements split by prize rank</p>
          <div className="h-64 flex flex-col md:flex-row items-center justify-center gap-8">
            {prizeData.length === 0 ? (
              <div className="text-slate-400 text-sm">No published results yet</div>
            ) : (
              <>
                <div className="w-64 h-full shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={prizeData} cx="50%" cy="50%" outerRadius={90} paddingAngle={4} dataKey="value">
                        {prizeData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor:"#1e293b", border:"none", borderRadius:"12px", color:"#fff" }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-4">
                  {prizeData.map(item => (
                    <div key={item.name} className="flex items-center gap-3 text-sm font-semibold">
                      <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                      <span className="text-slate-600 w-24">{item.name}</span>
                      <span className="text-slate-800 font-black text-lg">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}