import React, { useState, useEffect } from "react";
import { Check, X, User, Activity, Trash2, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../../components/Notification";

const ReviewApprovals = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [notification, setNotification] = useState(null);

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
          : `http://localhost:5000/api/patient-requests/${id}`;

      const method = action === "approve" ? "POST" : "DELETE";
      const res = await fetch(endpoint, { method });

      if (res.ok) {
        setRequests(requests.filter((req) => req._id !== id));
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
        <div className="px-4 py-2 text-sm font-bold text-blue-700 border border-blue-100 bg-blue-50 rounded-xl">
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
            <div
              key={req._id}
              className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center gap-6 ${isDelete ? "bg-red-50/50 border-red-200" : "bg-white border-blue-200"}`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDelete ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
              >
                {isDelete ? <Trash2 size={28} /> : <UserPlus size={28} />}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <h3 className="text-lg font-bold text-slate-900">
                    {patientName}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${isDelete ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {req.requestType} Request
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{details}</p>
                <p className="mt-2 text-xs font-medium text-slate-400">
                  Requested by Nurse {req.nurseId?.name}
                </p>
              </div>

              <div className="flex w-full gap-3 md:w-auto">
                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="flex-1 px-6 py-2 font-medium border md:flex-none rounded-xl border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(req._id, "approve")}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isDelete ? "bg-red-600 hover:bg-red-700 shadow-red-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
                >
                  <Check size={18} />{" "}
                  {isDelete ? "Confirm Delete" : "Approve Add"}
                </button>
              </div>
            </div>
          );
        })}
        {requests.length === 0 && (
          <p className="py-10 text-center text-slate-500">
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
