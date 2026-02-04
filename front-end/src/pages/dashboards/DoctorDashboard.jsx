"use client";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", path: "/doctor" },
  { name: "Patient Records", path: "/doctor/patients" },
  { name: "Review Approvals", path: "/doctor/reviews" }, // New Link
  { name: "Nurse List", path: "/doctor/nurses" },
  { name: "Doctor List", path: "/doctor/doctors" },
];

const DoctorDashboard = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default DoctorDashboard;
