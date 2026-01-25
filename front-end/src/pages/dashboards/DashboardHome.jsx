import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

// --- Utility: Get Greeting ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// --- Component: Profile Card (Dynamic) ---
const ProfileCard = ({ user }) => (
  <div className="flex flex-col items-center h-full p-6 text-center bg-white rounded-lg shadow dark:bg-zinc-800">
    <div className="w-32 h-32 mb-4 overflow-hidden rounded-full ring-4 ring-blue-100 dark:ring-blue-900">
      <img
        src={
          user.imageUrl ||
          `https://ui-avatars.com/api/?name=${user.name}&background=random`
        }
        alt={user.name}
        className="object-cover w-full h-full"
      />
    </div>
    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
      {user.name}
    </h2>
    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
      {user.role}
    </p>

    {/* Show Specialty for Doctors, Ward for Nurses */}
    {user.specialty && (
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Specialty: {user.specialty}
      </p>
    )}
    {user.ward && (
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Ward: {user.ward}
      </p>
    )}

    <p className="mt-2 text-zinc-500 dark:text-zinc-400">{user.email}</p>

    <div className="w-full pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-700">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <span className="block text-2xl font-bold text-zinc-900 dark:text-white">
            Active
          </span>
          <span className="text-xs text-zinc-500">Status</span>
        </div>
        <div className="text-center">
          <span className="block text-2xl font-bold text-zinc-900 dark:text-white">
            {new Date(user.createdAt).getFullYear()}
          </span>
          <span className="text-xs text-zinc-500">Member Since</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Component: Recent Activity (Static for now) ---
const RecentActivity = () => (
  <div className="h-full p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
    <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">
      Recent Activity
    </h3>
    <div className="space-y-4">
      {[
        { time: "09:30 AM", text: "System Login", type: "check" },
        { time: "10:15 AM", text: "Checked Patient List", type: "update" },
        { time: "11:00 AM", text: "Updated Profile", type: "meeting" },
      ].map((item, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex-shrink-0 w-16 pt-1 text-xs font-medium text-right text-zinc-500">
            {item.time}
          </div>
          <div className="relative pb-4 pl-4 border-l-2 border-zinc-100 dark:border-zinc-700">
            <div
              className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${
                item.type === "alert" ? "bg-red-500" : "bg-blue-500"
              }`}
            ></div>
            <p className="text-sm text-zinc-800 dark:text-zinc-200">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Component: Staff List Card (Fetches Real Data) ---
const StaffStatusCard = ({ role }) => {
  const [staffList, setStaffList] = useState([]);

  // Decide which API to call based on the user's role
  // If I am a Doctor, I want to see other Doctors. If Nurse, other Nurses.
  const endpoint = role === "Doctor" ? "doctors" : "nurses";
  const title = role === "Doctor" ? "Doctors on Call" : "Nurses on Duty";

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${endpoint}`)
      .then((res) => res.json())
      .then((data) => setStaffList(data.slice(0, 5))) // Show only first 5
      .catch((err) => console.error(err));
  }, [endpoint]);

  return (
    <div className="h-full p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
      <h3 className="flex items-center gap-2 mb-3 text-lg font-bold text-zinc-900 dark:text-white">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        {title}
      </h3>
      <ul className="space-y-2">
        {staffList.map((person, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
          >
            <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <img
                src={
                  person.imageUrl ||
                  `https://ui-avatars.com/api/?name=${person.name}&background=random`
                }
                alt={person.name}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {person.name}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase">
                {person.specialty || person.ward || role}
              </span>
            </div>
          </li>
        ))}
        {staffList.length === 0 && (
          <p className="text-sm text-zinc-500">No active staff found.</p>
        )}
      </ul>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const DashboardHome = () => {
  const { user, role } = useAuth(); // GET REAL USER FROM DATABASE
  const greeting = getGreeting();

  if (!user) return <div>Loading...</div>;

  // --- Admin View ---
  if (role === "Admin") {
    return <AdminWidgets />;
  }

  // --- Doctor & Nurse View (Dynamic) ---
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: Greeting + Profile (Full Height) */}
        <div className="flex flex-col h-full gap-4 lg:col-span-1">
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {greeting},
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400">
              Welcome Back
            </p>
          </div>
          <div className="flex-1">
            {/* Pass Real User Data Here */}
            <ProfileCard user={user} />
          </div>
        </div>

        {/* RIGHT COLUMN: Activity + Lists */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex-1">
            <RecentActivity />
          </div>
          <div className="flex-1">
            <StaffStatusCard role={role} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Widgets (Kept same as before) ---
const AdminWidgets = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Security Overview
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border-l-4 border-green-500 rounded-lg shadow dark:bg-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Security Score
          </h3>
          <p className="mt-2 text-4xl font-bold text-green-600">98/100</p>
        </div>
        <div className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow dark:bg-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Active Users
          </h3>
          <p className="mt-2 text-4xl font-bold text-blue-600">12</p>
        </div>
        <div className="p-6 bg-white border-l-4 border-yellow-500 rounded-lg shadow dark:bg-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Failed Logins
          </h3>
          <p className="mt-2 text-4xl font-bold text-yellow-600">0</p>
        </div>
        <div className="p-6 bg-white border-l-4 border-purple-500 rounded-lg shadow dark:bg-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            System Status
          </h3>
          <p className="mt-2 text-lg font-bold text-purple-600">Operational</p>
        </div>
      </div>
    </div>
  );
};

// export default DashboardLayout; // Keep this export if you use it, or export DashboardHome
export { DashboardHome as default }; // Export DashboardHome as default for the router
