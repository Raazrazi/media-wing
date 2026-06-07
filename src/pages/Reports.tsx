import { useState, useEffect } from "react";
import { useRequests } from "../context/RequestContext";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Trash2
} from "lucide-react";

interface ReportLog {
  id: string;
  name: string;
  type: "Excel" | "PDF" | "Audit";
  timestamp: string;
  size: string;
}

export default function Reports() {
  const { requests } = useRequests();
  const [reportLogs, setReportLogs] = useState<ReportLog[]>(() => {
    const saved = localStorage.getItem("union_media_report_logs");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "rep-1",
        name: "May 2026 Archive Report",
        type: "PDF",
        timestamp: "2026-06-01T10:00:00Z",
        size: "1 page"
      },
      {
        id: "rep-2",
        name: "Annual Review Report 2025",
        type: "Audit",
        timestamp: "2026-01-01T08:30:00Z",
        size: "3 pages"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("union_media_report_logs", JSON.stringify(reportLogs));
  }, [reportLogs]);

  const addReportLog = (name: string, type: ReportLog["type"], size: string) => {
    const newLog: ReportLog = {
      id: `rep-${Date.now()}`,
      name,
      type,
      timestamp: new Date().toISOString(),
      size
    };
    setReportLogs(prev => [newLog, ...prev]);
  };

  const deleteLog = (id: string) => {
    setReportLogs(prev => prev.filter(log => log.id !== id));
  };

  const handleExcelExport = () => {
    const headers = ["Request ID", "Program Name", "Program Title", "Category", "Committee", "Event Date Time", "Venue", "Priority", "Status", "Remarks", "Created At"];
    const rows = requests.map(r => [
      r.requestId,
      `"${r.programName.replace(/"/g, '""')}"`,
      `"${r.programTitle.replace(/"/g, '""')}"`,
      r.category,
      `"${r.committee.replace(/"/g, '""')}"`,
      r.eventDateTime,
      `"${r.venue.replace(/"/g, '""')}"`,
      r.priority,
      r.status,
      `"${(r.remarks || "").replace(/"/g, '""')}"`,
      r.createdAt
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `union_media_database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addReportLog("Excel Database Dump - Full Archive", "Excel", `${(blob.size / 1024).toFixed(2)} KB`);
  };

  const handlePdfExport = (type: "Monthly" | "Annual" | "Audit") => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let filtered = [...requests];
    let title = "Union Media Queue Audit Log";
    let sub = "Complete registration history list";

    if (type === "Monthly") {
      filtered = requests.filter(r => new Date(r.createdAt).getMonth() === currentMonth);
      const mName = new Date().toLocaleString("default", { month: "long" });
      title = `Union Media Monthly Report - ${mName} ${currentYear}`;
      sub = `Records submitted during the month of ${mName} ${currentYear}`;
    } else if (type === "Annual") {
      filtered = requests.filter(r => new Date(r.createdAt).getFullYear() === currentYear);
      title = `Union Media Annual Report - Year ${currentYear}`;
      sub = `Records submitted during the academic year ${currentYear}`;
    }

    const printWin = window.open("", "_blank");
    if (!printWin) {
      alert("Popup blocked! Please enable popups to export printable PDF.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { font-size: 24px; margin: 0; color: #0f172a; }
            p.sub { font-size: 13px; color: #64748b; margin: 5px 0 0 0; font-weight: 500; }
            .meta { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; font-weight: bold; text-align: left; color: #475569; }
            td { border: 1px solid #e2e8f0; padding: 10px; color: #334155; }
            tr:nth-child(even) { background-color: #f1f5f9/30; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: bold; }
            .badge-Pending { background-color: #fef3c7; color: #d97706; }
            .badge-Approved { background-color: #d1fae5; color: #059669; }
            .badge-Rejected { background-color: #fee2e2; color: #dc2626; }
            .badge-Completed { background-color: #dbeafe; color: #2563eb; }
            .badge-Hold { background-color: #f3e8ff; color: #7c3aed; }
            .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; color: #94a3b8; font-weight: 500; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p class="sub">${sub}</p>
            <div class="meta">Export Date: ${new Date().toLocaleDateString()} | Total Count: ${filtered.length} requests</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Program Name</th>
                <th>Committee</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? "<tr><td colspan='6' style='text-align:center;padding:20px;color:#94a3b8;'>No requests found</td></tr>" : filtered.map(r => `
                <tr>
                  <td><strong>${r.requestId}</strong></td>
                  <td>${r.programName}</td>
                  <td>${r.committee}</td>
                  <td>${r.category}</td>
                  <td>${r.priority}</td>
                  <td><span class="badge badge-${r.status === "On Hold" ? "Hold" : r.status}">${r.status}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            Students' Union Media Wing | Automated Verification Ledger
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 300);
            }
          </script>
        </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();

    const pgCount = Math.ceil(filtered.length / 10) || 1;
    addReportLog(
      `${type} Audit Report (${filtered.length} records)`,
      type === "Audit" ? "Audit" : "PDF",
      `${pgCount} page${pgCount > 1 ? "s" : ""}`
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Report Export Center
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Generate structured PDF summaries, excel dumps, and audit logs.
        </p>
      </div>

      {/* Grid Cards options */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Card 1: Monthly */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition shadow-sm">
          <div>
            <div className="flex justify-between items-start">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Calendar size={22} />
              </span>
            </div>
            <h3 className="font-extrabold text-slate-800 mt-4 text-base">Monthly Summary</h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
              Summarize all requests submitted within this current month.
            </p>
          </div>
          <button
            onClick={() => handlePdfExport("Monthly")}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm hover:shadow-glow-blue"
          >
            Generate PDF Report
          </button>
        </div>

        {/* Card 2: Annual */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition shadow-sm">
          <div>
            <div className="flex justify-between items-start">
              <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <FileText size={22} />
              </span>
            </div>
            <h3 className="font-extrabold text-slate-800 mt-4 text-base">Annual Review</h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
              Export yearly metrics ledger for presentations.
            </p>
          </div>
          <button
            onClick={() => handlePdfExport("Annual")}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm hover:shadow-glow-green"
          >
            Generate Annual PDF
          </button>
        </div>

        {/* Card 3: Excel */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition shadow-sm">
          <div>
            <div className="flex justify-between items-start">
              <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                <FileSpreadsheet size={22} />
              </span>
            </div>
            <h3 className="font-extrabold text-slate-800 mt-4 text-base">Excel Spreadsheet</h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
              Download entire database as a raw CSV file for audits.
            </p>
          </div>
          <button
            onClick={handleExcelExport}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm hover:shadow-glow-purple"
          >
            Download CSV Sheet
          </button>
        </div>

        {/* Card 4: Audit */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition shadow-sm">
          <div>
            <div className="flex justify-between items-start">
              <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                <Download size={22} />
              </span>
            </div>
            <h3 className="font-extrabold text-slate-800 mt-4 text-base">Queue Audit Log</h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
              Detailed audit summary list of all registrations.
            </p>
          </div>
          <button
            onClick={() => handlePdfExport("Audit")}
            className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm hover:shadow-glow-yellow"
          >
            Export Complete Audit
          </button>
        </div>

      </div>

      {/* Reports history log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up">
        
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Export Ledger History</h2>
          <p className="text-xs text-slate-400 font-medium">Audit logs of reports compiled during this session</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Report Description</th>
                <th className="px-6 py-4">Format Type</th>
                <th className="px-6 py-4">Generation Timestamp</th>
                <th className="px-6 py-4">Estimated Size</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {reportLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No report history recorded yet.
                  </td>
                </tr>
              ) : (
                reportLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{log.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        log.type === "Excel" 
                          ? "bg-purple-50 text-purple-700 border-purple-100" 
                          : log.type === "PDF"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500">{log.size}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete log"
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