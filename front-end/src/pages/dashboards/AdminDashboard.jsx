"use client";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "User Management", path: "/admin/users" },
  { name: "Locked Accounts", path: "/admin/locked" },
  { name: "All Users", path: "/admin/all-users" },
  { name: "Patient Records", path: "/admin/patients" },
  { name: "Audit Logs", path: "/admin/logs" },
  { name: "System Settings", path: "/admin/settings" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
