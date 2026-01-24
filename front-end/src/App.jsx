"use client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/Landing";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import NurseDashboard from "./pages/dashboards/NurseDashboard";
import PatientRecords from "./pages/shared/PatientRecords";
import Appointments from "./pages/shared/Appointments";
// import Reports from "./pages/shared/Reports"; // create similar for each role if needed
import { AuthProvider, useAuth } from "./Contexts/AuthContext";

// Protected Route Component
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

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="patients" element={<PatientRecords />} />
            <Route path="appointments" element={<Appointments />} />
            {/* <Route path="reports" element={<Reports />} /> */}
          </Route>

          {/* Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRole="Doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="patients" element={<PatientRecords />} />
            <Route path="appointments" element={<Appointments />} />
            {/* <Route path="reports" element={<Reports />} /> */}
          </Route>

          {/* Nurse Routes */}
          <Route
            path="/nurse/*"
            element={
              <ProtectedRoute allowedRole="Nurse">
                <NurseDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="patients" element={<PatientRecords />} />
            <Route path="appointments" element={<Appointments />} />
            {/* <Route path="reports" element={<Reports />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
