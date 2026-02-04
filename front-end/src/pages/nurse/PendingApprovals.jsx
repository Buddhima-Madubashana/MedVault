import React, { useState, useEffect } from "react";
import { Clock, Trash2, FileText, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../../components/Notification";

const PendingApprovals = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      fetch(
        `http://localhost:5000/api/patient-requests?role=Nurse&userId=${user._id}`,
      )
        .then((res) => res.json())
        .then((data) => setRequests(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Cancel this admission request?")) {
      try {
        await fetch(`http://localhost:5000/api/patient-requests/${id}`, {
          method: "DELETE",
        });
        setRequests(requests.filter((req) => req._id !== id));
        setNotification({
          type: "success",
          title: "Request Cancelled",
          message: "The request has been removed.",
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pending Approvals
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Track the status of your patient admission requests.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed dark:bg-slate-800 rounded-2xl border-slate-300 dark:border-slate-700">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 dark:bg-slate-900">
            <CheckCircle className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            All Caught Up!
          </h3>
          <p className="text-slate-500">
            You have no pending requests at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="relative p-6 transition-all bg-white border border-orange-200 shadow-sm dark:bg-slate-800 rounded-2xl dark:border-orange-900/50 hover:shadow-md group"
            >
              <div className="flex gap-4 mb-4">
                <img
                  src={
                    req.imageUrl ||
                    `https://ui-avatars.com/api/?name=${req.name}`
                  }
                  className="object-cover w-14 h-14 rounded-2xl ring-2 ring-orange-100"
                  alt=""
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {req.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 mt-1">
                    <Clock size={12} /> Pending Approval
                  </span>
                </div>
              </div>

              <div className="p-3 mb-4 space-y-2 text-sm border bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">
                    Assigned Ward
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {req.ward}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Reviewer</span>
                  <span className="font-bold text-blue-600">
                    Dr. {req.doctorId?.name || "Unknown"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center justify-center flex-1 gap-2 py-2 text-sm font-medium transition-colors border rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50">
                  <FileText size={16} /> View Details
                </button>
                <button
                  onClick={() => handleDelete(req._id)}
                  className="p-2 text-red-600 transition-colors border border-red-200 rounded-xl hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {notification && (
        <div className="fixed z-50 bottom-6 right-6">
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
