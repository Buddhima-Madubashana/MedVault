"use client";

import React, { useState } from "react";
const UserIcon = () => (
  <svg
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5"></path>
    <path d="m12 19-7-7 7-7"></path>
  </svg>
);
const Signin1 = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
            <div
              className="h-2 transition-all duration-500 ease-out bg-gray-900 rounded-full signin-progress dark:bg-gray-100"
              style={{
                width: `${(step / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        {}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm signin-card dark:bg-black dark:border-gray-800">
          {}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full dark:bg-gray-900">
              <UserIcon />
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Create account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {step === 1 && "Let's start with your basic information"}
              {step === 2 && "Now, set up your credentials"}
              {step === 3 && "Almost done! Review your details"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {}
            {step === 1 && (
              <div className="space-y-4 signin-step">
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 text-sm text-gray-900 transition-all duration-200 bg-white border border-gray-200 rounded-md signin-input dark:bg-black dark:border-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
                    />
                    {fullName && (
                      <div className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 dark:text-gray-500">
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!fullName}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-gray-900 rounded-md signin-button dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <ArrowRightIcon />
                </button>
              </div>
            )}

            {}
            {step === 2 && (
              <div className="space-y-4 signin-step">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none dark:text-gray-500">
                      <MailIcon />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full py-2 pr-3 text-sm text-gray-900 transition-all duration-200 bg-white border border-gray-200 rounded-md signin-input pl-9 dark:bg-black dark:border-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none dark:text-gray-500">
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full py-2 pr-10 text-sm text-gray-900 transition-all duration-200 bg-white border border-gray-200 rounded-md signin-input pl-9 dark:bg-black dark:border-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!email || !password}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-gray-900 rounded-md signin-button dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <ArrowRightIcon />
                </button>
              </div>
            )}

            {}
            {step === 3 && (
              <div className="space-y-4 signin-step">
                <div className="p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                  <h3 className="flex items-center gap-2 mb-3 font-medium text-gray-900 dark:text-gray-100">
                    <CheckIcon />
                    Review Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Name:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {fullName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Email:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Password:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ••••••••
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-gray-900 rounded-md signin-button dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full animate-spin dark:border-gray-900 border-t-transparent"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            )}
          </form>

          {}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center justify-center w-full gap-2 mt-4 text-sm font-medium text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeftIcon />
              Back to previous step
            </button>
          )}

          {}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a
                onClick={onSwitchToLogin}
                href="#"
                className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signin1;
const styles = `
  .signin-input:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  .dark .signin-input:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  .signin-button:hover {
    transform: translateY(-1px);
  }

  .signin-progress {
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .signin-step {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .signin-card {
    animation: fadeIn 0.3s ease-out;
  }
`;
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
