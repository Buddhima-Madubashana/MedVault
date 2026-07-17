import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import AdminRequestModal from "../../components/AdminRequestModal"; // Import Modal
import { isUserInShift } from "../../utils/shiftHelper";
import {
  Clock,
  Activity,
  Users,
  Shield,
  CheckCircle,
  UserPlus,
  AlertTriangle,
  Lock,
  ClipboardList,
  PlusCircle,
  CheckSquare,
  Check,
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

  const [activities, setActivities] = useState([]);
  
  // Admin Request State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [requestStatus, setRequestStatus] = useState("None"); // None, Pending, Approved
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentUser, setCurrentUser] = useState(user); // Fresh user data
  const [patientCount, setPatientCount] = useState(0);
  const { success, error } = useToast();

  const [patients, setPatients] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allNurses, setAllNurses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

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

  const fetchPatientCount = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPatientCount(data.length);
          setPatients(data);
        }
      }
    } catch (err) {
      console.error("Failed to load patient count:", err);
    }
  };

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedNurse || !taskDesc.trim()) {
      error("Nurse and description are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignedTo: selectedNurse,
          patientId: selectedPatient || undefined,
          description: taskDesc,
        }),
      });
      if (res.ok) {
        success("Task assigned successfully!");
        setTaskDesc("");
        setSelectedPatient("");
        setSelectedNurse("");
        fetchTasks();
      } else {
        const data = await res.json();
        error(data.error || "Failed to assign task.");
      }
    } catch (err) {
      console.error(err);
      error("Server error. Please try again.");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success("Task marked as completed!");
        fetchTasks();
      } else {
        const data = await res.json();
        error(data.error || "Failed to complete task.");
      }
    } catch (err) {
      console.error(err);
      error("Server error. Please try again.");
    }
  };

  useEffect(() => {
    refreshUser();
    fetchPatientCount();
    if (role === "Doctor" || role === "Nurse") {
      fetchTasks();
    }
    // Poll every 5 seconds to immediately catch admin changes
    const interval = setInterval(() => {
      refreshUser();
      fetchPatientCount();
      if (role === "Doctor" || role === "Nurse") {
        fetchTasks();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user, token, role]);

  useEffect(() => {
    if (token && role === "Doctor") {
      fetch("http://localhost:5000/api/users/nurses", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setAllNurses(data))
        .catch((err) => console.error("Failed to load nurses:", err));
    }
  }, [token, role]);

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

  // 1. Fetch Staff (Doctors + Nurses for non-admin roles)
  const [doctorList, setDoctorList] = useState([]);
  const [nurseList, setNurseList] = useState([]);

  // Relative time helper
  const timeAgo = (dateStr) => {
    if (!dateStr) return "Unknown";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (role === "Doctor" || role === "Nurse") {
      fetch(`http://localhost:5000/api/users/doctors`)
        .then((res) => res.json())
        .then((data) => {
          setDoctorList(data.slice(0, 4));
          setAllDoctors(data);
        })
        .catch((err) => console.error(err));
      fetch(`http://localhost:5000/api/users/nurses`)
        .then((res) => res.json())
        .then((data) => setNurseList(data.slice(0, 4)))
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

  // Helper stats methods
  const getWardStats = () => {
    const stats = {};
    patients.forEach((p) => {
      const w = p.ward || "Unassigned";
      stats[w] = (stats[w] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  };

  const getDiseaseStats = () => {
    const stats = {};
    patients.forEach((p) => {
      const d = p.disease || "Unknown";
      stats[d] = (stats[d] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  };

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
             {role === "Doctor" && (
               requestStatus === "Approved" ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 border border-red-200/50 rounded-xl">
                    <Shield className="animate-pulse text-red-100" />
                    <span className="font-bold text-red-50">Admin Mode Active</span>
                  </div>
               ) : requestStatus === "Pending" ? (
                  <button disabled className="px-5 py-2.5 bg-yellow-500/50 text-white rounded-xl font-bold cursor-not-allowed border border-white/10">
                    Request Pending...
                  </button>
               ) : !isUserInShift(user) ? (
                 <button 
                   disabled
                   className="px-5 py-2.5 bg-slate-500/40 text-slate-300 rounded-xl font-bold cursor-not-allowed border border-white/5 opacity-80"
                   title="Access Blocked: Requesting admin permissions is only allowed during active shift hours."
                 >
                   <Lock size={18} className="text-slate-400" /> Request Admin Permission (Out of Shift)
                 </button>
               ) : (
                 <button 
                   onClick={() => setIsRequestModalOpen(true)}
                   className="px-5 py-2.5 bg-white text-primary-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                 >
                   <Lock size={18} /> Request Admin Permission
                 </button>
               )
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
                {user.specialty || user.ward || null}
              </p>
            </div>
            {/* Show Patient Stats for Non-Admins */}
            {role !== "Admin" && (
              <div className="grid grid-cols-2 pt-6 mt-6 border-t divide-x divide-slate-100 dark:divide-slate-700 border-slate-100 dark:border-slate-700">
                <div>
                  <span className="block text-xl font-bold text-slate-800 dark:text-white truncate">
                    {patientCount}
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Patients
                  </span>
                </div>
                <div>
                  <span className="block text-[13px] leading-[28px] font-bold text-slate-800 dark:text-white truncate" title={currentUser?.shiftStart && currentUser?.shiftEnd ? `${currentUser.shiftStart} - ${currentUser.shiftEnd}` : "Always Active"}>
                    {currentUser?.shiftStart && currentUser?.shiftEnd 
                      ? `${currentUser.shiftStart}-${currentUser.shiftEnd}` 
                      : "Always"}
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

          {/* Ward & Patient Statistics (All Roles) */}
          <WidgetCard>
            <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
              <Activity size={16} className="text-primary-500" /> Ward & Patient Statistics
            </h3>
            {patientCount === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs">No active patient records.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Patients by Ward</h4>
                  <div className="space-y-2">
                    {getWardStats().map(({ name, count }) => {
                      const percentage = patientCount > 0 ? (count / patientCount) * 100 : 0;
                      return (
                        <div key={name} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <span>{name}</span>
                            <span>{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Conditions Breakdown</h4>
                  <div className="space-y-2">
                    {getDiseaseStats().map(({ name, count }) => {
                      const percentage = patientCount > 0 ? (count / patientCount) * 100 : 0;
                      return (
                        <div key={name} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <span>{name}</span>
                            <span>{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </WidgetCard>

          {/* Shift Calendar & Rotations (Non-Admins Only) */}
          {role !== "Admin" && (
            <WidgetCard>
              <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
                <Clock size={16} className="text-primary-500" /> Shift Schedule
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Today's Shift Status</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {isUserInShift(currentUser) ? "On Duty (Active Access)" : "Off Duty (Outside Shift)"}
                    </p>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full ${isUserInShift(currentUser) ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 bg-slate-50 dark:bg-slate-950/30 p-2 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
                    const isToday = new Date().getDay() === (i === 6 ? 0 : i + 1);
                    const isWeekend = i >= 5;
                    return (
                      <div
                        key={i}
                        className={`text-center py-2 rounded-xl text-xs font-bold ${
                          isToday
                            ? "bg-primary-600 text-white shadow-md"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <div>{d}</div>
                        <div className="text-[9px] opacity-75 mt-0.5">
                          {currentUser?.shiftStart && !isWeekend ? "Shift" : "Off"}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-[11px] text-slate-400 dark:text-slate-500 space-y-1 font-medium font-medium">
                  <p>• Shift Hours: Mon - Fri ({currentUser?.shiftStart || "N/A"} to {currentUser?.shiftEnd || "N/A"})</p>
                  <p>• Access restrictions automatically apply outside shift windows.</p>
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

          {/* Active Staff Lists (NON-ADMIN ONLY) */}
          {role !== "Admin" && (
            <>
              {/* Doctor Task Assignment & Tracker */}
              {role === "Doctor" && (
                <>
                  <WidgetCard>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                        <ClipboardList size={20} className="text-primary-500" /> Assign Task to Nurse
                      </h3>
                    </div>
                    <form onSubmit={handleAssignTask} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Nurse</label>
                        <select
                          value={selectedNurse}
                          onChange={(e) => setSelectedNurse(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                          required
                        >
                          <option value="">-- Choose Nurse --</option>
                          {allNurses.map((n) => (
                            <option key={n._id} value={n._id}>
                              Nurse {n.name} ({n.ward || "General"})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Patient (Optional)</label>
                        <select
                          value={selectedPatient}
                          onChange={(e) => setSelectedPatient(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                        >
                          <option value="">No Patient (General Task)</option>
                          {patients.map((p) => (
                            <option key={p._id} value={p._id}>
                              Patient: {p.name} (Ward: {p.ward})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Task Description</label>
                        <input
                          type="text"
                          value={taskDesc}
                          onChange={(e) => setTaskDesc(e.target.value)}
                          placeholder="e.g. Check vitals / check how much medicine is left"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                      >
                        <PlusCircle size={16} /> Assign Task
                      </button>
                    </form>
                  </WidgetCard>

                  <WidgetCard>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                        <Activity size={20} className="text-emerald-500" /> Assigned Tasks Status Tracker
                      </h3>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <div
                            key={task._id}
                            className="p-3.5 border rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 flex justify-between items-start gap-3"
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                                {task.description}
                              </p>
                              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
                                <span>Nurse: {task.assignedTo?.name || "Unknown"}</span>
                                {task.patientId && (
                                  <>
                                    <span>•</span>
                                    <span className="text-primary-600 dark:text-primary-400">Patient: {task.patientId.name}</span>
                                  </>
                                )}
                              </div>
                              {task.completedAt && (
                                <p className="text-[10px] text-slate-400">
                                  Completed: {new Date(task.completedAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                task.status === "Completed"
                                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                                  : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-xs py-2">No tasks assigned yet.</p>
                      )}
                    </div>
                  </WidgetCard>
                </>
              )}

              {/* Nurse Task Checklist */}
              {role === "Nurse" && (
                <WidgetCard>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                      <CheckSquare size={20} className="text-primary-500" /> My Assigned Tasks
                    </h3>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div
                          key={task._id}
                          className="p-3.5 border rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 flex items-start gap-3 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800"
                        >
                          {task.status === "Pending" ? (
                            <button
                              onClick={() => handleCompleteTask(task._id)}
                              className="mt-0.5 w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center transition-all shrink-0 cursor-pointer text-transparent hover:text-emerald-600 dark:hover:text-emerald-400"
                              title="Mark as completed"
                            >
                              <Check size={14} className="stroke-[3]" />
                            </button>
                          ) : (
                            <div className="mt-0.5 w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Check size={14} className="stroke-[3]" />
                            </div>
                          )}
                          <div className="space-y-1 min-w-0 flex-1">
                            <p
                              className={`text-sm font-bold leading-tight ${
                                task.status === "Completed"
                                  ? "text-slate-400 dark:text-slate-500 line-through font-normal"
                                  : "text-slate-800 dark:text-white"
                              }`}
                            >
                              {task.description}
                            </p>
                            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
                              <span>By: Dr. {task.assignedBy?.name || "Unknown"}</span>
                              {task.patientId && (
                                <>
                                  <span>•</span>
                                  <span className="text-primary-600 dark:text-primary-400">Patient: {task.patientId.name}</span>
                                </>
                              )}
                            </div>
                            {task.completedAt && (
                              <p className="text-[10px] text-slate-400">
                                Completed: {new Date(task.completedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-xs py-2">No tasks assigned to you.</p>
                    )}
                  </div>
                </WidgetCard>
              )}

              {/* Doctors On Call */}
              <WidgetCard>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <Users size={20} className="text-primary-500" />
                    Doctors On Call
                  </h3>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {doctorList.length > 0 ? (
                    doctorList.map((staff, idx) => (
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                            {staff.name}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {staff.specialty || "General"}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {timeAgo(staff.lastLoginAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center col-span-2 py-8 text-center border-2 border-dashed text-slate-500 border-slate-200 dark:border-slate-700 rounded-xl">
                      <Users size={32} className="mb-2 text-slate-300" />
                      <p>No doctors found.</p>
                    </div>
                  )}
                </div>
              </WidgetCard>

              {/* Nurses On Duty */}
              <WidgetCard>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <Activity size={20} className="text-pink-500" />
                    Nurses On Duty
                  </h3>
                  <span className="px-2.5 py-1 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>{" "}
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {nurseList.length > 0 ? (
                    nurseList.map((staff, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 transition-all border cursor-pointer rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 border-slate-100 dark:border-slate-700 hover:border-pink-200 dark:hover:border-pink-800 group"
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
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-pink-500 border-2 border-white rounded-full dark:border-slate-800"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold transition-colors text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 truncate">
                            {staff.name}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {staff.ward || "General"}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {timeAgo(staff.lastLoginAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center col-span-2 py-8 text-center border-2 border-dashed text-slate-500 border-slate-200 dark:border-slate-700 rounded-xl">
                      <Activity size={32} className="mb-2 text-slate-300" />
                      <p>No nurses found.</p>
                    </div>
                  )}
                </div>
              </WidgetCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
