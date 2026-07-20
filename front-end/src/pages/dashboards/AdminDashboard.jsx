"use client";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const adminSidebarItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "User Management", path: "/admin/users" },
  { name: "Locked Accounts", path: "/admin/locked" },
  { name: "All Users", path: "/admin/all-users" },
  { name: "Audit Logs", path: "/admin/logs" },
  { name: "Admin Requests", path: "/admin/requests" },
  { name: "Leave Requests", path: "/admin/leaves" },
  { name: "Announcements", path: "/admin/announcements" },
  { name: "System Settings", path: "/admin/settings" },
  { name: "Permission Matrix", path: "/admin/permissions" },
];

// Doctor-specific items surfaced for temp admins
const doctorSidebarItems = [
  { name: "Patient Records", path: "/admin/patients", section: "Doctor Access" },
  { name: "Review Approvals", path: "/admin/reviews", section: "Doctor Access" },
  { name: "Nurse List", path: "/admin/nurses", section: "Doctor Access" },
  { name: "Doctor List", path: "/admin/doctors", section: "Doctor Access" },
  { name: "Leave Management", path: "/admin/doctor-leaves", section: "Doctor Access" },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const isTempAdmin = !!(user?.isTempAdmin && user?.tempAdminExpiresAt && new Date(user.tempAdminExpiresAt) > new Date());

  // Build sidebar: admin items (minus restricted items for temp admins) + doctor items if temp admin
  const filteredAdminItems = adminSidebarItems.filter(item => {
    if (isTempAdmin && (item.name === "Admin Requests" || item.name === "System Settings" || item.name === "User Management")) {
      return false;
    }
    return true;
  });

  const mergedSidebarItems = isTempAdmin
    ? [...filteredAdminItems, { name: "--- Doctor Access ---", path: null, divider: true }, ...doctorSidebarItems]
    : filteredAdminItems;

  return (
    <DashboardLayout sidebarItems={mergedSidebarItems} isTempAdmin={isTempAdmin}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
