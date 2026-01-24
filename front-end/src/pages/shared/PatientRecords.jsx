import React from "react";

const PatientRecords = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Patient Records
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage patient data and history.
          </p>
        </div>
        <button className="px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 md:mt-0">
          + Add New Patient
        </button>
      </div>

      {/* Added Records Table / List */}
      <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-zinc-800">
        <table className="min-w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-700">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                Age
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                Condition
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100">
                John Doe
              </td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">45</td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                Hypertension
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                  Stable
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100">
                Jane Smith
              </td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">32</td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                Flu
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                  Observation
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientRecords;
