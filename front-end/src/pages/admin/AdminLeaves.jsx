import React, { useState, useEffect } from "react";
import { Calendar, User, ShieldAlert, CheckCircle, XCircle, Key, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AdminLeaves = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideDuration, setOverrideDuration] = useState("2");
  const [customOverrideVal, setCustomOverrideVal] = useState("1");
  const [customOverrideUnit, setCustomOverrideUnit] = useState("hours");
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leave-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leave-requests/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Action failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let finalDurationHours = parseFloat(overrideDuration);
    if (overrideDuration === "custom") {
      const val = parseFloat(customOverrideVal) || 0;
      finalDurationHours = customOverrideUnit === "minutes" ? val / 60 : val;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/leave-requests/${selectedRequest._id}/override`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          durationHours: finalDurationHours,
          reason: overrideReason,
        }),
      });

      if (res.ok) {
        setShowOverrideModal(false);
        setOverrideReason("");
        setSelectedRequest(null);
        fetchRequests();
      } else {
        const data = await res.json();
        setError(data.error || "Override failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeOverride = async (id) => {
    if (!window.confirm("Are you sure you want to revoke emergency override access for this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/leave-requests/${id}/revoke-override`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Revocation failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Group requests
  const pendingRequests = requests.filter((r) => r.status === "Pending");

  // Timezone-safe calendar-day comparison (matches backend leaveChecker.js)
  const getTodayStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayStr();

  const approvedLeaves = requests.filter((r) => {
    if (r.status !== "Approved") return false;
    const startStr = new Date(r.startDate).toISOString().split("T")[0];
    const endStr = new Date(r.endDate).toISOString().split("T")[0];
    return todayStr >= startStr && todayStr <= endStr;
  });

  const pastOrFutureLeaves = requests.filter((r) => {
    if (r.status !== "Approved") return r.status === "Rejected";
    const startStr = new Date(r.startDate).toISOString().split("T")[0];
    const endStr = new Date(r.endDate).toISOString().split("T")[0];
    return todayStr < startStr || todayStr > endStr;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Leave Requests & Emergency Overrides
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Approve leave applications and manage emergency access overrides for active leaves.
        </p>
      </div>

      {/* Pending Leave Requests */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="text-amber-500" size={22} />
          Pending Approvals ({pendingRequests.length})
        </h2>

        {pendingRequests.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No pending leave requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((req) => (
              <div
                key={req._id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                      {req.requester?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {req.requester?.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {req.requester?.role} • {req.requester?.ward || req.requester?.specialty || "No ward"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <p className="text-xs text-slate-400 font-semibold">LEAVE DURATION</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {new Date(req.startDate).toLocaleDateString()} to{" "}
                      {new Date(req.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    {req.reason}
                  </p>
                </div>

                {!user?.isTempAdmin ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(req._id, "approve")}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req._id, "reject")}
                      className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Temp Admins cannot approve or reject leave requests.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Currently On Leave & Overrides */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <ShieldAlert className="text-rose-500" size={22} />
          Currently on Leave & Access Overrides
        </h2>

        {approvedLeaves.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No medical staff currently on approved leave.
          </p>
        ) : (
          <div className="space-y-4">
            {approvedLeaves.map((req) => (
              <div
                key={req._id}
                className="p-5 rounded-2xl border border-rose-100 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {req.requester?.name}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
                      ON LEAVE
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Leave Dates: {new Date(req.startDate).toLocaleDateString()} to{" "}
                    {new Date(req.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Reason: {req.reason}
                  </p>

                  {req.emergencyOverride?.isActive ? (
                    <div className="mt-2 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs border border-emerald-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Key size={14} /> EMERGENCY OVERRIDE ACTIVE
                      </div>
                      <p>Expires: {new Date(req.emergencyOverride.expiresAt).toLocaleTimeString()}</p>
                      <p className="italic">Justification: {req.emergencyOverride.reason}</p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-2 p-2 bg-rose-500/10 text-rose-500 rounded-lg text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5 w-fit">
                        <AlertTriangle size={14} /> LOGIN BLOCKED
                      </div>
                      {req.emergencyRequest?.isRequested && (
                        <div className="mt-2 p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs border border-amber-500/20 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertTriangle size={14} className="animate-pulse" /> PENDING EMERGENCY ACCESS REQUEST
                          </div>
                          <p>Requested Duration: {req.emergencyRequest.durationHours < 1 ? `${Math.round(req.emergencyRequest.durationHours * 60)} minutes` : `${req.emergencyRequest.durationHours} Hours`}</p>
                          <p className="italic">Reason: {req.emergencyRequest.reason}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {req.emergencyOverride?.isActive ? (
                  <button
                    onClick={() => handleRevokeOverride(req._id)}
                    className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 self-start md:self-center cursor-pointer"
                  >
                    <XCircle size={16} /> Revoke Override
                  </button>
                ) : req.requester?.role !== "Nurse" && req.emergencyRequest?.isRequested ? (
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setOverrideReason(req.emergencyRequest?.isRequested ? req.emergencyRequest.reason : "");
                      setOverrideDuration(req.emergencyRequest?.isRequested ? String(req.emergencyRequest.durationHours) : "2");
                      setShowOverrideModal(true);
                    }}
                    className="py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 self-start md:self-center cursor-pointer"
                  >
                    <Key size={16} /> Grant Emergency Access
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-6 shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="text-primary-500" size={24} />
                Emergency Access Override
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Grant temporary login permission to <strong>{selectedRequest?.requester?.name}</strong>.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleOverrideSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Override Duration
                </label>
                <select
                  value={overrideDuration}
                  onChange={(e) => setOverrideDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                >
                  <option value="0.25">15 Minutes</option>
                  <option value="0.5">30 Minutes</option>
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="8">8 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="custom">Custom Time...</option>
                </select>

                {overrideDuration === "custom" && (
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={customOverrideVal}
                      onChange={(e) => setCustomOverrideVal(e.target.value)}
                      placeholder="Enter duration..."
                      required
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                    />
                    <select
                      value={customOverrideUnit}
                      onChange={(e) => setCustomOverrideUnit(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                )}
              </div>



              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowOverrideModal(false);
                    setError(null);
                  }}
                  className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Authorizing..." : "Authorize Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaves;
