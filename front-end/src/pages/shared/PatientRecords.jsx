import DashboardLayout from "../../components/DashboardLayout";

const sidebarItems = [
  { name: "Dashboard", path: "." }, // relative to current dashboard
  { name: "Patient Records", path: "patients" },
  { name: "Appointments", path: "appointments" },
  { name: "Reports", path: "reports" },
];

const PatientRecords = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <h1 className="text-3xl font-bold">Patient Records</h1>
      <p>Custom content for Patient Records page.</p>
    </DashboardLayout>
  );
};

export default PatientRecords;
