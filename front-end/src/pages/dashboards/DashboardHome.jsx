import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Clock,
  Activity,
  Users,
  Shield,
  CheckCircle,
  FileText,
} from "lucide-react";

// Greeting Logic
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// --- UPDATED WIDGET CARD (Stronger Border) ---
const WidgetCard = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-slate-800 rounded-2xl border border-blue-300 dark:border-blue-700 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20 p-6 ${className}`}
  >
    {children}
  </div>
);

const DashboardHome = () => {
  const { user, role } = useAuth();
  const greeting = getGreeting();
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (role === "Doctor" || role === "Nurse") {
      const endpoint = role === "Doctor" ? "doctors" : "nurses";
      fetch(`http://localhost:5000/api/users/${endpoint}`)
        .then((res) => res.json())
        .then((data) => setStaffList(data.slice(0, 4)))
        .catch((err) => console.error(err));
    }
  }, [role]);

  if (!user)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading Secure Context...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-8 overflow-hidden text-white shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-blue-900/20">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              {greeting}, {user.name.split(" ")[0]}
            </h1>
            <p className="max-w-xl text-lg text-blue-100 opacity-90">
              Welcome to your secure dashboard. Check your activity feed for
              recent updates.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-medium transition-all border border-white/10">
              View Schedule
            </button>
            {role !== "Admin" && (
              <button className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Start Rounds
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mt-10 -mr-10 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 -mb-10 -ml-10 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-1">
          <WidgetCard className="relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-full h-24 bg-blue-50/50 dark:bg-slate-700/50"></div>
            <div className="relative z-10 inline-block">
              <div className="p-1 mx-auto bg-white rounded-full shadow-md w-28 h-28 dark:bg-slate-800 ring-1 ring-blue-100 dark:ring-slate-700">
                <img
                  src={
                    user.imageUrl ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div className="absolute w-5 h-5 bg-green-500 border-4 border-white rounded-full bottom-2 right-2 dark:border-slate-800"></div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <span className="inline-block px-3 py-1 mt-2 text-xs font-bold tracking-wide text-blue-700 uppercase bg-blue-100 border border-blue-200 rounded-full dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800">
                {user.role}
              </span>
              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                {user.specialty || user.ward || "System Administrator"}
              </p>
            </div>
          </WidgetCard>

          <WidgetCard>
            <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-slate-400">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-green-600 bg-green-100 rounded-lg">
                    <Shield size={18} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Security Level
                  </span>
                </div>
                <span className="flex items-center gap-1 font-bold text-green-600">
                  <CheckCircle size={14} /> High
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
                    <Activity size={18} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    System Load
                  </span>
                </div>
                <span className="font-bold text-blue-600">Normal</span>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Right Column */}
        <div className="space-y-8 lg:col-span-2">
          <WidgetCard>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <Clock size={20} className="text-blue-500" /> Live Activity Feed
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="px-2 space-y-6">
              {[
                {
                  time: "10:42 AM",
                  title: "Vital Signs Alert",
                  desc: "Patient #4092 (Ward A) showing irregular heartbeat.",
                  color: "bg-red-500",
                  icon: <Activity size={14} className="text-white" />,
                },
                {
                  time: "09:15 AM",
                  title: "Lab Results Ready",
                  desc: "Blood work completed for Jane Doe.",
                  color: "bg-blue-500",
                  icon: <FileText size={14} className="text-white" />,
                },
                {
                  time: "08:30 AM",
                  title: "System Login",
                  desc: "Successful secure login detected via generalized IP.",
                  color: "bg-green-500",
                  icon: <Shield size={14} className="text-white" />,
                },
              ].map((item, i) => (
                <div key={i} className="relative flex gap-4 group">
                  <div className="flex flex-col items-center h-full">
                    <div
                      className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center shadow-sm z-10 ring-4 ring-white dark:ring-slate-800`}
                    >
                      {item.icon}
                    </div>
                    {i !== 2 && (
                      <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700/80 absolute top-8 bottom-0 left-4 -ml-px h-full z-0"></div>
                    )}
                  </div>
                  <div className="pt-1 pb-4">
                    <p className="mb-1 text-xs font-bold text-slate-400">
                      {item.time}
                    </p>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>

          {role !== "Admin" && (
            <WidgetCard>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <Users size={20} className="text-blue-500" />
                  {role === "Doctor" ? "Doctors On Call" : "Nurses On Duty"}
                </h3>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                  Live
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {staffList.length > 0 ? (
                  staffList.map((staff, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 transition-all border cursor-pointer rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 group"
                    >
                      <div className="relative">
                        <img
                          src={
                            staff.imageUrl ||
                            `https://ui-avatars.com/api/?name=${staff.name}`
                          }
                          className="object-cover w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-800"
                          alt="Staff"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-slate-800"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold transition-colors text-slate-900 dark:text-white group-hover:text-blue-600">
                          {staff.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {staff.specialty || staff.ward || "General"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 py-4 text-center text-slate-500">
                    No active staff found.
                  </p>
                )}
              </div>
            </WidgetCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
