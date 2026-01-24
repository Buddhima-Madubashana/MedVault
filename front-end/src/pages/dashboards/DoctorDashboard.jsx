"use client";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", path: "/doctor" },
  { name: "Patient Records", path: "/doctor/patients" },
  { name: "Appointments", path: "/doctor/appointments" },
  { name: "Reports", path: "/doctor/reports" },
];

const DoctorDashboard = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default DoctorDashboard;
