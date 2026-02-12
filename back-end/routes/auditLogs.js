const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");

// Get All Logs (with optional limit)
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Manual Log (for System Settings etc)
router.post("/", async (req, res) => {
  try {
    const { userId, userName, userRole, action, details, ipAddress } = req.body;
    const newLog = new AuditLog({
      userId,
      userName,
      userRole,
      action,
      details,
      ipAddress: ipAddress || req.ip,
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
