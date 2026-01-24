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

// --- Simple Placeholders for new pages ---
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
            <Route
              path="users"
              element={<Placeholder title="User Management" />}
            />
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
            <Route path="nurses" element={<Placeholder title="Nurse List" />} />
            <Route
              path="doctors"
              element={<Placeholder title="Doctor List" />}
            />
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
            <Route path="nurses" element={<Placeholder title="Nurse List" />} />
            <Route
              path="doctors"
              element={<Placeholder title="Doctor List" />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
