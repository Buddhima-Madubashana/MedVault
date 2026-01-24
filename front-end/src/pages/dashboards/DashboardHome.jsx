import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const DashboardHome = () => {
  const { role } = useAuth();

  if (role === "Admin") {
    return <AdminWidgets />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Welcome, {role}
      </h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Select an item from the sidebar to get started.
      </p>
    </div>
  );
};

const AdminWidgets = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Security Overview
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Widget 1: Security Health Score */}
        <div className="p-6 bg-white border-l-4 border-green-500 rounded-lg shadow dark:bg-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Security Health Score
          </h3>
          <div className="flex items-end mt-4">
            <span className="text-5xl font-bold text-green-600">85</span>
            <span className="mb-1 ml-2 text-xl text-zinc-500">/ 100</span>
          </div>
          <div className="w-full h-2 mt-4 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: "85%" }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-zinc-500">System is stable.</p>
        </div>

        {/* Widget 2: System Status */}
        <div className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow dark:bg-zinc-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            System Status
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Encryption
              </span>
              <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded">
                AES-256 Active
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Audit Logging
              </span>
              <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded">
                Active
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Context Evaluation
              </span>
              <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded">
                Running
              </span>
            </li>
          </ul>
        </div>

        {/* Widget 3: Active Sessions */}
        <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Active Sessions (Real-time)
          </h3>
          <div className="space-y-4">
            {[
              {
                user: "Dr. Smith",
                ip: "192.168.1.10",
                risk: "Low",
                color: "text-green-600",
              },
              {
                user: "Nurse Joy",
                ip: "192.168.1.15",
                risk: "Low",
                color: "text-green-600",
              },
              {
                user: "Admin",
                ip: "10.0.0.5",
                risk: "Medium",
                color: "text-yellow-600",
              },
            ].map((session, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between pb-2 border-b last:border-0 border-zinc-100 dark:border-zinc-700"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {session.user}
                  </p>
                  <p className="text-xs text-zinc-500">{session.ip}</p>
                </div>
                <span className={`text-sm font-bold ${session.color}`}>
                  {session.risk} Risk
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 4: Recent Security Events */}
        <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Recent Security Events
          </h3>
          <div className="relative pl-4 space-y-6 border-l-2 border-zinc-200 dark:border-zinc-700">
            <div className="relative">
              <div className="absolute -left-[21px] bg-red-500 h-3 w-3 rounded-full top-1.5"></div>
              <p className="text-sm text-zinc-500">10:42 AM</p>
              <p className="font-medium text-zinc-900 dark:text-white">
                Failed Login Attempt
              </p>
              <p className="text-xs text-zinc-500">
                IP: 45.33.22.11 (Unknown Device)
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] bg-yellow-500 h-3 w-3 rounded-full top-1.5"></div>
              <p className="text-sm text-zinc-500">09:15 AM</p>
              <p className="font-medium text-zinc-900 dark:text-white">
                Policy Update
              </p>
              <p className="text-xs text-zinc-500">Changed by Admin</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] bg-green-500 h-3 w-3 rounded-full top-1.5"></div>
              <p className="text-sm text-zinc-500">08:00 AM</p>
              <p className="font-medium text-zinc-900 dark:text-white">
                System Backup
              </p>
              <p className="text-xs text-zinc-500">Completed successfully</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
