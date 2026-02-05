const AuditLog = require("../models/AuditLog");

const logAction = async (user, action, details, req) => {
  try {
    // Attempt to get IP address
    const ip = req
      ? req.headers["x-forwarded-for"] || req.socket.remoteAddress
      : "Unknown";

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action,
      details,
      ipAddress: ip,
    });
  } catch (err) {
    console.error("❌ Audit Logging Failed:", err);
  }
};

module.exports = { logAction };
