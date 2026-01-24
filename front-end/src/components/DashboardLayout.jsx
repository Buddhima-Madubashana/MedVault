// src/components/DashboardLayout.jsx
"use client";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DashboardLayout = ({ children, sidebarItems }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white shadow-lg dark:bg-zinc-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            MedVault{" "}
            <span className="text-sm font-normal text-zinc-500">| {role}</span>
          </h2>
        </div>

        <nav className="flex-1 mt-6">
          {sidebarItems.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "" &&
                location.pathname.startsWith(item.path) &&
                item.path !== "/" + role.toLowerCase());

            return (
              <Link
                key={index}
                to={item.path}
                className={`block px-6 py-3 transition ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-700 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-white transition bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-y-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
