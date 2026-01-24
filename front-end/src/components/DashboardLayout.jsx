"use client";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../Contexts/AuthContext";
const DashboardLayout = ({ children, sidebarItems }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg dark:bg-zinc-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            MedVault - {role}
          </h2>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block px-6 py-3 transition text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
          {/* 4 Cards: 2 top, 2 bottom */}
          <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-semibold">Card 1</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Content for the first card (top left).
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-semibold">Card 2</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Content for the second card (top right).
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-semibold">Card 3</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Content for the third card (bottom left).
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-semibold">Card 4</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Content for the fourth card (bottom right).
            </p>
          </div>
        </div>
        {/* Optional: children for specific page content override if needed */}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </div>
  );
};

export default DashboardLayout;
