import DashboardLayout from "../../components/DashboardLayout";

const sidebarItems = [
  { name: "Dashboard", path: "../" }, // go back to dashboard
  { name: "Patient Records", path: "../patients" },
  { name: "Appointments", path: "." },
  { name: "Reports", path: "../reports" },
];

const Appointments = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <h1 className="text-3xl font-bold">Appointments</h1>
      <p>Custom content for Appointments page.</p>
    </DashboardLayout>
  );
};

export default Appointments;
