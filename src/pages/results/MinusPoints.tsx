import { useState, type FormEvent } from "react";
import { useRequests } from "../../context/RequestContext";
import { useLocation } from "react-router-dom";
import { MinusCircle, Trash2, Plus } from "lucide-react";

export default function MinusPoints() {
  const contextData = useRequests();
  const minusPoints = Array.isArray(contextData?.minusPoints) ? contextData.minusPoints : [];
  const addMinusPoint = contextData?.addMinusPoint;
  const deleteMinusPoint = contextData?.deleteMinusPoint;
  const location = useLocation();
  const isAdminView = location.pathname.startsWith("/admin");

  const [form, setForm] = useState({
    className: "SIDRA" as "SIDRA" | "USRA" | "WAFD" | "WIDAD" | "ITHIHAD" | "IFADA",
    reason: "",
    points: 5,
    approvedBy: "Chairman",
    date: new Date().toISOString().slice(0, 10)
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.reason.trim()) return;

    try {
      await addMinusPoint(form);
      setForm({
        className: "SIDRA",
        reason: "",
        points: 5,
        approvedBy: "Chairman",
        date: new Date().toISOString().slice(0, 10)
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const classes: ("SIDRA" | "USRA" | "WAFD" | "WIDAD" | "ITHIHAD" | "IFADA")[] = ["SIDRA", "USRA", "WAFD", "WIDAD", "ITHIHAD", "IFADA"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <MinusCircle className="text-red-500 animate-pulse" />
            Minus Points Register
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isAdminView ? "Record class union violations and deduct standings points." : "Deduction ledger of campus rules violations."}
          </p>
        </div>

        {isAdminView && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4.5 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer hover:shadow-glow-blue shrink-0"
          >
            <Plus size={16} /> Record Deduction
          </button>
        )}
      </div>

      {/* Add Form Panel */}
      {isAdminView && showAddForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2.5 border-slate-100">
            Apply Points Deduction Penalty
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Class Union
                </label>
                <select
                  value={form.className}
                  onChange={(e) => setForm({ ...form, className: e.target.value as any })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Violation Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flex printing rules violation, Late submission"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Points Deducted
                  </label>
                  <input
                    type="number"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Math.max(1, parseInt(e.target.value, 10)) })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Approved By Authority
                </label>
                <input
                  type="text"
                  placeholder="e.g. Media Chairman"
                  value={form.approvedBy}
                  onChange={(e) => setForm({ ...form, approvedBy: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer hover:shadow-glow-purple"
              >
                Apply Penalty
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Minus points register table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Reason Details</th>
                <th className="px-6 py-4">Deduction</th>
                <th className="px-6 py-4">Approved By</th>
                <th className="px-6 py-4">Date</th>
                {isAdminView && <th className="px-6 py-4 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {minusPoints.length === 0 ? (
                <tr>
                  <td colSpan={isAdminView ? 6 : 5} className="text-center py-12 text-slate-400 font-semibold">
                    No minus points penalties recorded.
                  </td>
                </tr>
              ) : (
                minusPoints.map((item) => (
                  <tr key={item._id || item.reason} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{item.className}</td>
                    <td className="px-6 py-4 font-semibold text-slate-500">{item.reason}</td>
                    <td className="px-6 py-4 text-red-600 font-black">-{item.points} pts</td>
                    <td className="px-6 py-4 font-semibold text-slate-500">{item.approvedBy}</td>
                    <td className="px-6 py-4 font-semibold text-slate-400">{item.date}</td>
                    {isAdminView && (
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => item._id && deleteMinusPoint(item._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Delete Penalty"
                        >
                          <Trash2 size={16} />
                        </button>
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