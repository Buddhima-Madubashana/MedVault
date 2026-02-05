const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");

// Get All Logs (with optional limit)
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 }) // Newest first
      .limit(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
