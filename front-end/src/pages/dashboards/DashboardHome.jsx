import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const DashboardHome = () => {
  const { role } = useAuth();

  if (role === "Admin") return <AdminWidgets />;
  if (role === "Nurse") return <NurseWidgets />;
  if (role === "Doctor") return <DoctorWidgets />;

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Welcome, {role}
      </h2>
    </div>
  );
};

// --- Helper for Greeting ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// --- NURSE DASHBOARD ---
const NurseWidgets = () => {
  const greeting = getGreeting();

  // Mock Data
  const nurseProfile = {
    name: "Sarah Jenkins",
    email: "sarah.j@medvault.com",
    role: "Senior Nurse",
    image: "https://i.pravatar.cc/150?u=sarah",
  };

  const recentActivity = [
    { time: "10:30 AM", text: "Updated vitals for Patient #124" },
    { time: "09:15 AM", text: "Administered medication to Room 302" },
    { time: "08:45 AM", text: "Checked in new patient: John Doe" },
  ];

  const onDutyStaff = [
    { name: "Dr. Smith", role: "Doctor", status: "On Duty" },
    { name: "Nurse Joy", role: "Nurse", status: "On Duty" },
    { name: "Nurse Sarah", role: "Nurse", status: "Active" },
  ];

  return (
    <div className="h-full">
      {/* 2-Column Grid Layout */}
      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Greeting + Full Height Profile */}
        <div className="flex flex-col h-full space-y-6 lg:col-span-1">
          {/* Greeting */}
          <div className="text-left">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {greeting}, <br />
              <span className="text-blue-600">Welcome Back</span>
            </h1>
          </div>

          {/* Profile Card (Full Height) */}
          <div className="flex flex-col items-center justify-center flex-1 p-6 text-center bg-white shadow rounded-2xl dark:bg-zinc-800">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={nurseProfile.image}
                alt="Profile"
                className="object-cover w-full h-full border-4 border-blue-100 rounded-full dark:border-blue-900"
              />
              <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-2 right-2"></span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {nurseProfile.name}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              {nurseProfile.role}
            </p>
            <div className="w-full mt-6 space-y-3">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                <p className="text-xs uppercase text-zinc-500">Email</p>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {nurseProfile.email}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                <p className="text-xs uppercase text-zinc-500">Shift</p>
                <p className="font-medium text-zinc-900 dark:text-white">
                  08:00 AM - 04:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity + Staff List */}
        <div className="flex flex-col space-y-6 lg:col-span-2">
          {/* Recent Activity Card */}
          <div className="p-6 bg-white shadow rounded-2xl dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 transition rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/30"
                >
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {activity.text}
                    </p>
                    <p className="text-xs text-zinc-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nurses & Doctors List */}
          <div className="flex-1 p-6 bg-white shadow rounded-2xl dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
              Hospital Staff Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-zinc-500 bg-zinc-50 dark:bg-zinc-700/50">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {onDutyStaff.map((staff, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                        {staff.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {staff.role}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            staff.status === "On Duty"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DOCTOR DASHBOARD ---
const DoctorWidgets = () => {
  const greeting = getGreeting();

  // Mock Data
  const doctorProfile = {
    name: "Dr. Alan Grant",
    email: "alan.grant@medvault.com",
    role: "Chief Cardiologist",
    image: "https://i.pravatar.cc/150?u=alan",
  };

  const recentActivity = [
    { time: "11:00 AM", text: "Emergency Surgery: OR-1" },
    { time: "10:15 AM", text: "Reviewed MRI results for Patient #33" },
    { time: "09:00 AM", text: "Morning Rounds - ICU" },
  ];

  const staffDetails = [
    {
      name: "Dr. Alan Grant",
      role: "Doctor",
      department: "Cardiology",
      status: "On Duty",
    },
    {
      name: "Dr. Ellie Sattler",
      role: "Doctor",
      department: "Paleobotany",
      status: "Available",
    },
    { name: "Nurse Sarah", role: "Nurse", department: "ER", status: "On Duty" },
  ];

  return (
    <div className="h-full">
      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="flex flex-col h-full space-y-6 lg:col-span-1">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {greeting}, <br />
              <span className="text-teal-600">Welcome Back</span>
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 p-6 text-center bg-white shadow rounded-2xl dark:bg-zinc-800">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={doctorProfile.image}
                alt="Profile"
                className="object-cover w-full h-full border-4 border-teal-100 rounded-full dark:border-teal-900"
              />
              <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-2 right-2"></span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {doctorProfile.name}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              {doctorProfile.role}
            </p>
            <div className="w-full mt-6 space-y-3">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                <p className="text-xs uppercase text-zinc-500">Email</p>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {doctorProfile.email}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                <p className="text-xs uppercase text-zinc-500">Specialty</p>
                <p className="font-medium text-zinc-900 dark:text-white">
                  Cardiology
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-6 lg:col-span-2">
          <div className="p-6 bg-white shadow rounded-2xl dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 transition rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/30"
                >
                  <div className="w-2 h-2 mt-2 bg-teal-500 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {activity.text}
                    </p>
                    <p className="text-xs text-zinc-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 bg-white shadow rounded-2xl dark:bg-zinc-800">
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
              Doctors & Nurses On Call
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-zinc-500 bg-zinc-50 dark:bg-zinc-700/50">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Dept</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {staffDetails.map((staff, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                        {staff.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {staff.department}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            staff.status === "On Duty"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN WIDGETS (Preserved from previous step) ---
const AdminWidgets = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Security Overview
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Security Health Score */}
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

        {/* System Status */}
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

        {/* Active Sessions */}
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

        {/* Recent Security Events */}
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
              <p className="text-xs text-zinc-500">IP: 45.33.22.11</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] bg-yellow-500 h-3 w-3 rounded-full top-1.5"></div>
              <p className="text-sm text-zinc-500">09:15 AM</p>
              <p className="font-medium text-zinc-900 dark:text-white">
                Policy Update
              </p>
              <p className="text-xs text-zinc-500">Changed by Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
