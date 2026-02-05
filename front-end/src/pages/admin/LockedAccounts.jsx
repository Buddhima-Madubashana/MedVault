import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Notification from "../../components/Notification";

const LockedAccounts = () => {
  const [lockedUsers, setLockedUsers] = useState([]);
  const [notification, setNotification] = useState(null);

  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchLockedUsers = () => {
    fetch("http://localhost:5000/api/users/locked")
      .then((res) => res.json())
      .then((data) => setLockedUsers(data))
      .catch((err) => console.error("Error fetching locked users:", err));
  };

  useEffect(() => {
    fetchLockedUsers();
  }, []);

  const initiateUnlock = (user) => {
    setConfirmDialog({
      isOpen: true,
      title: "Unlock Account?",
      message: `Are you sure you want to unlock ${user.name}'s account? They will be allowed to log in immediately.`,
      onConfirm: () => handleUnlock(user._id, user.name),
    });
  };

  const handleUnlock = async (userId, userName) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${userId}/unlock`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        setNotification({
          type: "success",
          title: "Account Unlocked",
          message: `${userName} can now log in again.`,
        });
        fetchLockedUsers();
      } else {
        setNotification({
          type: "error",
          title: "Error",
          message: "Failed to unlock account.",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Security Incidents
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Manage accounts that have been blocked due to suspicious activity.
        </p>
      </div>

      {lockedUsers.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed dark:bg-slate-800 rounded-2xl border-slate-300 dark:border-slate-700">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 dark:bg-green-900/30">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            System Secure
          </h3>
          <p className="text-slate-500">
            No locked accounts found. All staff have normal access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lockedUsers.map((user) => (
            <div
              key={user._id}
              className="relative p-6 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-2xl dark:border-red-900/50"
            >
              <div className="absolute text-red-500 top-4 right-4">
                <Lock size={20} />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    user.imageUrl ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  className="object-cover w-16 h-16 rounded-2xl ring-2 ring-red-200"
                  alt=""
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h3>
                  <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200 mt-1">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="p-3 mb-4 bg-white border border-red-100 dark:bg-slate-900/50 rounded-xl dark:border-red-900/30">
                <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                  <ShieldAlert size={16} />
                  Account Blocked
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Reason: 3 Failed Login Attempts
                </p>
              </div>

              <button
                onClick={() => initiateUnlock(user)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Unlock size={18} /> Unlock Account
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm p-6 bg-white border shadow-2xl dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-red-50 dark:bg-red-900/20">
                  <AlertCircle
                    className="text-red-600 dark:text-red-400"
                    size={24}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                    {confirmDialog.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {confirmDialog.message}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() =>
                        setConfirmDialog({ ...confirmDialog, isOpen: false })
                      }
                      className="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                        setConfirmDialog({ ...confirmDialog, isOpen: false });
                      }}
                      className="px-4 py-2 text-sm font-bold text-white transition-all bg-red-600 rounded-lg shadow-md hover:bg-red-700 shadow-red-500/20"
                    >
                      Confirm Unlock
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TOAST NOTIFICATIONS --- */}
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

export default LockedAccounts;
