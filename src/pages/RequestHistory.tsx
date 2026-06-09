import { useState, useMemo } from "react";
import { useRequests } from "../context/RequestContext";
import RequestTable from "../components/RequestTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorToast from "../components/ErrorToast";
import { Search, RefreshCw, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function RequestHistory() {
  const contextData = useRequests();
  const requests = Array.isArray(contextData?.requests) ? contextData.requests : [];
  const isLoading = contextData?.isLoading;
  const error = contextData?.error;
  const clearError = contextData?.clearError;
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const newRequestPath = isAdmin ? "/admin/new-request" : "/new-request";

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [committeeFilter, setCommitteeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRangeFilter, setDateRangeFilter] = useState("All");

  // Dynamic filter lists based on existing data
  const committees = useMemo(() => {
    const list = new Set(requests.map(r => r.committee));
    return ["All", ...Array.from(list)];
  }, [requests]);

  const categories = useMemo(() => {
    const list = new Set(requests.map(r => r.category));
    return ["All", ...Array.from(list)];
  }, [requests]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCommitteeFilter("All");
    setCategoryFilter("All");
    setDateRangeFilter("All");
  };

  // Perform multi-dimensional filter
  const filtered = useMemo(() => {
    return requests.filter(request => {
      // 1. Text Search (ID or Program Name)
      const matchesSearch = 
        request.programName.toLowerCase().includes(search.toLowerCase()) ||
        request.requestId.toLowerCase().includes(search.toLowerCase()) ||
        request.programTitle.toLowerCase().includes(search.toLowerCase());

      // 2. Status Filter
      const matchesStatus = statusFilter === "All" || request.status === statusFilter;

      // 3. Committee Filter
      const matchesCommittee = committeeFilter === "All" || request.committee === committeeFilter;

      // 4. Category Filter
      const matchesCategory = categoryFilter === "All" || request.category === categoryFilter;

      // 5. Date Filter
      let matchesDate = true;
      if (dateRangeFilter !== "All") {
        const eventTime = new Date(request.eventDateTime).getTime();
        const now = new Date().getTime();
        const oneDay = 1000 * 60 * 60 * 24;

        if (dateRangeFilter === "Today") {
          const todayStart = new Date().setHours(0,0,0,0);
          const todayEnd = new Date().setHours(23,59,59,999);
          matchesDate = eventTime >= todayStart && eventTime <= todayEnd;
        } else if (dateRangeFilter === "Next7Days") {
          matchesDate = eventTime > now && eventTime <= now + (oneDay * 7);
        } else if (dateRangeFilter === "Next30Days") {
          matchesDate = eventTime > now && eventTime <= now + (oneDay * 30);
        } else if (dateRangeFilter === "Past") {
          matchesDate = eventTime < now;
        }
      }

      return matchesSearch && matchesStatus && matchesCommittee && matchesCategory && matchesDate;
    });
  }, [requests, search, statusFilter, committeeFilter, categoryFilter, dateRangeFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      {isLoading && <LoadingSpinner />}
      {error && clearError && (
        <ErrorToast message={error} onClose={clearError} />
      )}
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Request Registry
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Search, filter, and inspect poster design requirements.
          </p>
        </div>
        
        <Link
          to={newRequestPath}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition-all hover:shadow-glow-blue"
        >
          <Plus size={16} />
          New Request
        </Link>
      </div>

      {/* Dynamic Filters Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        
        {/* Search input row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Program Name, Request ID, or subtitle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition text-sm font-semibold flex items-center justify-center gap-2 shrink-0"
          >
            <RefreshCw size={14} />
            Reset Filters
          </button>
        </div>

        {/* Dropdowns filters row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          
          {/* Status Select */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Committee Select */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Committee</label>
            <select
              value={committeeFilter}
              onChange={(e) => setCommitteeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {committees.map(comm => (
                <option key={comm} value={comm}>
                  {comm === "All" ? "All Committees" : comm}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Event Schedule Select */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Schedule</label>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="All">All Schedules</option>
              <option value="Today">Today's Events</option>
              <option value="Next7Days">Within 7 Days</option>
              <option value="Next30Days">Within 30 Days</option>
              <option value="Past">Past Programs</option>
            </select>
          </div>

        </div>

      </div>

      {/* Request Table Output */}
      <div>
        <RequestTable
          requests={filtered}
          title={`${statusFilter !== "All" ? statusFilter : "All"} Publicity Registrations`}
        />
      </div>

    </div>
  );
}