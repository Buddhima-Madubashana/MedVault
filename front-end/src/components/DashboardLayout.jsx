"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  Bell,
  ShieldCheck,
  Activity,
  Lock,
  UserCog,
  Sun,
  Moon,
  UserPlus,
  Trash2,
  Shield,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  ShieldOff,
} from "lucide-react";

const CamouflageScheduleView = () => {
  const scheduleData = [
    { time: "08:00 - 09:30", task: "Shift Handover & Morning Briefing", dept: "All Departments", status: "Completed" },
    { time: "09:30 - 11:00", task: "HEPA Filter Maintenance & Airflow Check", dept: "Ward 3 & ICU", status: "Completed" },
    { time: "11:00 - 12:30", task: "Operating Room 2 Sterilization Protocol", dept: "Surgical Suite", status: "In Progress" },
    { time: "13:00 - 14:00", task: "Clinical Staff Training - Policy Update", dept: "Main Conference Room", status: "Scheduled" },
    { time: "14:15 - 15:30", task: "Medical Gas Pipeline Pressure Test", dept: "Central Gas Supply", status: "Scheduled" },
    { time: "16:00 - 17:00", task: "Pharmacy Fridge Temperature Log Audit", dept: "Main Pharmacy", status: "Scheduled" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-amber-800 dark:text-amber-300">
        <Shield size={24} className="shrink-0 animate-pulse text-amber-500" />
        <div>
          <p className="font-bold">Security Camouflage Active</p>
          <p className="text-xs opacity-90">All active clinical records and patient data have been obscured. The system is showing non-sensitive operational schedules. Click the floating shield button to return.</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-soft">
        <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Operational Registry</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Non-sensitive hospital resource planning and maintenance logs</p>
          </div>
          <span className="px-3.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">
            System Clock Synchronized
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Time Interval</th>
                <th className="py-3 px-4">Operational Task</th>
                <th className="py-3 px-4">Location/Dept</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {scheduleData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{item.time}</td>
                  <td className="py-4 px-4 text-slate-650 dark:text-slate-350">{item.task}</td>
                  <td className="py-4 px-4 text-slate-500">{item.dept}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      item.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      item.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children, sidebarItems }) => {
  const { role, logout, user, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);

  // Cooperative Security states
  const [inactivityTimeout, setInactivityTimeout] = useState(60);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [isCamouflaged, setIsCamouflaged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch Settings for inactivityTimeout
  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.inactivityTimeout) {
          setInactivityTimeout(data.inactivityTimeout);
        }
      })
      .catch((err) => console.error("Failed to load settings in layout", err));
  }, []);

  // Activity Detector
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (isLocked) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    const checkInterval = setInterval(() => {
      const elapsedSeconds = (Date.now() - lastActivityRef.current) / 1000;
      if (elapsedSeconds >= inactivityTimeout) {
        setIsLocked(true);
      }
    }, 1000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearInterval(checkInterval);
    };
  }, [inactivityTimeout, isLocked]);

  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.email) return;

    setIsUnlocking(true);
    setUnlockError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: unlockPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsLocked(false);
        setUnlockPassword("");
        lastActivityRef.current = Date.now(); // reset activity timer
      } else {
        setUnlockError(data.message || "Invalid password. Access Denied.");
      }
    } catch (err) {
      setUnlockError("Network error. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Icon mapper for dynamic sidebar items
  const getIcon = (name) => {
    if (name.includes("Dashboard")) return <LayoutDashboard size={20} />;
    if (name.includes("Patient") || name.includes("All Users"))
      return <Users size={20} />;
    if (name.includes("Appointment")) return <Calendar size={20} />;
    if (name.includes("Report") || name.includes("Logs"))
      return <FileText size={20} />;
    if (name.includes("Security") || name.includes("Settings"))
      return <ShieldCheck size={20} />;
    if (name.includes("Nurse") || name.includes("Doctor"))
      return <Activity size={20} />;
    if (name.includes("User Management")) return <UserCog size={20} />;
    if (name.includes("Locked")) return <Lock size={20} />;
    return <FileText size={20} />;
  };

  // --- Fetch Notifications ---
  const fetchNotifications = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
      setShowNotifDropdown(false);
      if (link) navigate(link);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user, token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getNotifIcon = (type) => {
    if (type === "trash") return <Trash2 size={16} className="text-red-500" />;
    if (type === "userplus") return <UserPlus size={16} className="text-green-500" />;
    if (type === "shield") return <Shield size={16} className="text-primary-500" />;
    if (type === "lock") return <Lock size={16} className="text-amber-500" />;
    return <Bell size={16} className="text-slate-500" />;
  };

  const notifCount = notifications.length;

  return (
    <div className="flex h-screen font-sans bg-slate-50 dark:bg-slate-950">
      {/* --- SIDEBAR --- */}
      <aside className="z-20 flex flex-col transition-all duration-300 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        {/* Brand Header */}
        <div className="flex items-center h-20 px-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center w-9 h-9 mr-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl shadow-sm border border-primary-100 dark:border-primary-800">
            <ShieldCheck className="text-primary-600 dark:text-primary-400" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MedVault</h1>
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-400 dark:text-slate-500">
              {role} Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.endsWith(item.path));

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}
                >
                  {getIcon(item.name)}
                </span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors bg-slate-50 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800/50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800/50"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <div className="relative flex flex-col flex-1 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="relative z-30 flex items-center justify-between h-20 px-8 bg-white/80 backdrop-blur-md border-b dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800">
          {/* LEFT SIDE: Spacer */}
          <div className="flex-1"></div>

          {/* RIGHT SIDE: Actions & Profile */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 transition-all rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2.5 transition-colors rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Bell size={20} />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-slate-900">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifDropdown && (
                <div className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 overflow-hidden z-[100]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setShowNotifDropdown(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell size={28} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No new notifications
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif._id}
                          onClick={() => markAsRead(notif._id, notif.link)}
                          className="w-full flex items-start gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left border-b border-slate-50 dark:border-slate-800/50 last:border-none"
                        >
                          <div className="p-2 mt-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                            {getNotifIcon(notif.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                              {notif.message}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 mt-2 shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={markAllAsRead}
                        className="w-full py-2 text-xs font-bold text-center text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      >
                        Mark all as read ✓
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold leading-tight text-slate-800 dark:text-white">
                  {user?.name || role}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {role}
                </p>
              </div>
              <div className="w-10 h-10 overflow-hidden rounded-full shadow-md bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-800">
                <img
                  src={
                    user?.imageUrl ||
                    `https://ui-avatars.com/api/?name=${user?.name || role}&background=0D8ABC&color=fff`
                  }
                  alt="User"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Scroll Area */}
        <main className="flex-1 p-8 overflow-y-auto scroll-smooth bg-slate-50 dark:bg-slate-950">
          <div className="mx-auto duration-500 max-w-7xl animate-in fade-in slide-in-from-bottom-4">
            {isCamouflaged ? <CamouflageScheduleView /> : children}
          </div>
        </main>
      </div>

      {/* Floating Panic/Camouflage Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
        {isCamouflaged && (
          <div className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-xl shadow-md backdrop-blur-md animate-bounce">
            Camouflage Shield Active
          </div>
        )}
        <button
          onClick={() => setIsCamouflaged(!isCamouflaged)}
          className={`p-4 rounded-full shadow-2xl border transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
            isCamouflaged
              ? "bg-amber-500 hover:bg-amber-600 border-amber-400 text-white"
              : "bg-red-650 hover:bg-red-700 border-red-500 text-white"
          }`}
          title={isCamouflaged ? "Restore Clinic View" : "Activate Security Camouflage"}
        >
          {isCamouflaged ? <ShieldOff size={24} /> : <Shield size={24} />}
        </button>
      </div>

      {/* Idle Lock Screen Overlay */}
      {isLocked && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl transition-all duration-300 font-sans">
          <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center text-white">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 mb-2">
              <Lock size={32} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Workstation Locked
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                This session has been locked due to inactivity to protect patient privacy.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3 text-left">
              <div className="w-10 h-10 overflow-hidden rounded-full shadow-md bg-slate-700 ring-2 ring-white/10 shrink-0">
                <img
                  src={
                    user?.imageUrl ||
                    `https://ui-avatars.com/api/?name=${user?.name || role}&background=0D8ABC&color=fff`
                  }
                  alt="User"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400">{role}</p>
              </div>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-slate-450">
                  Enter Password to Resume
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Enter your login password"
                    required
                    className="w-full px-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-500 hover:text-slate-350"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {unlockError && (
                <div className="p-3.5 text-xs font-semibold text-red-400 bg-red-950/30 rounded-xl border border-red-900/50 text-left">
                  {unlockError}
                </div>
              )}

              <button
                type="submit"
                disabled={isUnlocking}
                className="w-full px-4 py-3 text-sm font-bold transition-all rounded-xl shadow-lg bg-red-650 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isUnlocking ? "Unlocking..." : "Unlock Session"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-xs font-bold text-slate-400 hover:text-white transition-colors pt-2"
              >
                Sign Out / Switch Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
