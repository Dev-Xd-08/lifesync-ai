import { useState, useEffect } from "react";
import {
  HeartPulse,
  Activity,
  PlusCircle,
  FileHeart,
  Calendar,
  Sparkles,
  Trash2,
  AlertTriangle,
  Stethoscope,
  Pill,
  Droplet
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Health() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [recordType, setRecordType] = useState("Vitals");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  const { showToast } = useToast();

  const fetchRecords = async () => {
    try {
      const res = await api.get("/health");
      if (res.data.success) {
        setRecords(res.data.healthRecords);
      }
    } catch (err) {
      showToast("Error loading health records.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Record title is required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const vitalsObj = {};
      if (systolic) vitalsObj.systolic = parseInt(systolic, 10);
      if (diastolic) vitalsObj.diastolic = parseInt(diastolic, 10);
      if (heartRate) vitalsObj.heartRate = parseInt(heartRate, 10);
      if (bloodGlucose) vitalsObj.bloodGlucose = parseInt(bloodGlucose, 10);
      if (weightKg) vitalsObj.weightKg = parseFloat(weightKg);

      const res = await api.post("/health", {
        title: title.trim(),
        recordType,
        recordDate,
        vitals: vitalsObj,
        notes: notes.trim(),
        tags: tags ? tags.split(",").map((t) => t.trim()) : []
      });

      if (res.data.success) {
        showToast("Health record and AI summary generated!", "success");
        setIsModalOpen(false);
        resetForm();
        fetchRecords();
      }
    } catch (err) {
      showToast("Failed to save health entry.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setRecordType("Vitals");
    setSystolic("");
    setDiastolic("");
    setHeartRate("");
    setBloodGlucose("");
    setWeightKg("");
    setNotes("");
    setTags("");
  };

  const handleDeleteRecord = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/health/${deleteId}`);
      if (res.data.success) {
        showToast("Health entry removed.", "success");
        setRecords((prev) => prev.filter((r) => r._id !== deleteId));
      }
    } catch (err) {
      showToast("Error deleting health record.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // Find latest recorded vitals
  const latestVitalsRecord = records.find(
    (r) => r.vitals && (r.vitals.systolic || r.vitals.heartRate || r.vitals.bloodGlucose)
  );

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Health & Vitals Records</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
              {records.length} Logs
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Secure tracking of biometric vitals, clinical lab reports, and automated AI summaries.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
        >
          <PlusCircle className="h-4 w-4 text-emerald-400" />
          <span>Log Vitals / Report</span>
        </button>
      </div>

      {/* Vitals Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Blood Pressure */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Blood Pressure
            </span>
            <HeartPulse className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {latestVitalsRecord?.vitals?.systolic
              ? `${latestVitalsRecord.vitals.systolic}/${latestVitalsRecord.vitals.diastolic}`
              : "--/--"}
          </div>
          <p className="mt-1 text-xs text-slate-400">mmHg (Systolic/Diastolic)</p>
        </div>

        {/* Resting Heart Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Heart Rate
            </span>
            <Activity className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {latestVitalsRecord?.vitals?.heartRate
              ? `${latestVitalsRecord.vitals.heartRate} bpm`
              : "--"}
          </div>
          <p className="mt-1 text-xs text-slate-400">Resting pulse</p>
        </div>

        {/* Fasting Glucose */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Blood Glucose
            </span>
            <Droplet className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {latestVitalsRecord?.vitals?.bloodGlucose
              ? `${latestVitalsRecord.vitals.bloodGlucose} mg/dL`
              : "--"}
          </div>
          <p className="mt-1 text-xs text-slate-400">Fasting serum</p>
        </div>

        {/* Body Weight */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Weight
            </span>
            <Stethoscope className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {latestVitalsRecord?.vitals?.weightKg
              ? `${latestVitalsRecord.vitals.weightKg} kg`
              : "--"}
          </div>
          <p className="mt-1 text-xs text-slate-400">Biometric mass</p>
        </div>
      </div>

      {/* Health Entries List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 p-4">
          <h3 className="text-sm font-bold text-slate-900">Medical History & Vitals Log</h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
            Retrieving clinical logs...
          </div>
        ) : records.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <HeartPulse className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">No health records logged</h3>
            <p className="mt-1 text-xs text-slate-500">
              Log your vitals or annual checkup results to generate autonomous AI clinical summaries.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Log first entry</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((rec) => (
              <div key={rec._id} className="p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                      <FileHeart className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                          {rec.recordType}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Recorded on {new Date(rec.recordDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteId(rec._id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Vitals summary if present */}
                {rec.vitals && Object.keys(rec.vitals).length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    {rec.vitals.systolic && (
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        BP: {rec.vitals.systolic}/{rec.vitals.diastolic} mmHg
                      </span>
                    )}
                    {rec.vitals.heartRate && (
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Pulse: {rec.vitals.heartRate} bpm
                      </span>
                    )}
                    {rec.vitals.bloodGlucose && (
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Glucose: {rec.vitals.bloodGlucose} mg/dL
                      </span>
                    )}
                    {rec.vitals.weightKg && (
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Weight: {rec.vitals.weightKg} kg
                      </span>
                    )}
                  </div>
                )}

                {/* AI Summary Box */}
                {rec.aiSummary && (
                  <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3.5 text-xs text-slate-800 leading-relaxed shadow-2xs">
                    <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-900">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>LifeSync Clinical Overview</span>
                    </div>
                    <p className="whitespace-pre-wrap">{rec.aiSummary}</p>
                  </div>
                )}

                {/* Notes & Tags */}
                {rec.notes && (
                  <p className="text-xs text-slate-600 italic">
                    Notes: "{rec.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Health Entry / Biometrics"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateRecord} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Entry Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Vitals Check or Annual Lab Panel"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Record Type
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                <option value="Blood Test">Blood Test</option>
                <option value="Prescription">Prescription</option>
                <option value="Medical Report">Medical Report</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Vitals">Vitals Check</option>
                <option value="Consultation">Doctor Consultation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Date
              </label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Vitals Form Section */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
            <span className="text-xs font-bold text-slate-900">Biometric Measurements (Optional)</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Systolic (mmHg)</label>
                <input
                  type="number"
                  placeholder="e.g. 120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Diastolic (mmHg)</label>
                <input
                  type="number"
                  placeholder="e.g. 80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Heart Rate (bpm)</label>
                <input
                  type="number"
                  placeholder="e.g. 72"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Blood Glucose (mg/dL)</label>
                <input
                  type="number"
                  placeholder="e.g. 95"
                  value={bloodGlucose}
                  onChange={(e) => setBloodGlucose(e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Clinical Notes / Physician Advice
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Routine checkup with Dr. Sterling. Advised daily 30-minute cardio."
              rows={2}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing Medical Summary...</span>
                </>
              ) : (
                <span>Save & Summarize</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteRecord}
        title="Delete Health Record"
        message="Are you sure you want to remove this medical and vitals record?"
      />
    </div>
  );
}

export default Health;
