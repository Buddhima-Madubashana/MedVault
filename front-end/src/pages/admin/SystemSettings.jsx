import React, { useState, useEffect } from "react";
import {
  Shield,
  Clock,
  AlertTriangle,
  Save,
  Users,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import Notification from "../../components/Notification";

const SystemSettings = () => {
  const { user, token } = useAuth();
  const [policies, setPolicies] = useState({
    minPasswordLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 15,
    maxLoginAttempts: 3,
    accountLockoutDuration: 30,
  });

  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);
  const [compliance, setCompliance] = useState(null); // { pendingCount, totalNonAdmin }
  const [saveResult, setSaveResult] = useState(null); // { flaggedCount, message }

  // Fetch Current Settings
  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data._id) setPolicies(data);
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, []);

  // Fetch compliance status
  const fetchCompliance = () => {
    if (!token) return;
    fetch("http://localhost:5000/api/settings/compliance", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCompliance(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCompliance();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPolicies({
      ...policies,
      [name]: type === "checkbox" ? checked : Number(value),
    });
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setSaveResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...policies, actionBy: user._id }),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveResult(data);
        setNotification({
          type: "success",
          title: "Settings Saved",
          message: data.message || "Global security policies updated.",
          duration: 4000,
        });
        // Refresh compliance summary
        fetchCompliance();
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err) {
      setNotification({
        type: "error",
        title: "Error",
        message: "Failed to update settings.",
        duration: 3000,
      });
    } finally {
      setSaving(false);
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

      {/* Compliance Status Banner */}
      {compliance && compliance.pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 p-5 border border-orange-200 rounded-2xl bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800"
        >
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl shrink-0">
            <Users className="text-orange-600 dark:text-orange-400" size={22} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-orange-800 dark:text-orange-300">
              Password Reset Required
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-400 mt-0.5">
              <strong>{compliance.pendingCount}</strong> of{" "}
              {compliance.totalNonAdmin} users need to reset their password to
              comply with the current policy. They will be prompted on their
              next login.
            </p>
          </div>
          <button
            onClick={fetchCompliance}
            className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </motion.div>
      )}

      {/* All compliant banner */}
      {compliance && compliance.pendingCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 border border-green-200 rounded-2xl bg-green-50 dark:bg-green-900/10 dark:border-green-800"
        >
          <CheckCircle className="text-green-600 dark:text-green-400 shrink-0" size={20} />
          <p className="text-sm font-medium text-green-700 dark:text-green-300">
            All {compliance.totalNonAdmin} users comply with the current password policy.
          </p>
        </motion.div>
      )}

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
                Enforce strength requirements for user accounts. Applies to{" "}
                <strong>new registrations</strong> and flags existing users to
                reset when policy is tightened.
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
              <p className="text-xs text-slate-400">
                Current: {policies.minPasswordLength} characters minimum
              </p>
            </div>

            <div className="flex items-start gap-3 pt-6">
              <input
                type="checkbox"
                id="requireSpecialChars"
                name="requireSpecialChars"
                checked={policies.requireSpecialChars}
                onChange={handleChange}
                className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="requireSpecialChars"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Require Special Characters
                <span className="block text-xs text-slate-400 font-normal mt-0.5">
                  e.g. !@#$%^&*
                </span>
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
                Session &amp; Access Control
              </h2>
              <p className="text-sm text-slate-500">
                Manage automated timeouts and lockout rules. Applied to all
                users on next login.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Session Timeout
              </label>
              <input
                type="number"
                name="sessionTimeout"
                value={policies.sessionTimeout}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
              <p className="text-xs text-slate-400">{policies.sessionTimeout} minutes</p>
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
              <p className="text-xs text-slate-400">
                Account locks after {policies.maxLoginAttempts} failures
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Lockout Duration
              </label>
              <input
                type="number"
                name="accountLockoutDuration"
                value={policies.accountLockoutDuration}
                onChange={handleChange}
                min="5"
                className="w-full px-4 py-2 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
              <p className="text-xs text-slate-400">{policies.accountLockoutDuration} minutes</p>
            </div>
          </div>
        </div>

        {/* Save Result Banner */}
        <AnimatePresence>
          {saveResult && saveResult.policyTightened && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-4 p-5 border border-blue-200 rounded-2xl bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800"
            >
              <Users className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-blue-800 dark:text-blue-300">
                  Policy Applied to Existing Users
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">
                  {saveResult.flaggedCount} existing user(s) have been flagged
                  to reset their password on next login to comply with the new
                  password policy.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning Banner */}
        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-600 rounded-r-xl">
          <div className="flex gap-3">
            <AlertTriangle className="shrink-0 text-yellow-600 dark:text-yellow-500" />
            <div>
              <p className="font-bold text-yellow-800 dark:text-yellow-400">
                Change Impact
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1 list-disc list-inside">
                <li>
                  <strong>Password policy</strong> — enforced immediately for
                  new accounts. Existing users are flagged to reset if policy is
                  tightened.
                </li>
                <li>
                  <strong>Session timeout &amp; max attempts</strong> — applied
                  to all users on next login.
                </li>
                <li>Active sessions may be terminated if they exceed new timeout limits.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 font-bold text-white transition-all bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl shadow-blue-500/30 disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Saving..." : "Save Configuration"}
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
