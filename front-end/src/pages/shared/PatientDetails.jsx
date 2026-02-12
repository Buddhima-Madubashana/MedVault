import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Heart,
  Activity,
  FileText,
  Shield,
  Clock,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const PatientDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    // Fetch single patient details
    // Note: You might need to add a backend route for GET /api/patients/:id if it doesn't exist
    // For now, we'll fetch all and find one, or you can implement the specific route.
    fetch(`http://localhost:5000/api/patients`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const found = data.find((p) => p._id === id);
        setPatient(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, token]);

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">Loading Record...</div>
    );
  if (!patient)
    return (
      <div className="p-10 text-center text-red-500">Patient not found.</div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header / Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 transition-colors text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={20} /> Back to Registry
      </button>

      {/* Main Profile Header */}
      <div className="relative p-8 overflow-hidden bg-white border border-blue-200 shadow-xl dark:bg-slate-800 rounded-3xl dark:border-slate-700 shadow-blue-900/5">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Activity size={120} />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row">
          <img
            src={
              patient.imageUrl ||
              `https://ui-avatars.com/api/?name=${patient.name}`
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
                  <Shield size={16} className="text-blue-500" /> Patient ID:{" "}
                  <span className="font-mono">{patient._id}</span>
                </p>
              </div>
              <span className="px-4 py-2 font-bold text-green-700 bg-green-100 border border-green-200 rounded-xl">
                Status: Stable
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8 md:grid-cols-4">
              <div className="p-4 border bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-slate-100 dark:border-slate-700">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                  Age
                </span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">
                  {patient.age} Yrs
                </span>
              </div>
              <div className="p-4 border bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-slate-100 dark:border-slate-700">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                  Ward
                </span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">
                  {patient.ward}
                </span>
              </div>
              <div className="col-span-2 p-4 border bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-slate-100 dark:border-slate-700">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                  Condition
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {patient.disease}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Vitals (Mock Data for UI) */}
        <div className="space-y-6 md:col-span-1">
          <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900 dark:text-white">
              <Activity className="text-red-500" size={20} /> Current Vitals
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="text-sm font-medium text-slate-500">
                  Heart Rate
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  72 bpm
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="text-sm font-medium text-slate-500">
                  Blood Pressure
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  120/80
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="text-sm font-medium text-slate-500">
                  Temperature
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  98.6 °F
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900 dark:text-white">
              <User className="text-blue-500" size={20} /> Contact Info
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="block text-xs font-bold uppercase text-slate-400">
                  Guardian
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {patient.guardianName || "N/A"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="block text-xs font-bold uppercase text-slate-400">
                  Phone
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {patient.phone || "N/A"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="block text-xs font-bold uppercase text-slate-400">
                  Email
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white break-all">
                  {patient.email || "N/A"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <span className="block text-xs font-bold uppercase text-slate-400">
                  Address
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {patient.address || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History & Notes */}
        <div className="space-y-6 md:col-span-2">
          <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900 dark:text-white">
              <FileText className="text-blue-500" size={20} /> Medical History
            </h3>
            <p className="leading-relaxed text-slate-500">
              Patient admitted with symptoms of {patient.disease}. Initial
              assessment shows stable vitals. Requires monitoring and standard
              treatment protocol.
              <br />
              <br />
              <strong>Admitted By:</strong>{" "}
              {patient.approvedBy
                ? `Dr. ID: ${patient.approvedBy}`
                : "System Admin"}
              <br />
              <strong>Admission Date:</strong>{" "}
              {new Date(patient.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Timeline Mockup */}
          <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900 dark:text-white">
              <Clock className="text-purple-500" size={20} /> Treatment Timeline
            </h3>
            <div className="pl-6 ml-2 space-y-6 border-l-2 border-slate-100 dark:border-slate-700">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Patient Admitted
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(patient.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Initial Checkup Completed
                </p>
                <p className="text-xs text-slate-500">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
