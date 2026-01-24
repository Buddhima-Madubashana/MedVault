"use client";
import React, { useState } from "react";

import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export default function Login({ onSwitchToSignup, onSwitchToForgetPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // kept for UI, but not used for auth

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call login function from context (sets role based on email)
    login(email);

    // Immediately check role after login attempt
    const enteredRole = email.toLowerCase().includes("admin")
      ? "Admin"
      : email.toLowerCase().includes("doctor")
        ? "Doctor"
        : email.toLowerCase().includes("nurse")
          ? "Nurse"
          : null;

    if (enteredRole === "Admin") {
      navigate("/admin");
    } else if (enteredRole === "Doctor") {
      navigate("/doctor");
    } else if (enteredRole === "Nurse") {
      navigate("/nurse");
    } else {
      alert(
        "Please use one of these emails:\n" +
          "• admin@medvault.com\n" +
          "• doctor@medvault.com\n" +
          "• nurse@medvault.com",
      );
    }
  };

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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-50"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="flex w-full px-3 py-5 text-sm transition-colors bg-white border rounded-md shadow-sm h-9 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-50"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex w-full px-3 py-5 pr-10 text-sm transition-colors bg-white border rounded-md shadow-sm h-9 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-colors rounded-md shadow whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9"
          >
            Sign In
          </button>
        </form>

        <div className="space-y-2 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <a
              onClick={onSwitchToSignup}
              href="#"
              className="font-medium underline transition-colors text-zinc-900 dark:text-zinc-50 underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Sign up
            </a>
          </p>
          <a
            onClick={onSwitchToForgetPassword}
            href="#"
            className="text-sm font-medium underline transition-colors text-zinc-900 dark:text-zinc-50 underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
