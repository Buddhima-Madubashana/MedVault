import React from "react";
import { Check, X, Shield, Activity, User, Stethoscope } from "lucide-react";

const PermissionMatrix = () => {
  const roles = [
    { name: "Admin", icon: Shield, color: "text-purple-600 bg-purple-100" },
    { name: "Temp Admin", icon: Shield, color: "text-indigo-600 bg-indigo-100" },
    { name: "Doctor", icon: Stethoscope, color: "text-blue-600 bg-blue-100" },
    { name: "Nurse", icon: Activity, color: "text-pink-600 bg-pink-100" },
  ];

  const features = [
    { name: "View Dashboard Analytics", permissions: [true, true, true, true] },
    { name: "View Patient Records", permissions: [true, true, true, true] },
    { name: "Manage Patients (Add/Edit)", permissions: [false, true, true, true] },
    { name: "Delete Patient Records", permissions: [true, true, true, true] }, // Hard delete
    { name: "Approve Nurse Requests", permissions: [false, true, true, false] },
    { name: "View Doctors List", permissions: [true, true, true, true] },
    { name: "View Nurses List", permissions: [true, true, true, true] },
    { name: "Manage Users (CRUD)", permissions: [true, false, false, false] },
    { name: "View Audit Logs", permissions: [true, true, false, false] },
    { name: "View All Users List", permissions: [true, true, false, false] },
    { name: "Manage Leave Requests (Staff)", permissions: [true, false, false, false] },
    { name: "Manage Leave Requests (Doctors)", permissions: [true, false, false, false] },
    { name: "Grant Temp Admin Access", permissions: [true, false, false, false] },
    { name: "Manage System Settings", permissions: [true, false, false, false] },
    { name: "Manage Announcements", permissions: [true, true, false, false] },
    { name: "Unlock User Accounts", permissions: [true, true, false, false] },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Permission Matrix
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Overview of system features and access rights per role.
        </p>
      </div>

      <div className="overflow-hidden bg-white border shadow-sm border-slate-200 dark:bg-slate-800 rounded-2xl dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold border-r dark:border-slate-700 border-slate-200 w-1/3">
                  System Feature
                </th>
                {roles.map((role, idx) => {
                  const Icon = role.icon;
                  return (
                    <th key={idx} scope="col" className="px-6 py-4 text-center border-r last:border-r-0 dark:border-slate-700 border-slate-200">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-lg ${role.color}`}>
                          <Icon size={20} />
                        </div>
                        <span className="font-bold">{role.name}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, fIdx) => (
                <tr
                  key={fIdx}
                  className="border-b last:border-b-0 bg-white dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white border-r dark:border-slate-700 border-slate-200">
                    {feature.name}
                  </td>
                  {feature.permissions.map((hasAccess, rIdx) => (
                    <td key={rIdx} className="px-6 py-4 text-center border-r last:border-r-0 dark:border-slate-700 border-slate-200">
                      <div className="flex justify-center">
                        {hasAccess ? (
                          <div className="p-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <Check size={18} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="p-1 rounded-full bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                            <X size={18} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;
