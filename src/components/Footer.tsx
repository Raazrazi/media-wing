import { Link } from "react-router-dom";
import { useRequests } from "../context/RequestContext";

export default function Footer() {
  // Destructure the clearing function from your context
  const { error, clearError } = useRequests(); 

  return (
    <footer className="bg-white/30 backdrop-blur-md border-t border-slate-200 px-4 sm:px-8 py-6 text-center text-slate-600">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        
        {/* Error Display with a Dismiss Button */}
        {error && (
          <div className="text-red-500 text-sm md:mr-4 flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            <span>{error}</span>
            <button 
              onClick={clearError} 
              className="text-red-400 hover:text-red-600 font-bold transition-colors line-height-none"
              aria-label="Clear error"
            >
              ✕
            </button>
          </div>
        )}
        
        <span className="text-sm">© {new Date().getFullYear()} Union Media Portal</span>
        
        {/* Navigation Links that clear the error on click */}
        <nav className="flex gap-3">
          <Link to="/privacy" onClick={clearError} className="hover:underline">Privacy</Link>
          <Link to="/terms" onClick={clearError} className="hover:underline">Terms</Link>
          <Link to="/contact" onClick={clearError} className="hover:underline">Contact</Link>
        </nav>
        
      </div>
    </footer>
  );
}