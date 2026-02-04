"use client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/Landing";

// Dashboards
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import NurseDashboard from "./pages/dashboards/NurseDashboard";
import DashboardHome from "./pages/dashboards/DashboardHome";

// Shared Pages
import PatientRecords from "./pages/shared/PatientRecords";
import DoctorList from "./pages/shared/DoctorList";
import NurseList from "./pages/shared/NurseList";

// Admin Pages
import UserManagement from "./pages/admin/UserManagement";

// New Approval Pages
import PendingApprovals from "./pages/nurse/PendingApprovals";
import ReviewApprovals from "./pages/doctor/ReviewApprovals";

// Placeholder
const Placeholder = ({ title }) => (
  <div className="p-6 bg-white rounded shadow dark:bg-zinc-800">
    <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
    <p className="text-gray-500">Page content goes here.</p>
  </div>
);

const ProtectedRoute = ({ children, allowedRole }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* --- ADMIN ROUTES --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="users" element={<UserManagement />} />
            <Route
              path="policies"
              element={<Placeholder title="Security Policies" />}
            />
            <Route path="logs" element={<Placeholder title="Audit Logs" />} />
            <Route
              path="settings"
              element={<Placeholder title="System Settings" />}
            />
          </Route>

          {/* --- DOCTOR ROUTES --- */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRole="Doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="reviews" element={<ReviewApprovals />} />{" "}
            {/* New Route */}
            <Route path="nurses" element={<NurseList />} />
            <Route path="doctors" element={<DoctorList />} />
          </Route>

          {/* --- NURSE ROUTES --- */}
          <Route
            path="/nurse"
            element={
              <ProtectedRoute allowedRole="Nurse">
                <NurseDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="approvals" element={<PendingApprovals />} />{" "}
            {/* New Route */}
            <Route path="nurses" element={<NurseList />} />
            <Route path="doctors" element={<DoctorList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
