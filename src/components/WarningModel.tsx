import { useRequests } from "../context/RequestContext";
import { AlertTriangle, Clock, Mail, X } from "lucide-react";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WarningModal({
  isOpen,
  onClose,
}: WarningModalProps) {
  const { settings } = useRequests();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scale-in">
        
        {/* Banner Indicator */}
        <div className="bg-red-500 p-6 text-white flex justify-between items-start">
          <div className="flex gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <AlertTriangle size={24} className="text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Submission Blocked</h2>
              <p className="text-red-100 text-xs mt-0.5">Deadline Validation Violation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Details Content */}
        <div className="p-8 space-y-6 text-slate-600">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shrink-0">
              <Clock size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Strict Submission Policy</h3>
              <p className="text-sm leading-relaxed">
                Poster registrations close strictly <strong className="text-slate-800 font-semibold">{settings.deadline} hours</strong> before the scheduled program start time.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs leading-relaxed space-y-2">
            <p className="font-semibold text-slate-700">Why was this request blocked?</p>
            <p>
              Late poster submissions degrade publicity planning, increase designer workload, and do not guarantee design delivery. Requests submitted after this deadline are automatically filtered out by the queue.
            </p>
          </div>

          <div className="flex items-start gap-4 pt-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
              <Mail size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Special Approval Required</h3>
              <p className="text-sm leading-relaxed">
                To request an emergency bypass or late design allocation, please contact the Media Chairman directly:
              </p>
              <div className="mt-2 text-xs font-semibold text-slate-800 flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-blue-600">
                  👤 {settings.chairman}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  ✉ {settings.email}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-6 py-2.5 rounded-xl transition text-sm"
          >
            Acknowledge
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm shadow-sm hover:shadow-md"
          >
            Close Portal
          </button>
        </div>

      </div>

    </div>
  );
}