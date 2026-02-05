"use client";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  Bell,
  ShieldCheck,
  Activity,
  Lock, // Added missing icon import
  UserCog, // Added missing icon import
} from "lucide-react";

const DashboardLayout = ({ children, sidebarItems }) => {
  const { role, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="flex h-screen font-sans bg-slate-50 dark:bg-slate-900">
      {/* --- SIDEBAR --- */}
      <aside className="z-20 flex flex-col text-white transition-all duration-300 shadow-2xl w-72 bg-slate-900">
        {/* Brand Header */}
        <div className="flex items-center h-20 px-8 border-b border-slate-700/50">
          <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">MedVault</h1>
            <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
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
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20 translate-x-1"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }
                >
                  {getIcon(item.name)}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 rounded-xl"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <div className="relative flex flex-col flex-1 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="z-10 flex items-center justify-between h-20 px-8 bg-white border-b shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          {/* LEFT SIDE: Spacer (Search bar removed) */}
          <div className="flex-1"></div>

          {/* RIGHT SIDE: Actions & Profile */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 transition-colors rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold leading-tight text-slate-800 dark:text-white">
                  {user?.name || role}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {role}
                </p>
              </div>
              <div className="w-10 h-10 overflow-hidden rounded-full shadow-md bg-slate-200 ring-2 ring-white">
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
        <main className="flex-1 p-8 overflow-y-auto scroll-smooth bg-slate-50 dark:bg-slate-900">
          <div className="mx-auto duration-500 max-w-7xl animate-in fade-in slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
