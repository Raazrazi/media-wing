import { useState, type FormEvent } from "react";
import { useRequests } from "../context/RequestContext";
import { Trash2, Plus,  AlertTriangle } from "lucide-react";

export default function AdminAnnouncements() {
  const contextData = useRequests();
  const announcements = Array.isArray(contextData?.announcements) ? contextData.announcements : [];
  const addAnnouncement = contextData?.addAnnouncement;
  const deleteAnnouncement = contextData?.deleteAnnouncement;

  const [form, setForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().slice(0, 10),
    isImportant: false
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    try {
      await addAnnouncement(form);
      setForm({
        title: "",
        content: "",
        date: new Date().toISOString().slice(0, 10),
        isImportant: false
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Notice Board Admin
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Publish notifications, register alert warnings, and manage board summaries.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4.5 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer hover:shadow-glow-blue shrink-0"
        >
          <Plus size={16} /> Add Announcement
        </button>
      </div>

      {/* Add Form Panel */}
      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2.5 border-slate-100">
            Publish New Announcement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Notice Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule Change: Literary Club Event"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                Announcement Content
              </label>
              <textarea
                placeholder="Write full notification brief here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isImportant}
                  onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
                  className="w-4.5 h-4.5 accent-amber-500 rounded"
                />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle size={14} className="text-amber-500" />
                  Mark as High Priority Alert
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer hover:shadow-glow-blue"
                >
                  Publish Notice
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Ledger table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Notice Title & Content</th>
                <th className="px-6 py-4">Priority Status</th>
                <th className="px-6 py-4">Published Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 font-semibold">
                    No notice announcements active.
                  </td>
                </tr>
              ) : (
                announcements.map((announce) => (
                  <tr key={announce._id || announce.title} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <p className="font-bold text-slate-800 line-clamp-1">{announce.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-0.5 font-semibold">
                        {announce.content}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {announce.isImportant ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                          Alert Notice
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
                          General
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500">
                      {new Date(announce.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => announce._id && deleteAnnouncement(announce._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        title="Delete Announcement"
                      >
                        <Trash2 size={16} />
                      </button>
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
