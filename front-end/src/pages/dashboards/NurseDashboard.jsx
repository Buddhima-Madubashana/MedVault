"use client";
import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", path: "/nurse" },
  { name: "Patient Records", path: "/nurse/patients" },
  { name: "Nurse List", path: "/nurse/nurses" },
  { name: "Doctor List", path: "/nurse/doctors" },
];

const NurseDashboard = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default NurseDashboard;
