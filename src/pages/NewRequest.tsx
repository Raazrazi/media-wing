import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRequests } from "../context/RequestContext";
import WarningModal from "../components/WarningModel";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorToast from "../components/ErrorToast";
import FormSection from "../components/FormSection";
import { 
  FileText, 
  CheckCircle, 
  Printer, 
  ArrowLeft, 
  Plus,
  AlertCircle
} from "lucide-react";

// Committees list
const committees = [
  "History Club", 
  "Class Union 2026", 
  "Fine Arts Committee", 
  "Sports Committee", 
  "Media Wing", 
  "Other"
];

// Categories list
const categories = ["Academic", "Cultural", "Sports", "Technical", "Social", "Union Initiative", "Other"];

export default function NewRequest() {
  const { addRequest, settings, isLoading, error } = useRequests();
  const location = useLocation();
  const backPath = location.pathname.startsWith("/admin") ? "/admin/dashboard" : "/";
  const backLabel = location.pathname.startsWith("/admin") ? "Back to Dashboard" : "Back to Home";

  const [showWarning, setShowWarning] = useState(false);
  const [successRequest, setSuccessRequest] = useState<any>(null);
  
  const [form, setForm] = useState({
    programName: "",
    programTitle: "",
    venue: "",
    committee: committees[0], // Defaulted to the first item in the array
    category: "Academic",
    eventDateTime: "",
    description: "",
    posterRequirements: "",
    contactPerson: "",
    email: "",
    priority: "Normal" as "Normal" | "High" | "Urgent"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.programName.trim()) newErrors.programName = "Program name is required";
    if (!form.programTitle.trim()) newErrors.programTitle = "Program title is required";
    if (!form.venue.trim()) newErrors.venue = "Venue is required";
    if (!form.committee.trim()) newErrors.committee = "Committee is required";
    if (!form.eventDateTime) newErrors.eventDateTime = "Date and time is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.posterRequirements.trim()) newErrors.posterRequirements = "Poster requirements are required";
    if (!form.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // 48-hour check
    const eventDate = new Date(form.eventDateTime);
    const now = new Date();
    
    // Difference in milliseconds
    const diffMs = eventDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < settings.deadline) {
      setShowWarning(true);
      return;
    }

    try {
      // Submit request (now async)
      const newRecord = await addRequest(form);
      setSuccessRequest(newRecord);
    } catch (error) {
      console.error("Error submitting request:", error);
      // Error notification is already handled in addRequest via context
    }
  };

  const resetForm = () => {
    setForm({
      programName: "",
      programTitle: "",
      venue: "",
      committee: committees[0], // Reset to the first item in the array
      category: "Academic",
      eventDateTime: "",
      description: "",
      posterRequirements: "",
      contactPerson: "",
      email: "",
      priority: "Normal"
    });
    setSuccessRequest(null);
    setErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  // Success view block
  if (successRequest) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-4 animate-scale-in printable-area">
        
        {/* Receipt Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-glow-green text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 animate-bounce">
            <CheckCircle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Request Submitted Successfully
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Your registration has been logged in the designer queue database.
            </p>
          </div>

          <div className="inline-block bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-3 mt-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration ID</p>
            <p className="text-xl font-black text-blue-600 tracking-tight mt-0.5">{successRequest.requestId}</p>
          </div>
        </div>

        {/* Details Slip Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100 flex items-center gap-2">
            <FileText size={18} className="text-blue-500" />
            Registration Summary Slip
          </h2>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Program Name</p>
              <p className="font-semibold text-slate-800 mt-1">{successRequest.programName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Program Title</p>
              <p className="font-semibold text-slate-800 mt-1">{successRequest.programTitle}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Venue</p>
              <p className="font-semibold text-slate-800 mt-1">{successRequest.venue}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Organizing Committee</p>
              <p className="font-semibold text-slate-800 mt-1">{successRequest.committee}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Date & Time</p>
              <p className="font-semibold text-slate-800 mt-1">
                {new Date(successRequest.eventDateTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Priority & Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                  {successRequest.priority}
                </span>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">
                  Pending Review
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Contact Person</p>
              <p className="font-semibold text-slate-800 mt-1">
                {successRequest.contactPerson} ({successRequest.email})
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 non-printable">
          <button
            onClick={resetForm}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-all border border-slate-200 text-sm flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Submit Another Request
          </button>

          <div className="flex w-full sm:w-auto gap-3">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <Printer size={16} />
              Print Slip
            </button>
            <Link
              to="/requests"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 hover:shadow-glow-blue"
            >
              View Requests Queue
            </Link>
          </div>
        </div>

      </div>
    );
  }

  return (
    <>
      <WarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
      />

      {isLoading && <LoadingSpinner />}
      {error && <ErrorToast message={error} onClose={() => {}} />}

      <GlassCard className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        
        {/* Title widget */}
        <div className="flex items-center justify-between border-b pb-5 border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              New Poster Registration
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Centralized publicity submission for Class Unions, Committees, and wings.
            </p>
          </div>
          <Link
            to={backPath}
            className="text-slate-400 hover:text-slate-600 font-semibold text-sm flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>
        </div>

        {/* Policy Warning Panel */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 text-amber-800 flex items-start gap-4 shadow-sm">
          <AlertCircle size={24} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-900">Mandatory 48-Hour Deadline Reminder</h3>
            <p className="text-xs text-amber-800/95 leading-relaxed">
              Poster registration closes strictly <strong className="font-bold">{settings.deadline} hours</strong> before the scheduled program start time. Submissions violating this rule are blocked from queue registration.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Program Details */}
          <FormSection title="1. Program Details">
            <div className="grid md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Program Name</label>
                <input
                  type="text"
                  value={form.programName}
                  onChange={(e) => setForm({ ...form, programName: e.target.value })}
                  placeholder="e.g. Mock Hajj Campaign, Tech Expo"
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.programName ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.programName && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.programName}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Program Title / Caption</label>
                <input
                  type="text"
                  value={form.programTitle}
                  onChange={(e) => setForm({ ...form, programTitle: e.target.value })}
                  placeholder="e.g. Labbaik Awareness, Code the Future"
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.programTitle ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.programTitle && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.programTitle}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date & Time of Event</label>
                <input
                  type="datetime-local"
                  value={form.eventDateTime}
                  onChange={(e) => setForm({ ...form, eventDateTime: e.target.value })}
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.eventDateTime ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.eventDateTime && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.eventDateTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Venue</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="e.g. Main Auditorium, Seminar Hall B"
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.venue ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.venue && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.venue}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Program Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High (Urgent design attention required)</option>
                  <option value="Urgent">Urgent (Special clearance needed)</option>
                </select>
              </div>

            </div>
          </FormSection>

          {/* Section 2: Requirements details */}
          <FormSection title="2. Design & Content Specifics">
            <div className="space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Organizing Body / Committee Name</label>
                <select
                  value={form.committee}
                  onChange={(e) => setForm({ ...form, committee: e.target.value })}
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.committee ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                >
                  {committees.map(comm => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
                </select>
                {errors.committee && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.committee}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Program Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide brief outline, guest list details, program flow, topics, etc. This helps the design team generate contextual artwork."
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.description ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Poster Design Requirements / Layout Details</label>
                <textarea
                  rows={3}
                  value={form.posterRequirements}
                  onChange={(e) => setForm({ ...form, posterRequirements: e.target.value })}
                  placeholder="Specify design sizes, resolution, theme color preferences, text titles to include, digital upload or print flex size."
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.posterRequirements ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.posterRequirements && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.posterRequirements}</p>}
              </div>

            </div>
          </FormSection>

          {/* Section 3: Contact details */}
          <FormSection title="3. Liaison Information">
            <div className="grid md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Contact Person Name</label>
                <input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="eg: Ahmed Amir"
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.contactPerson ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.contactPerson && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="eg: web@example.com"
                  className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.email ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">⚠️ {errors.email}</p>}
              </div>

            </div>
          </FormSection>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-xl transition text-sm border border-slate-200"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition text-sm shadow-sm hover:shadow-glow-blue"
            >
              Register Poster Request
            </button>
          </div>

        </form>

      </GlassCard>
    </>
  );
}