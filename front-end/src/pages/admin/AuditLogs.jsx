import React, { useState, useEffect } from "react";
import { FileText, Search, Filter, Shield } from "lucide-react";

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

  const getActionColor = (action) => {
    if (
      action.includes("DELETE") ||
      action.includes("BLOCK") ||
      action.includes("FAIL")
    )
      return "text-red-600 bg-red-50 border-red-200";
    if (action.includes("LOGIN") || action.includes("UNLOCK"))
      return "text-blue-600 bg-blue-50 border-blue-200";
    if (action.includes("ADD") || action.includes("CREATE"))
      return "text-green-600 bg-green-50 border-green-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <div className="space-y-8">
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
              className="w-64 py-2 pr-4 text-sm bg-white border outline-none pl-9 rounded-xl border-slate-200 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  Timestamp
                </th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  User
                </th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                  Action
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
              {filteredLogs.map((log) => (
                <tr
                  key={log._id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-slate-200 text-slate-600">
                        {log.userName.charAt(0)}
                      </div>
                      {log.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="max-w-xs px-6 py-4 truncate text-slate-600 dark:text-slate-300">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {log.ipAddress || "::1"}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Shield size={32} className="text-slate-300" />
                      <p>No audit logs found matching your criteria.</p>
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
