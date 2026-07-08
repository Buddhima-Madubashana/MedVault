"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

// --- ICONS ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-zinc-600 dark:text-zinc-400">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-orange-500">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// --- THEME TOGGLE BUTTON ---
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-soft text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
};

// --- PASSWORD RESET VIEW ---
function PasswordResetRequired({ pendingLoginData, token, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => {});
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${pendingLoginData.user._id}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to reset password.");
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-[80vh] font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 -z-10" />
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/70 backdrop-blur-xl border rounded-3xl shadow-soft dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-800">
        {/* Header */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <div className="inline-flex p-3 rounded-2xl bg-orange-100/50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <ShieldIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Security Update Required
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The hospital's password policy has been updated. Please set a new
              compliant password to access MedVault.
            </p>
          </div>
        </div>

        {/* Policy hint */}
        {settings && (
          <div className="p-4 text-sm bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl space-y-2 text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-primary-700 dark:text-primary-400">Policy Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Minimum {settings.minPasswordLength} characters</li>
              {settings.requireSpecialChars && <li>At least one special character (!@#$...)</li>}
            </ul>
          </div>
        )}

        {error && (
          <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-2xl dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleReset}>
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full px-4 py-3 text-sm bg-white/50 border rounded-xl outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute -translate-y-1/2 right-4 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {showNew ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full px-4 py-3 text-sm bg-white/50 border rounded-xl outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute -translate-y-1/2 right-4 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-sm font-bold transition-all rounded-xl shadow-lg bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? "Updating Security..." : "Set Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- MAIN LOGIN COMPONENT ---
function Login({ onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pending login: store the data if mustResetPassword is true
  const [pendingLogin, setPendingLogin] = useState(null); // { user, token }

  // Emergency Request states
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [emergencyDuration, setEmergencyDuration] = useState("2");
  const [emergencySuccess, setEmergencySuccess] = useState("");

  const { login, role } = useAuth();
  const navigate = useNavigate();

  // Redirect when role is set (after successful login + password may have been reset)
  useEffect(() => {
    if (role === "Admin") navigate("/admin");
    else if (role === "Doctor") navigate("/doctor");
    else if (role === "Nurse") navigate("/nurse");
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setEmergencySuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.onLeave) {
          setShowEmergencyForm(true);
        }
        throw new Error(data.message || "Login failed");
      }

      if (data.token && data.user) {
        // If user must reset password, hold the login data and show the reset form
        if (data.user.mustResetPassword) {
          setPendingLogin({ user: data.user, token: data.token });
          return;
        }
        // Normal login
        login(data.user, data.token);
        if (data.user.role === "Admin") navigate("/admin");
        else if (data.user.role === "Doctor") navigate("/doctor");
        else if (data.user.role === "Nurse") navigate("/nurse");
      } else {
        throw new Error("Invalid response from server: Token missing.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/leave-requests/emergency-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          reason: emergencyReason,
          durationHours: parseFloat(emergencyDuration),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEmergencySuccess(data.message);
        setShowEmergencyForm(false);
        setEmergencyReason("");
      } else {
        setError(data.error || "Failed to submit emergency request.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // After successful password reset, complete the login
  const handlePasswordResetSuccess = () => {
    if (pendingLogin) {
      login(pendingLogin.user, pendingLogin.token);
    }
  };

  // Show password reset view if required
  if (pendingLogin) {
    return (
      <PasswordResetRequired
        pendingLoginData={pendingLogin}
        token={pendingLogin.token}
        onSuccess={handlePasswordResetSuccess}
      />
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center font-sans">
      <ThemeToggleButton />
      <div className="relative w-full max-w-md p-8 space-y-8 bg-white/70 backdrop-blur-xl border rounded-3xl shadow-soft dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-800">
        <div className="space-y-3 text-center flex flex-col items-center">
          <div className="inline-flex p-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-2">
            <UserIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              MedVault
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Secure Clinical Authentication
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-2xl dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        {emergencySuccess && (
          <div className="p-4 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-2xl dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/50 animate-fade-in">
            {emergencySuccess}
          </div>
        )}

        {showEmergencyForm ? (
          <form className="space-y-5" onSubmit={handleEmergencySubmit}>
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Emergency Request</h2>
              <p className="text-xs text-slate-500">Provide details to request temporary access.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 text-sm bg-slate-100 border rounded-xl outline-none border-slate-200 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400 opacity-80"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Access Duration
              </label>
              <select
                value={emergencyDuration}
                onChange={(e) => setEmergencyDuration(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white/50 border rounded-xl outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="4">4 Hours</option>
                <option value="8">8 Hours</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Emergency Justification
              </label>
              <textarea
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                rows={3}
                placeholder="Enter justification for emergency access..."
                required
                className="w-full px-4 py-3 text-sm bg-white/50 border rounded-xl outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowEmergencyForm(false);
                  setError("");
                }}
                className="flex-1 py-2.5 px-4 text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 text-sm bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Provider Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.smith@hospital.org"
                required
                className="w-full px-4 py-3 text-sm bg-white/50 border rounded-xl outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 text-sm bg-white/50 border rounded-xl outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3.5 text-sm font-bold transition-all rounded-xl shadow-lg bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
