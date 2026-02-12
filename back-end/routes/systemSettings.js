const express = require("express");
const router = express.Router();
const SystemSettings = require("../models/SystemSettings");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

// Get settings (Create default if none exists)
router.get("/", async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings
router.put("/", async (req, res) => {
  try {
    const { actionBy, ...updates } = req.body;
    let settings = await SystemSettings.findOne();
    
    if (!settings) settings = new SystemSettings();

    // Apply updates
    Object.assign(settings, updates);
    settings.updatedBy = actionBy; // Optional: track who updated
    await settings.save();

    // Log to Audit Trail
    if (actionBy) {
        const actor = await User.findById(actionBy);
        // Create a distinct audit log entry for this config change
        const log = new AuditLog({
            userId: actionBy,
            userName: actor ? actor.name : "Unknown",
            userRole: actor ? actor.role : "Admin",
            action: "SYSTEM_CONFIG_UPDATE",
            details: `Secure Config Update: PwdLen=${settings.minPasswordLength}, Timeout=${settings.sessionTimeout}m`,
            ipAddress: req.ip
        });
        await log.save();
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
