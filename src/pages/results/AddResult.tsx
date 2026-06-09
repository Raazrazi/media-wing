import { useState, type FormEvent } from "react";
import { useRequests } from "../../context/RequestContext";
import { useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft, Check, Search, Globe } from "lucide-react";

export default function AddResult() {
  const { addResult, fetchStudent } = useRequests();
  const navigate = useNavigate();

  const [programName, setProgramName] = useState("");
  const [places, setPlaces] = useState([
    { prize: "1st", admissionNo: "", studentName: "", className: "" },
    { prize: "2nd", admissionNo: "", studentName: "", className: "" },
    { prize: "3rd", admissionNo: "", studentName: "", className: "" }
  ]);

  const [error, setError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAdmissionNoChange = (index: number, value: string) => {
    setPlaces(prev => {
      const newPlaces = [...prev];
      newPlaces[index].admissionNo = value;
      // Reset name/class if admission number is changed to force re-fetch
      newPlaces[index].studentName = "";
      newPlaces[index].className = "";
      return newPlaces;
    });
  };

  const handleFetchStudent = async (index: number) => {
    const admNo = places[index].admissionNo;
    if (!admNo.trim()) return;

    const student = await fetchStudent(admNo);
    if (student) {
      setPlaces(prev => {
        const newPlaces = [...prev];
        newPlaces[index].studentName = student.studentName;
        newPlaces[index].className = student.className;
        return newPlaces;
      });
      setError("");
    } else {
      setError(`Student with admission number '${admNo}' not found.`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!programName.trim()) {
      setError("Program name is required");
      return;
    }

    const validPlaces = places.filter(p => p.studentName && p.className);
    if (validPlaces.length === 0) {
      setError("At least one valid student result (with name and class) must be provided");
      return;
    }

    try {
      await Promise.all(
        validPlaces.map(p =>
          addResult({
            programName,
            studentName: p.studentName,
            className: p.className as "SIDRA" | "USRA" | "WAFD" | "WIDAD" | "ITHIHAD" | "IFADA",
            prize: p.prize as "1st" | "2nd" | "3rd",
            isPublished: isPublishing
          })
        )
      );
      navigate("/admin/results");
    } catch (err) {
      console.error(err);
      setError("Failed to submit results to database.");
    }
  };

  const getPoints = (prize: string) => {
    if (prize === "1st") return 10;
    if (prize === "2nd") return 7;
    return 5;
  };

  const totalPoints = places
    .filter(p => p.studentName && p.className)
    .reduce((sum, p) => sum + getPoints(p.prize), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <div className="flex justify-between items-center border-b pb-5 border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="text-blue-500" />
            Add Competition Results
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Register event placements automatically using admission numbers.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/results")}
          className="text-slate-400 hover:text-slate-600 font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Results
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Program Name</label>
            <input
              type="text"
              placeholder="e.g. Debate Competition"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="w-full max-w-md border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Placements</h3>
            {places.map((place, index) => (
              <div key={place.prize} className="grid md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="md:col-span-2 flex flex-col items-center justify-center">
                  <span className={`text-xl font-black ${place.prize === '1st' ? 'text-yellow-500' : place.prize === '2nd' ? 'text-slate-400' : 'text-amber-600'}`}>
                    {place.prize}
                  </span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Place</span>
                </div>
                
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Admission No.</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ADM001"
                      value={place.admissionNo}
                      onChange={(e) => handleAdmissionNoChange(index, e.target.value)}
                      onBlur={() => handleFetchStudent(index)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleFetchStudent(index)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Student Name</label>
                  <input
                    type="text"
                    readOnly
                    value={place.studentName}
                    placeholder="Auto-filled"
                    className="w-full bg-slate-200/50 border border-slate-200/50 rounded-xl p-2.5 text-sm text-slate-700 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Class</label>
                  <input
                    type="text"
                    readOnly
                    value={place.className}
                    placeholder="-"
                    className="w-full bg-slate-200/50 border border-slate-200/50 rounded-xl p-2.5 text-sm text-slate-700 font-semibold cursor-not-allowed text-center"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between mt-8">
            <div>
              <p className="font-extrabold text-slate-800 text-sm">Total Points to Award</p>
              <p className="text-xs text-slate-400 font-semibold">Will be distributed among classes based on valid placements</p>
            </div>
            <span className="text-3xl font-black text-blue-600">+{totalPoints} pts</span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/results")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => setIsPublishing(false)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer hover:shadow-glow-slate flex items-center gap-1.5"
            >
              <Check size={16} /> Save Draft
            </button>
            <button
              type="submit"
              onClick={() => setIsPublishing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer hover:shadow-glow-blue flex items-center gap-1.5"
            >
              <Globe size={16} /> Announce Results
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}