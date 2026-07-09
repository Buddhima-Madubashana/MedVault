import React, { useState, useEffect } from "react";
import { Calendar, AlertCircle, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const LeaveManagement = () => {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leave-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeaves();
    }
  }, [token]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/leave-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, endDate, reason }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Leave request submitted successfully!" });
        setStartDate("");
        setEndDate("");
        setReason("");
        fetchLeaves();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to submit request." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 rounded-full">
            <CheckCircle2 size={14} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 rounded-full">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 rounded-full">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Leave Management
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Submit leaves and manage your approved days off.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/50 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800/50 dark:text-rose-300"
          }`}
        >
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-soft">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="text-primary-600 dark:text-primary-400" size={22} />
            Apply for Leave
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Reason for Leave
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Describe the reason for your leave request..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Leave Request"}
            </button>
          </form>
        </div>

        {/* History panel */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-soft flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="text-primary-600 dark:text-primary-400" size={22} />
            Leave History
          </h2>

          <div className="flex-1 overflow-x-auto">
            {leaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                <Calendar size={48} className="mb-3 opacity-50" />
                <p className="text-base font-medium">No leave requests found</p>
                <p className="text-sm">Submit your first leave request using the form.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                          {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Reason: {leave.reason}
                      </p>

                      {leave.approvedBy && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Reviewed by: {leave.approvedBy.name}
                        </p>
                      )}
                      {leave.emergencyOverride?.isActive && (
                        <div className="mt-2 p-2 bg-rose-500/10 text-rose-500 rounded-lg text-xs font-semibold border border-rose-500/20">
                          Emergency Override Active (Expires: {new Date(leave.emergencyOverride.expiresAt).toLocaleTimeString()})
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">{getStatusBadge(leave.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
