"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
    <div className="relative flex items-center justify-center w-full mt-8 overflow-hidden font-sans">
      <div className="relative w-full max-w-sm p-6 space-y-5 bg-white border rounded-lg shadow-lg dark:bg-black border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex p-2 border rounded-md bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <ShieldIcon />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Password Reset Required
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              The system's password policy has been updated. Please set a new
              compliant password to continue.
            </p>
          </div>
        </div>

        {/* Policy hint */}
        {settings && (
          <div className="p-3 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-1 text-zinc-500">
            <p className="font-bold text-zinc-700 dark:text-zinc-300">Current policy requires:</p>
            <p>• Minimum {settings.minPasswordLength} characters</p>
            {settings.requireSpecialChars && <p>• At least one special character (!@#$...)</p>}
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleReset}>
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="flex w-full px-3 py-5 pr-10 text-sm bg-white border rounded-md outline-none border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 dark:text-white"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute -translate-y-1/2 right-3 top-1/2">
                {showNew ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="flex w-full px-3 py-5 pr-10 text-sm bg-white border rounded-md outline-none border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 dark:text-white"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute -translate-y-1/2 right-3 top-1/2">
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-colors rounded-md shadow bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Set New Password & Continue"}
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

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
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
    <div className="relative flex items-center justify-center w-full mt-8 overflow-hidden font-sans">
      <div className="relative w-full max-w-sm p-6 space-y-6 bg-white border rounded-lg shadow-lg dark:bg-black border-zinc-200 dark:border-zinc-800 dark:shadow-zinc-900/50">
        <div className="space-y-3 text-center">
          <div className="inline-flex p-2 border rounded-md bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <UserIcon />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Enter your email to sign in
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-50">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="flex w-full px-3 py-5 text-sm bg-white border rounded-md outline-none border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-50">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="flex w-full px-3 py-5 pr-10 text-sm bg-white border rounded-md outline-none border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transition-colors -translate-y-1/2 right-3 top-1/2 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-colors rounded-md shadow bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
