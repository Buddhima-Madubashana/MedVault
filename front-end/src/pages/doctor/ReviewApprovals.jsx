import React, { useState, useEffect } from "react";
import { Check, X, User, Activity, Trash2, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../../components/Notification";
import { isUserInShift } from "../../utils/shiftHelper";

const ReviewApprovals = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [notification, setNotification] = useState(null);

  const [expandedReq, setExpandedReq] = useState(null);

  const fetchRequests = () => {
    if (user && user._id) {
      fetch(
        `http://localhost:5000/api/patient-requests?role=Doctor&userId=${user._id}`,
      )
        .then((res) => res.json())
        .then((data) => setRequests(data))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAction = async (id, action) => {
    try {
      const endpoint =
        action === "approve"
          ? `http://localhost:5000/api/patient-requests/${id}/approve`
          : `http://localhost:5000/api/patient-requests/${id}?actionBy=${user._id}`;

      const method = action === "approve" ? "POST" : "DELETE";
      const res = await fetch(endpoint, { method });

      if (res.ok) {
        setRequests(requests.filter((req) => req._id !== id));
        if (expandedReq === id) setExpandedReq(null);
        setNotification({
          type: "success",
          title: "Success",
          message:
            action === "approve"
              ? "Request processed successfully."
              : "Request rejected.",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        title: "Error",
        message: "Action failed.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Approvals
          </h1>
          <p className="mt-1 text-slate-500">
            Manage admission and discharge requests.
          </p>
        </div>
        <div className="px-4 py-2 text-sm font-bold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
          {requests.length} Pending
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.map((req) => {
          const isDelete = req.requestType === "Delete";
          const patientName = isDelete
            ? req.patientId?.name || "Unknown Patient"
            : req.name;
          const details = isDelete
            ? "Requested Discharge"
            : `${req.age} Yrs • ${req.ward}`;

          return (
            <div key={req._id} className="flex flex-col gap-2">
              <div
                className={`p-6 rounded-2xl border shadow-soft flex flex-col md:flex-row items-center gap-6 ${isDelete ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50" : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/60 dark:border-slate-700/60"}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDelete ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"}`}
                >
                  {isDelete ? <Trash2 size={28} /> : <UserPlus size={28} />}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {patientName}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${isDelete ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {req.requestType} Request
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{details}</p>
                  <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                    Requested by Nurse {req.nurseId?.name}
                  </p>
                </div>

                <div className="flex w-full gap-3 md:w-auto">
                  {!isDelete && (
                    <button
                      onClick={() => setExpandedReq(expandedReq === req._id ? null : req._id)}
                      className="px-4 py-2 font-medium border rounded-xl border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {expandedReq === req._id ? "Hide Details" : "View Details"}
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="flex-1 px-6 py-2 font-medium border md:flex-none rounded-xl border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      if (isUserInShift(user)) {
                        handleAction(req._id, "approve");
                      }
                    }}
                    disabled={!isUserInShift(user)}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                      !isUserInShift(user)
                        ? "bg-slate-500/40 text-slate-300 border border-slate-700/50 cursor-not-allowed opacity-80"
                        : isDelete
                          ? "bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-red-900/30"
                          : "bg-primary-600 hover:bg-primary-700 shadow-primary-200 dark:shadow-primary-900/30"
                    }`}
                    title={isUserInShift(user) ? "" : "Access Blocked: Approving requests is only allowed during active shift hours."}
                  >
                    <Check size={18} />{" "}
                    {isDelete ? "Confirm Delete" : "Approve Add"} {!isUserInShift(user) && " (Out of Shift)"}
                  </button>
                </div>
              </div>

              {/* Expanded Details Section */}
              {expandedReq === req._id && !isDelete && (
                <div className="p-6 bg-white border shadow-inner dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl animate-in fade-in slide-in-from-top-4">
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Patient Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {req.imageUrl && (
                      <div className="md:col-span-2 flex justify-center mb-2">
                        <img src={req.imageUrl} alt="Patient" className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-500">Full Name</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white mb-3">{req.name}</p>
                      
                      <p className="text-sm font-medium text-slate-500">Age / Ward</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white mb-3">{req.age} years / {req.ward}</p>
                      
                      <p className="text-sm font-medium text-slate-500">Disease</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{req.disease}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Guardian Name</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white mb-3">{req.guardianName}</p>
                      
                      <p className="text-sm font-medium text-slate-500">Contact</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white mb-1">{req.phone}</p>
                      <p className="text-base text-slate-700 dark:text-slate-300 mb-3">{req.email}</p>
                      
                      <p className="text-sm font-medium text-slate-500">Address</p>
                      <p className="text-base text-slate-700 dark:text-slate-300">{req.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {requests.length === 0 && (
          <p className="py-10 text-center text-slate-500 dark:text-slate-400">
            No pending requests.
          </p>
        )}
      </div>
      {notification && (
        <div className="fixed bottom-6 right-6">
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewApprovals;
