"use client";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Patient Records", path: "/admin/patients" },
  { name: "Appointments", path: "/admin/appointments" },
  { name: "Reports", path: "/admin/reports" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <Outlet /> {/* Allows nested pages to render in children area */}
    </DashboardLayout>
  );
};

export default AdminDashboard;
