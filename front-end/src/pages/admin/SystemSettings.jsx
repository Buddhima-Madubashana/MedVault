import React, { useState, useEffect } from "react";
import { Shield, Clock, AlertTriangle, Save, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { AnimatePresence } from "framer-motion";
import Notification from "../../components/Notification";

const SystemSettings = () => {
  const { user, token } = useAuth();
  const [policies, setPolicies] = useState({
    minPasswordLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 15,
    maxLoginAttempts: 3,
    accountLockoutDuration: 30, // minutes
  });

  const [notification, setNotification] = useState(null);

  // Fetch Current Settings
  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if(data._id) setPolicies(data);
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPolicies({
      ...policies,
      [name]: type === "checkbox" ? checked : Number(value),
    });
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...policies, actionBy: user._id }),
      });

      if (res.ok) {
        setNotification({
          type: "success",
          title: "Saved",
          message: "Global security policies updated successfully.",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      setNotification({
        type: "error",
        title: "Error",
        message: "Failed to update settings.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Settings
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Configure global security policies and system thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Password Policy Card */}
        <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <Shield className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Password Policy
              </h2>
              <p className="text-sm text-slate-500">
                Enforce strength requirements for user accounts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Minimum Password Length
              </label>
              <input
                type="number"
                name="minPasswordLength"
                value={policies.minPasswordLength}
                onChange={handleChange}
                min="6"
                max="32"
                className="w-full px-4 py-2 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                name="requireSpecialChars"
                checked={policies.requireSpecialChars}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Require Special Characters (!@#$)
              </label>
            </div>
          </div>
        </div>

        {/* Access Control Card */}
        <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30">
              <Clock className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Session & Access Control
              </h2>
              <p className="text-sm text-slate-500">
                Manage automated timeouts and lockout rules.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Session Timeout (Minutes)
              </label>
              <input
                type="number"
                name="sessionTimeout"
                value={policies.sessionTimeout}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Max Login Attempts
              </label>
              <input
                type="number"
                name="maxLoginAttempts"
                value={policies.maxLoginAttempts}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Lockout Duration (Minutes)
              </label>
              <input
                type="number"
                name="accountLockoutDuration"
                value={policies.accountLockoutDuration}
                onChange={handleChange}
                min="5"
                className="w-full px-4 py-2 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-600 rounded-r-xl">
          <div className="flex gap-3">
            <AlertTriangle className="shrink-0 text-yellow-600 dark:text-yellow-500" />
            <div>
              <p className="font-bold text-yellow-800 dark:text-yellow-400">
                Change Impact Warning
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Updating these policies will affect all users immediately. Active sessions may be terminated if they exceed new timeout limits.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 font-bold text-white transition-all bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl shadow-blue-500/30"
          >
            <Save size={20} /> Save Configuration
          </button>
        </div>
      </div>

      {/* --- TOAST --- */}
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

export default SystemSettings;
