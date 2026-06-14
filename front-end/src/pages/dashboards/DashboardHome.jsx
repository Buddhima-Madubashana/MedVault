import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import AdminRequestModal from "../../components/AdminRequestModal"; // Import Modal
import {
  Clock,
  Activity,
  Users,
  Shield,
  CheckCircle,
  UserPlus,
  AlertTriangle,
  Lock,
} from "lucide-react";

// Greeting Logic
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// --- Reusable Widget Card (Blue Border Theme) ---
const WidgetCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-soft p-6 ${className}`}
  >
    {children}
  </div>
);

const DashboardHome = () => {
  const { user, role, token } = useAuth(); // Need token for requests
  const navigate = useNavigate();
  const greeting = getGreeting();

  const [staffList, setStaffList] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Admin Request State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [requestStatus, setRequestStatus] = useState("None"); // None, Pending, Approved
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentUser, setCurrentUser] = useState(user); // Fresh user data
  const { success, error } = useToast();

  // 0. Fetch Fresh User Data (for Permission Status)
  const refreshUser = async () => {
    if (!user) return;
    // Refresh if Doctor OR if user has Temp Admin flag (even if promoted to Admin role)
    // if (role !== "Doctor" && !user.isTempAdmin) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCurrentUser(data);
      
      // Check for active admin permission
      if (data.isTempAdmin && data.tempAdminExpiresAt) {
        const expiry = new Date(data.tempAdminExpiresAt).getTime();
        const now = Date.now();
        if (expiry > now) {
          setRequestStatus("Approved");
          setTimeLeft(expiry - now);
        } else {
          setRequestStatus("Expired");
          // Optionally reload page to revert role if AuthContext doesn't catch it immediately
        }
      } else {
        // ... pending logic ...
        const reqRes = await fetch(`http://localhost:5000/api/admin-requests`, {
           headers: { Authorization: `Bearer ${token}` },
        });
        const reqData = await reqRes.json();
        const pending = reqData.find(r => r.status === "Pending");
        if (pending) setRequestStatus("Pending");
        else setRequestStatus("None");
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  useEffect(() => {
    refreshUser();
    // Poll every minute to update countdown/status?
    const interval = setInterval(refreshUser, 60000);
    return () => clearInterval(interval);
  }, [user, token]);

  // Countdown Helper
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          refreshUser(); // Refresh when time is up
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format Time Left
  const formatTimeKey = (ms) => {
    if (!ms) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 1. Fetch Staff (Only for Doctors/Nurses)
  useEffect(() => {
    if (role === "Doctor" || role === "Nurse") {
      const endpoint = role === "Doctor" ? "doctors" : "nurses";
      fetch(`http://localhost:5000/api/users/${endpoint}`)
        .then((res) => res.json())
        .then((data) => setStaffList(data.slice(0, 4)))
        .catch((err) => console.error(err));
    }
  }, [role]);

  // 1.5 Fetch Admins (Only for Doctor Request)
  useEffect(() => {
    if (role === "Doctor") {
       fetch(`http://localhost:5000/api/users?role=Admin`) // Assuming endpoint supports filtering
        .then((res) => res.json())
        .then((data) => setAdmins(data))
        .catch((err) => console.error(err));
    }
  }, [role]);

  // 2. Fetch Live Activity (Only for Admin, Limit 3)
  useEffect(() => {
    if (role === "Admin" || (currentUser && currentUser.isTempAdmin)) { // Temp Admin gets to see logs too?
      fetch("http://localhost:5000/api/audit-logs?limit=3", {
         headers: { Authorization: `Bearer ${token}` }, // Add auth for logs
      })
        .then((res) => res.json())
        .then((data) => setActivities(data))
        .catch((err) => console.error("Failed to load activity feed:", err));
    }
  }, [role, currentUser, token]);

  // Handle Request Submit
  const handleRequestSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsRequestModalOpen(false);
        success("Request sent successfully!");
        refreshUser();
      } else {
        const err = await res.json();
        error(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      error("Failed to send request.");
    }
  };

  // Helper to choose icon/color for log actions
  const getLogStyle = (action) => {
    if (
      action.includes("FAIL") ||
      action.includes("BLOCK") ||
      action.includes("DELETE")
    ) {
      return {
        color: "bg-red-500",
        icon: <AlertTriangle size={14} className="text-white" />,
      };
    }
    if (
      action.includes("ADD") ||
      action.includes("CREATE") ||
      action.includes("REGISTER")
    ) {
      return {
        color: "bg-green-500",
        icon: <UserPlus size={14} className="text-white" />,
      };
    }
    if (action.includes("LOGIN") || action.includes("UNLOCK")) {
      return {
        color: "bg-blue-500",
        icon: <Shield size={14} className="text-white" />,
      };
    }
    return {
      color: "bg-slate-400",
      icon: <Activity size={14} className="text-white" />,
    };
  };

  if (!user)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading Secure Context...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <div className="relative p-8 overflow-hidden text-white shadow-xl bg-gradient-to-r from-primary-600 to-teal-600 dark:from-primary-800 dark:to-teal-800 rounded-3xl shadow-primary-900/20">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              {greeting}, {user.name.split(" ")[0]}
            </h1>
            <p className="max-w-xl text-lg text-primary-100 opacity-90">
              {role === "Admin"
                ? (user.isTempAdmin && timeLeft > 0
                    ? `TEMPORARY ADMIN ACTIVE. Time Remaining: ${formatTimeKey(timeLeft)}` 
                    : "System status is stable. Review the latest security events below.")
                : requestStatus === "Approved" 
                  ? `You have TEMPORARY ADMIN ACCESS. Time remaining: ${formatTimeKey(timeLeft)}` 
                  : "Welcome to your secure dashboard. Identify requested permissions below."}
            </p>
          </div>
          <div className="flex gap-3">
            {role === "Doctor" ? (
              requestStatus === "Approved" ? (
                 <div className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 border border-red-200/50 rounded-xl">
                   <Shield className="animate-pulse text-red-100" />
                   <span className="font-bold text-red-50">Admin Mode Active</span>
                 </div>
              ) : requestStatus === "Pending" ? (
                 <button disabled className="px-5 py-2.5 bg-yellow-500/50 text-white rounded-xl font-bold cursor-not-allowed border border-white/10">
                   Request Pending...
                 </button>
              ) : (
                <button 
                  onClick={() => setIsRequestModalOpen(true)}
                  className="px-5 py-2.5 bg-white text-primary-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Lock size={18} /> Request Admin Permission
                </button>
              )
            ) : role === "Nurse" ? (
               // Keep existing buttons for Nurse
               <>
                 <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-medium transition-all border border-white/10">
                   View Schedule
                 </button>
                 <button className="px-5 py-2.5 bg-white text-primary-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                   Start Rounds
                 </button>
               </>
            ) : (
               // Admin Buttons (View Schedule?)
               <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-medium transition-all border border-white/10">
                  View Schedule
               </button>
            )}
            
            {/* Modal */}
            {isRequestModalOpen && (
               <AdminRequestModal 
                 isOpen={isRequestModalOpen} 
                 onClose={() => setIsRequestModalOpen(false)}
                 admins={admins}
                 onSubmit={handleRequestSubmit}
               />
            )}
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 -mt-10 -mr-10 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 -mb-10 -ml-10 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Profile & Stats */}
        <div className="space-y-8 lg:col-span-1">
          {/* Profile Card */}
          <WidgetCard className="relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-full h-24 bg-blue-50/50 dark:bg-slate-700/50"></div>
            <div className="relative z-10 inline-block">
              <div className="p-1 mx-auto bg-white rounded-full shadow-md w-28 h-28 dark:bg-slate-900 ring-1 ring-primary-200 dark:ring-slate-700">
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
              <span className="inline-block px-3 py-1 mt-2 text-xs font-bold tracking-wide text-primary-700 uppercase bg-primary-100 border border-primary-200 rounded-full dark:bg-primary-900/50 dark:text-primary-300 dark:border-primary-800">
                {user.role}
              </span>
              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                {user.specialty || user.ward || "System Administrator"}
              </p>
            </div>
            {/* Show Patient Stats for Non-Admins */}
            {role !== "Admin" && (
              <div className="grid grid-cols-2 pt-6 mt-6 border-t divide-x divide-slate-100 dark:divide-slate-700 border-slate-100 dark:border-slate-700">
                <div>
                  <span className="block text-2xl font-bold text-slate-800 dark:text-white">
                    12
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Patients
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-800 dark:text-white">
                    8h
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    On Shift
                  </span>
                </div>
              </div>
            )}
          </WidgetCard>

          {/* Quick Stats (ADMIN ONLY) */}
          {role === "Admin" && (
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
                    <div className="p-2 text-primary-600 bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg">
                      <Activity size={18} />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      System Load
                    </span>
                  </div>
                  <span className="font-bold text-primary-600 dark:text-primary-400">Normal</span>
                </div>
              </div>
            </WidgetCard>
          )}
        </div>

        {/* Right Column: Activity & Staff */}
        <div className="space-y-8 lg:col-span-2">
          {/* Live Activity Feed (ADMIN ONLY) */}
          {role === "Admin" && (
            <WidgetCard>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <Clock size={20} className="text-primary-500" /> Live Activity
                  Feed
                </h3>
                <button
                  onClick={() => navigate("/admin/logs")}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="px-2 space-y-6">
                {activities.length > 0 ? (
                  activities.map((log, i) => {
                    const style = getLogStyle(log.action);
                    return (
                      <div
                        key={log._id || i}
                        className="relative flex gap-4 group"
                      >
                        <div className="flex flex-col items-center h-full">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 ring-4 ring-white dark:ring-slate-800 ${style.color}`}
                          >
                            {style.icon}
                          </div>
                          {i !== activities.length - 1 && (
                            <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700/80 absolute top-8 bottom-0 left-4 -ml-px h-full z-0"></div>
                          )}
                        </div>
                        <div className="pt-1 pb-4">
                          <p className="mb-1 text-xs font-bold text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <h4 className="text-base font-bold text-slate-800 dark:text-white">
                            {log.action.replace(/_/g, " ")}
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {log.userName}:{" "}
                            </span>
                            {log.details}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-500">
                    <Clock size={32} className="mx-auto mb-2 text-slate-300" />
                    <p>No recent activity recorded.</p>
                  </div>
                )}
              </div>
            </WidgetCard>
          )}

          {/* Active Staff List (NON-ADMIN ONLY) */}
          {role !== "Admin" && (
            <WidgetCard>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <Users size={20} className="text-primary-500" />
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
                      className="flex items-center gap-3 p-3 transition-all border cursor-pointer rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 group"
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
                        <p className="text-sm font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {staff.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {staff.specialty || staff.ward || "General"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center col-span-2 py-8 text-center border-2 border-dashed text-slate-500 border-slate-200 dark:border-slate-700 rounded-xl">
                    <Users size={32} className="mb-2 text-slate-300" />
                    <p>No active staff found currently.</p>
                  </div>
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
