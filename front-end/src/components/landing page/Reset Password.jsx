"use client";

import React from "react";
const ForgotPassword = () => {
  return (
    <div className="relative flex items-center justify-center p-4 overflow-hidden font-sans">
      <div className="relative z-10 w-full max-w-md p-8 transition-all duration-300 transform border rounded-xl hover:border-primary/50">
        <h1 className="mb-3 text-3xl font-light tracking-tight text-center text-foreground md:text-4xl">
          Recover Password
        </h1>
        <p className="mb-8 text-base leading-relaxed text-center text-muted-foreground md:text-lg">
          Enter your email to receive a reset link
        </p>

        <div className="relative mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-foreground"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="w-full py-3 pl-10 pr-4 text-base transition-all duration-200 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border-border hover:border-primary/50"
              aria-label="Email address for password recovery"
            />
            <svg
              className="absolute transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-lg font-bold transition-all duration-200 transform rounded-lg shadow-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 active:scale-95 hover:scale-105"
          aria-label="Send password reset link"
        >
          Send Reset Link
        </button>

        <p className="mt-6 mb-8 text-sm leading-relaxed text-center text-muted-foreground">
          We&apos;ll send you a secure link to reset your password.
        </p>

        <div className="pt-6 text-center border-t border-border">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <a
              href="#"
              className="transition-colors duration-200 rounded-md text-primary hover:underline hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Log in to your account"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
