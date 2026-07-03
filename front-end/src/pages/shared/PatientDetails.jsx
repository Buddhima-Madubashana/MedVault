import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Activity,
  FileText,
  Shield,
  Clock,
  Edit3,
  Check,
  X,
  Plus,
  ChevronDown,
  Stethoscope,
  Lock,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { isUserInShift } from "../../utils/shiftHelper";
import { AnimatePresence, motion } from "framer-motion";
import Notification from "../../components/Notification";

// --- Status config ---
const STATUS_OPTIONS = [
  { value: "Stable", color: "green", dot: "bg-green-500" },
  { value: "Recovering", color: "blue", dot: "bg-blue-500" },
  { value: "Under Observation", color: "yellow", dot: "bg-yellow-500" },
  { value: "Critical", color: "red", dot: "bg-red-500" },
  { value: "Discharged", color: "slate", dot: "bg-slate-400" },
];

const statusStyle = (status) => {
  const map = {
    Stable: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    Recovering: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    "Under Observation": "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    Critical: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    Discharged: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
  };
  return map[status] || map["Stable"];
};

const PatientDetails = () => {
  const { id } = useParams();
  const { token, role, user } = useAuth();
  const navigate = useNavigate();
  const isDoctor = role === "Doctor" || role === "Admin";
  const canEditVitals = role === "Doctor" || role === "Admin" || role === "Nurse";

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // --- Medical History edit state ---
  const [editingHistory, setEditingHistory] = useState(false);
  const [historyDraft, setHistoryDraft] = useState("");

  // --- Status edit state ---
  const [editingStatus, setEditingStatus] = useState(false);
  const [statusDraft, setStatusDraft] = useState("");
  const statusDropdownRef = useRef(null);

  // --- Timeline state ---
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [newTimelineEvent, setNewTimelineEvent] = useState("");
  const [savingTimeline, setSavingTimeline] = useState(false);

  // --- Vitals edit state ---
  const [editingVitals, setEditingVitals] = useState(false);
  const [vitalsDraft, setVitalsDraft] = useState({ heartRate: "", bloodPressure: "", temperature: "" });
  const [savingVitals, setSavingVitals] = useState(false);

  const showNotification = (type, title, msg) =>
    setNotification({ type, title, message: msg, duration: 3000 });

  // --- Fetch patient ---
  const fetchPatient = () => {
    if (!token) return;
    fetch(`http://localhost:5000/api/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setPatient(data);
        setHistoryDraft(data.medicalHistory || "");
        setStatusDraft(data.status || "Stable");
        setVitalsDraft(data.vitals || { heartRate: "72 bpm", bloodPressure: "120/80", temperature: "98.6 °F" });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatient();
  }, [id, token]);

  // Close status dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
        setEditingStatus(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // --- PATCH helper ---
  const patchPatient = async (payload) => {
    const res = await fetch(`http://localhost:5000/api/patients/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update");
    }
    return res.json();
  };

  // --- Save Medical History ---
  const saveHistory = async () => {
    try {
      const updated = await patchPatient({ medicalHistory: historyDraft });
      setPatient(updated);
      setEditingHistory(false);
      showNotification("success", "Saved", "Medical history updated.");
    } catch (err) {
      showNotification("error", "Error", err.message);
    }
  };

  // --- Save Status ---
  const saveStatus = async (newStatus) => {
    try {
      const updated = await patchPatient({ status: newStatus });
      setPatient(updated);
      setStatusDraft(newStatus);
      setEditingStatus(false);
      showNotification("success", "Updated", `Status changed to ${newStatus}.`);
    } catch (err) {
      showNotification("error", "Error", err.message);
    }
  };

  // --- Add Timeline Entry ---
  const addTimelineEntry = async () => {
    if (!newTimelineEvent.trim()) return;
    setSavingTimeline(true);
    try {
      const updated = await patchPatient({
        newTimelineEntry: { event: newTimelineEvent.trim() },
      });
      setPatient(updated);
      setNewTimelineEvent("");
      setShowAddTimeline(false);
      showNotification("success", "Added", "Timeline entry added.");
    } catch (err) {
      showNotification("error", "Error", err.message);
    } finally {
      setSavingTimeline(false);
    }
  };

  // --- Save Vitals ---
  const saveVitals = async () => {
    setSavingVitals(true);
    try {
      const updated = await patchPatient({ vitals: vitalsDraft });
      setPatient(updated);
      setEditingVitals(false);
      showNotification("success", "Updated", "Vitals updated successfully.");
    } catch (err) {
      showNotification("error", "Error", err.message);
    } finally {
      setSavingVitals(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">Loading Record...</div>
    );
  if (!patient)
    return (
      <div className="p-10 text-center text-red-500">Patient not found.</div>
    );

  const currentStatus = patient.status || "Stable";
  const timeline = patient.treatmentTimeline || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 transition-colors text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft size={20} /> Back to Registry
      </button>

      {/* ── Main Profile Header ── */}
      <div className="relative p-8 overflow-hidden bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-soft dark:bg-slate-800/80 rounded-3xl dark:border-slate-700/60">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Activity size={120} />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row">
          <img
            src={
              patient.imageUrl ||
              `https://ui-avatars.com/api/?name=${patient.name}&background=random`
            }
            className="object-cover w-32 h-32 border-4 shadow-md rounded-3xl border-blue-50 dark:border-slate-700"
            alt={patient.name}
          />
          <div className="flex-1">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {patient.name}
                </h1>
                <p className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
                  <Shield size={16} className="text-primary-500" /> Patient ID:{" "}
                  <span className="font-mono">{patient._id}</span>
                </p>
              </div>

              {/* ── Status Badge / Editable ── */}
              {isDoctor ? (
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => setEditingStatus(!editingStatus)}
                    className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl border transition-all ${statusStyle(currentStatus)}`}
                  >
                    {currentStatus}
                    <ChevronDown size={16} className={`transition-transform ${editingStatus ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {editingStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        className="absolute right-0 top-12 z-50 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden"
                      >
                        <p className="text-xs font-bold uppercase text-slate-400 px-4 pt-3 pb-1 tracking-wider">
                          Change Status
                        </p>
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => saveStatus(opt.value)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${opt.value === currentStatus ? "opacity-50 cursor-default" : ""}`}
                            disabled={opt.value === currentStatus}
                          >
                            <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                            {opt.value}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <span className={`px-4 py-2 font-bold rounded-xl border ${statusStyle(currentStatus)}`}>
                  {currentStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8 md:grid-cols-4">
              <div className="p-4 border bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-slate-100 dark:border-slate-700">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">Age</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">{patient.age} Yrs</span>
              </div>
              <div className="p-4 border bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-slate-100 dark:border-slate-700">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">Ward</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">{patient.ward}</span>
              </div>
              <div className="col-span-2 p-4 border bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-slate-100 dark:border-slate-700/50">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">Condition</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{patient.disease}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detailed Sections ── */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

        {/* Left Column: Vitals + Contact */}
        <div className="space-y-6 md:col-span-1">
          {/* Vitals */}
          <div className="p-6 bg-white/80 backdrop-blur-md border shadow-soft dark:bg-slate-800/80 rounded-3xl border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <Activity className="text-red-500" size={20} /> Current Vitals
              </h3>
              {canEditVitals && !editingVitals && (
                isUserInShift(user) ? (
                  <button
                    onClick={() => {
                      setVitalsDraft(patient.vitals || { heartRate: "72 bpm", bloodPressure: "120/80", temperature: "98.6 °F" });
                      setEditingVitals(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold" title="Access Blocked: Editing vitals is restricted outside active shift hours.">
                    <Lock size={12} /> Out of Shift
                  </span>
                )
              )}
            </div>
            {editingVitals ? (
              <div className="space-y-3">
                {[["Heart Rate", "heartRate"], ["Blood Pressure", "bloodPressure"], ["Temperature", "temperature"]].map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <span className="text-sm font-medium text-slate-500">{label}</span>
                    <input
                      type="text"
                      value={vitalsDraft[key] || ""}
                      onChange={(e) => setVitalsDraft({ ...vitalsDraft, [key]: e.target.value })}
                      className="w-32 px-3 py-1.5 text-sm font-bold text-right bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-400 text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingVitals(false)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    onClick={saveVitals}
                    disabled={savingVitals}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md shadow-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {savingVitals ? "Saving..." : <><Check size={15} /> Save</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[["Heart Rate", patient.vitals?.heartRate || "72 bpm"], ["Blood Pressure", patient.vitals?.bloodPressure || "120/80"], ["Temperature", patient.vitals?.temperature || "98.6 °F"]].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <span className="text-sm font-medium text-slate-500">{label}</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="p-6 bg-white/80 backdrop-blur-md border shadow-soft dark:bg-slate-800/80 rounded-3xl border-slate-200/60 dark:border-slate-700/60">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900 dark:text-white">
              <User className="text-primary-500" size={20} /> Contact Info
            </h3>
            <div className="space-y-3">
              {[
                ["Guardian", patient.guardianName],
                ["Phone", patient.phone],
                ["Email", patient.email],
                ["Address", patient.address],
              ].map(([label, val]) => (
                <div key={label} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <span className="block text-xs font-bold uppercase text-slate-400">{label}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white break-all">{val || "N/A"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Medical History + Timeline */}
        <div className="space-y-6 md:col-span-2">

          {/* ── Medical History ── */}
          <div className="p-6 bg-white/80 backdrop-blur-md border shadow-soft dark:bg-slate-800/80 rounded-3xl border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <FileText className="text-primary-500" size={20} /> Medical History
              </h3>
              {isDoctor && !editingHistory && (
                isUserInShift(user) ? (
                  <button
                    onClick={() => {
                      setHistoryDraft(patient.medicalHistory || "");
                      setEditingHistory(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold" title="Access Blocked: Editing medical history is restricted outside active shift hours.">
                    <Lock size={12} /> Out of Shift
                  </span>
                )
              )}
              {!isDoctor && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Lock size={12} /> Doctor only
                </span>
              )}
            </div>

            {editingHistory ? (
              <div className="space-y-3">
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-primary-300 bg-primary-50/30 dark:bg-slate-900 dark:border-primary-700 dark:text-white text-slate-800 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  rows={6}
                  value={historyDraft}
                  onChange={(e) => setHistoryDraft(e.target.value)}
                  placeholder="Enter detailed medical history, notes, and observations..."
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingHistory(false)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    onClick={saveHistory}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md shadow-primary-500/20 transition-colors"
                  >
                    <Check size={15} /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
                {patient.medicalHistory && patient.medicalHistory.trim() ? (
                  patient.medicalHistory
                ) : (
                  <span className="italic">
                    Patient admitted with symptoms of {patient.disease}. Initial assessment shows stable vitals.
                    Requires monitoring and standard treatment protocol.
                    {"\n\n"}
                    <strong className="not-italic text-slate-600 dark:text-slate-300">Admitted By:</strong>{" "}
                    {patient.approvedBy?.name ? `Dr. ${patient.approvedBy.name}` : "System Admin"}
                    {"\n"}
                    <strong className="not-italic text-slate-600 dark:text-slate-300">Admission Date:</strong>{" "}
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── Treatment Timeline ── */}
          <div className="p-6 bg-white/80 backdrop-blur-md border shadow-soft dark:bg-slate-800/80 rounded-3xl border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <Clock className="text-purple-500" size={20} /> Treatment Timeline
              </h3>
              <div className="flex items-center gap-2">
                {!isDoctor && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Lock size={12} /> Doctor only
                  </span>
                )}
                {isDoctor && (
                  isUserInShift(user) ? (
                    <button
                      onClick={() => setShowAddTimeline(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                    >
                      <Plus size={13} /> Add Entry
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-405 font-semibold" title="Access Blocked: Adding timeline entries is restricted outside active shift hours.">
                      <Lock size={12} /> Out of Shift
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Add Timeline Form */}
            <AnimatePresence>
              {showAddTimeline && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mb-5 p-4 rounded-xl border border-purple-200 bg-purple-50/40 dark:bg-purple-900/10 dark:border-purple-800 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-500">New Timeline Entry</p>
                    <textarea
                      className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white dark:bg-slate-900 dark:border-purple-700 dark:text-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                      rows={3}
                      value={newTimelineEvent}
                      onChange={(e) => setNewTimelineEvent(e.target.value)}
                      placeholder="Describe the treatment event, procedure, or observation..."
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Stethoscope size={12} />
                        Will be signed as <strong className="text-slate-600 dark:text-slate-300">{role === "Admin" ? "Admin" : "Dr."} {user?.name}</strong> · {new Date().toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setShowAddTimeline(false); setNewTimelineEvent(""); }}
                          className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addTimelineEntry}
                          disabled={!newTimelineEvent.trim() || savingTimeline}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md shadow-purple-500/20 transition-colors disabled:opacity-50"
                        >
                          {savingTimeline ? "Saving..." : <><Check size={12} /> Add</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline List */}
            <div className="pl-6 ml-2 space-y-6 border-l-2 border-slate-100 dark:border-slate-700">
              {/* Admission entry (always first) */}
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">Patient Admitted</p>
                <p className="text-xs text-slate-500">{new Date(patient.createdAt).toLocaleString()}</p>
              </div>

              {/* Dynamic entries from DB */}
              {timeline.length === 0 && (
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white dark:border-slate-800" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Initial Checkup Completed</p>
                  <p className="text-xs text-slate-500">Soon after admission</p>
                </div>
              )}

              <AnimatePresence>
                {[...timeline].reverse().map((entry, idx) => (
                  <motion.div
                    key={entry._id || idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <span className="absolute -left-[31px] top-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white dark:border-slate-800" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{entry.event}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-slate-500">
                        {new Date(entry.date).toLocaleString()}
                      </p>
                      {entry.doctorName && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                          <Stethoscope size={10} /> {entry.doctorRole === "Nurse" ? "Nurse" : entry.doctorRole === "Admin" ? "Admin" : "Dr."} {entry.doctorName}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Notification Toast */}
      <div className="fixed z-50 bottom-6 right-6">
        <AnimatePresence>
          {notification && (
            <Notification
              {...notification}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientDetails;
