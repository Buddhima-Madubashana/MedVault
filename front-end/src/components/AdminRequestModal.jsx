import React, { useState } from "react";
import { X, Shield } from "lucide-react";

const AdminRequestModal = ({ isOpen, onClose, admins, onSubmit }) => {
  const [adminId, setAdminId] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("30"); // Default 30 mins

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ adminId, reason, duration: parseInt(duration) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl dark:bg-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Shield className="text-blue-600" />
            Request Admin Access
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Admin
            </label>
            <select
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">-- Choose an Admin --</option>
              {admins.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.name} ({admin.jobTitle || "Admin"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Reason for Access
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="E.g., Emergency surgery requires access to full patient history..."
              className="w-full p-3 h-24 border rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Duration Limit
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
              <option value="120">2 Hours</option>
              <option value="240">4 Hours</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRequestModal;
