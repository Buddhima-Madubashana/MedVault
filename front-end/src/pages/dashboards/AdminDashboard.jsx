"use client";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "User Management", path: "/admin/users" },
  { name: "Locked Accounts", path: "/admin/locked" },
  { name: "All Users", path: "/admin/all-users" },
  { name: "Audit Logs", path: "/admin/logs" },
  { name: "Admin Requests", path: "/admin/requests" },
  { name: "System Settings", path: "/admin/settings" },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (item.name === "Admin Requests" && user?.isTempAdmin) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout sidebarItems={filteredSidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
