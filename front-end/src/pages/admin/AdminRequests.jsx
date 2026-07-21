import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Clock, CheckCircle, XCircle, ShieldOff } from "lucide-react";

const AdminRequests = () => {
  const { token, user } = useAuth();
  const { success, error } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        error("Failed to fetch requests");
      }
    } catch (err) {
      console.error(err);
      error("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin-requests/${id}/${action}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        success(`Request ${action}d successfully`); // Toast Success
        fetchRequests();
      } else {
        const err = await res.json();
        error(`Error: ${err.error}`); // Toast Error
      }
    } catch (err) {
      console.error(err);
      error("Action failed."); // Toast Error
    }
  };

  if (user?.isTempAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-soft mt-8">
        <ShieldOff size={64} className="text-slate-300 dark:text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          As a temporary administrator, you do not have permission to view or manage admin requests.
        </p>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading requests...</div>;

  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const approvedRequests = requests.filter(
    (r) =>
      r.status === "Approved" && new Date(r.expiresAt) > new Date()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Admin Access Requests
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage temporary permission requests from doctors.
        </p>
      </div>

      {/* Pending Requests */}
      <div className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="text-primary-500" /> Pending Requests
            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-xs">
              {pendingRequests.length}
            </span>
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No pending requests.
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div key={req._id} className="p-6 flex items-start justify-between transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {req.requester?.name || "Unknown User"}
                  </h3>
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                    {req.requester?.ward || "Ward"} • {req.requester?.specialty || "General"}
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mt-3 max-w-xl">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Reason:</span> {req.reason}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                      <span className="font-bold text-slate-900 dark:text-white">Duration:</span> {req.duration}{" "}
                      minutes
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                    Requested: {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(req._id, "approve")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold transition-all shadow-md shadow-green-500/20"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-all shadow-sm"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Permissions */}
      <div className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-3xl border border-green-200/50 dark:border-green-900/30 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="text-green-500" /> Active Permissions
            <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full text-xs">
              {approvedRequests.length}
            </span>
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {approvedRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No active permissions.
            </div>
          ) : (
            approvedRequests.map((req) => (
              <div key={req._id} className="p-6 flex items-start justify-between transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {req.requester?.name || "Unknown User"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        Admin Access Active
                     </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-3">
                    Expires: {new Date(req.expiresAt).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Granted at: {new Date(req.approvedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleAction(req._id, "revoke")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/40 font-bold transition-all"
                  >
                    <ShieldOff size={18} /> Revoke Early
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;
