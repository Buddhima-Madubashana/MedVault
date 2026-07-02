require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const patientRoutes = require("./routes/patients");
const patientRequestRoutes = require("./routes/patientRequests");
const auditLogRoutes = require("./routes/auditLogs");
const systemSettingsRoutes = require("./routes/systemSettings");
const adminRequestsRoutes = require("./routes/adminRequests");
const notificationRoutes = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medvault")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patient-requests", patientRequestRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/settings", systemSettingsRoutes);
app.use("/api/admin-requests", adminRequestsRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
