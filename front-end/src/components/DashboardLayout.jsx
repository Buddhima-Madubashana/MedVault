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
} from "lucide-react";

const DashboardLayout = ({ children, sidebarItems }) => {
  const { role, logout, user, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);

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
      let items = [];

      if (role === "Doctor") {
        // Fetch pending patient requests for this doctor
        const res = await fetch(
          `http://localhost:5000/api/patient-requests?role=Doctor&userId=${user._id}`
        );
        if (res.ok) {
          const data = await res.json();
          items = data.map((req) => ({
            id: req._id,
            type: req.requestType === "Delete" ? "Discharge Request" : "Admission Request",
            name: req.requestType === "Delete" ? (req.patientId?.name || "Unknown") : req.name,
            from: req.nurseId?.name || "A nurse",
            icon: req.requestType === "Delete" ? "trash" : "userplus",
            link: "/doctor/reviews",
          }));
        }
      } else if (role === "Admin" && !user.isTempAdmin) {
        // Fetch pending admin access requests
        const res = await fetch("http://localhost:5000/api/admin-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const pending = data.filter((r) => r.status === "Pending");
          items = pending.map((req) => ({
            id: req._id,
            type: "Admin Permission Request",
            name: req.requester?.name || "A doctor",
            from: req.requester?.specialty || "Unknown specialty",
            icon: "shield",
            link: "/admin/requests",
          }));
        }
      }

      setNotifications(items);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, token, role]);

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
        <header className="z-10 flex items-center justify-between h-20 px-8 bg-white/80 backdrop-blur-md border-b dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800">
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
                <div className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 overflow-hidden z-50">
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
                          key={notif.id}
                          onClick={() => {
                            setShowNotifDropdown(false);
                            navigate(notif.link);
                          }}
                          className="w-full flex items-start gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left border-b border-slate-50 dark:border-slate-800/50 last:border-none"
                        >
                          <div className="p-2 mt-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                            {getNotifIcon(notif.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {notif.name}
                            </p>
                            <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
                              {notif.type}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              From: {notif.from}
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
                        onClick={() => {
                          setShowNotifDropdown(false);
                          navigate(role === "Admin" ? "/admin/requests" : "/doctor/reviews");
                        }}
                        className="w-full py-2 text-xs font-bold text-center text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      >
                        View All Requests →
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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
