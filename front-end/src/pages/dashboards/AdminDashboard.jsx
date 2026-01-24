"use client";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "📊 Dashboard", path: "/admin" },
  { name: "👥 User Management", path: "/admin/users" },
  { name: "🛡️ Security Policies", path: "/admin/policies" },
  { name: "📋 Audit Logs", path: "/admin/logs" },
  { name: "⚙️ System Settings", path: "/admin/settings" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
