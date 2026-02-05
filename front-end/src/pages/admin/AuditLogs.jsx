import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle,
  User,
  Info,
} from "lucide-react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/audit-logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter logs based on search
  const filteredLogs = logs.filter(
    (log) =>
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- STYLE HELPER ---
  const getActionStyle = (action) => {
    // 🔴 CRITICAL / DANGER ACTIONS
    if (
      action.includes("DELETE") ||
      action.includes("BLOCK") ||
      action.includes("FAIL") ||
      action.includes("LOCKED") ||
      action.includes("REJECTED")
    ) {
      return {
        style:
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
        icon: <AlertTriangle size={14} className="mr-1.5" />,
      };
    }

    // 🟢 CREATE / SUCCESS ACTIONS
    if (
      action.includes("ADD") ||
      action.includes("CREATE") ||
      action.includes("REGISTER") ||
      action.includes("APPROVED") ||
      action.includes("SUCCESS")
    ) {
      return {
        style:
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        icon: <CheckCircle size={14} className="mr-1.5" />,
      };
    }

    // 🔵 INFO / UPDATE ACTIONS
    if (
      action.includes("LOGIN") ||
      action.includes("UNLOCK") ||
      action.includes("SENT")
    ) {
      return {
        style:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        icon: <Info size={14} className="mr-1.5" />,
      };
    }

    // ⚪ DEFAULT
    return {
      style:
        "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      icon: (
        <div className="w-3.5 h-3.5 mr-1.5 rounded-full bg-slate-400"></div>
      ),
    };
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Doctor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Nurse":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audit Logs
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Complete history of system activities and security events.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 py-2 pr-4 text-sm transition-all bg-white border shadow-sm outline-none pl-9 rounded-xl border-slate-200 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 transition-colors bg-white border shadow-sm border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="overflow-hidden bg-white border border-blue-300 shadow-sm dark:bg-slate-800 rounded-2xl dark:border-blue-700 shadow-blue-200/50 dark:shadow-blue-900/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  Timestamp
                </th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  User & Role
                </th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  Action Type
                </th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  Details
                </th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLogs.map((log) => {
                const actionStyle = getActionStyle(log.action);
                return (
                  <tr
                    key={log._id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 font-mono text-xs align-top text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    {/* USER & ROLE BATCH */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col items-start gap-1.5">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center justify-center w-6 h-6 text-xs border rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600">
                            <User size={12} />
                          </div>
                          {log.userName}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getRoleBadgeColor(log.userRole)}`}
                        >
                          {log.userRole}
                        </span>
                      </div>
                    </td>

                    {/* COLORED ACTION BADGE */}
                    <td className="px-6 py-4 align-top">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${actionStyle.style}`}
                      >
                        {actionStyle.icon}
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* UPDATED: Removed hover effects, enabled wrapping */}
                    <td className="max-w-sm px-6 py-4 break-words align-top text-slate-600 dark:text-slate-300">
                      {log.details}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs align-top text-slate-400">
                      {log.ipAddress || "::1"}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Shield size={40} className="text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">
                        No logs found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
