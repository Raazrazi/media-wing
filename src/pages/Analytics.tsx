import { useMemo } from "react";
import { useRequests } from "../context/RequestContext";
import DashboardCard from "../components/DashboardCard";
import {
  FileText,
  TrendingUp,
  Users,
  BarChart3
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
  Bar
} from "recharts";

export default function Analytics() {
  const { requests } = useRequests();

  // Metrics calculation
  const totalRequests = requests.length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const completedCount = requests.filter(r => r.status === "Completed").length;
  const successCount = approvedCount + completedCount;
  
  const approvalRate = totalRequests > 0 
    ? `${Math.round((successCount / totalRequests) * 100)}%` 
    : "0%";

  const activeCommitteesCount = useMemo(() => {
    return new Set(requests.map(r => r.committee)).size;
  }, [requests]);

  // Dynamic requests by month
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    // Create mapping of month indices
    const counts = Array(12).fill(0);
    requests.forEach(r => {
      const d = new Date(r.createdAt);
      if (d.getFullYear() === currentYear) {
        counts[d.getMonth()] += 1;
      }
    });

    return months.map((name, idx) => ({
      name,
      Requests: counts[idx]
    })).filter((_, idx) => idx <= new Date().getMonth() || counts[idx] > 0);
  }, [requests]);

  // Dynamic status distribution data
  const statusData = useMemo(() => {
    const statuses = ["Pending", "Approved", "Rejected", "Completed", "On Hold"];
    const colors = ["#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];

    return statuses.map((name, idx) => {
      const value = requests.filter(r => r.status === name).length;
      return {
        name,
        value,
        color: colors[idx]
      };
    }).filter(item => item.value > 0);
  }, [requests]);

  // Dynamic committees submissions data
  const committeeData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => {
      counts[r.committee] = (counts[r.committee] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name: name.length > 18 ? `${name.substring(0, 15)}...` : name,
        Requests: count
      }))
      .sort((a, b) => b.Requests - a.Requests)
      .slice(0, 5);
  }, [requests]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Analytics Center
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Statistical insights and design performance indicators.
        </p>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Submissions"
          value={totalRequests}
          icon={<FileText size={20} />}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Approval Rate"
          value={approvalRate}
          icon={<TrendingUp size={20} />}
          color="bg-emerald-600"
        />

        <DashboardCard
          title="Active Committees"
          value={activeCommitteesCount}
          icon={<Users size={20} />}
          color="bg-purple-600"
        />

        <DashboardCard
          title="Monthly Requests"
          value={requests.filter(r => {
            const d = new Date(r.createdAt);
            return d.getMonth() === new Date().getMonth();
          }).length}
          icon={<BarChart3 size={20} />}
          color="bg-amber-600"
        />
      </div>

      {/* Dynamic Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Requests by Month Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-slate-800 text-base">Requests Submissions by Month</h2>
            <p className="text-xs text-slate-400 font-medium">Monthly request log progression for the current year</p>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", color: "#fff" }}
                  itemStyle={{ color: "#3b82f6" }}
                  labelClassName="font-bold text-xs"
                />
                <Area type="monotone" dataKey="Requests" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-slate-800 text-base">Queue Status Distribution</h2>
            <p className="text-xs text-slate-400 font-medium">Breakdown of designs by current approval state</p>
          </div>
          
          <div className="h-72 flex flex-col md:flex-row items-center justify-center gap-4">
            {statusData.length === 0 ? (
              <div className="text-slate-400 text-sm">No data available</div>
            ) : (
              <>
                <div className="w-full md:w-3/5 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", color: "#fff" }}
                        labelClassName="font-bold text-xs"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 shrink-0 md:w-2/5">
                  {statusData.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-xs font-semibold">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-500">{item.name}:</span>
                      <span className="text-slate-800">{item.value} ({Math.round((item.value / totalRequests) * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Active Committees Bar Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h2 className="font-bold text-slate-800 text-base">Top Submitting Committees</h2>
            <p className="text-xs text-slate-400 font-medium">Organizing groups with the highest volume of request submissions</p>
          </div>
          
          <div className="h-72">
            {committeeData.length === 0 ? (
              <div className="text-slate-400 text-sm flex items-center justify-center h-full">No committee data registered</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={committeeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#10b981" }}
                    labelClassName="font-bold text-xs"
                  />
                  <Bar dataKey="Requests" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}