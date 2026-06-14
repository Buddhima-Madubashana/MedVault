const express = require("express");
const router = express.Router();
const SystemSettings = require("../models/SystemSettings");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

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

// Update settings (Admin only)
router.put("/", authMiddleware, async (req, res) => {
  try {
    // Only Admins can update settings
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden: Admin only." });
    }

    const { actionBy, ...updates } = req.body;
    let settings = await SystemSettings.findOne();
    const oldSettings = settings ? settings.toObject() : {};

    if (!settings) settings = new SystemSettings();

    // Apply updates
    Object.assign(settings, updates);
    settings.updatedBy = req.user._id;
    await settings.save();

    // --- Determine if password policy has been TIGHTENED ---
    const policyTightened =
      (updates.minPasswordLength !== undefined &&
        updates.minPasswordLength > (oldSettings.minPasswordLength || 8)) ||
      (updates.requireSpecialChars === true &&
        oldSettings.requireSpecialChars === false);

    let flaggedCount = 0;

    if (policyTightened) {
      // Flag ALL non-admin users to reset their password on next login
      // (We can't verify existing hashed passwords against the new policy,
      //  so we require everyone to set a compliant new password)
      const result = await User.updateMany(
        { role: { $in: ["Doctor", "Nurse"] } },
        {
          $set: {
            mustResetPassword: true,
          },
        }
      );
      flaggedCount = result.modifiedCount;
    }

    // Log to Audit Trail
    const log = new AuditLog({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "SYSTEM_CONFIG_UPDATE",
      details: `Secure Config Update: PwdLen=${settings.minPasswordLength}, SpecialChars=${settings.requireSpecialChars}, Timeout=${settings.sessionTimeout}m, MaxAttempts=${settings.maxLoginAttempts}${policyTightened ? `. Password reset flagged for ${flaggedCount} users.` : ""}`,
      ipAddress: req.ip,
    });
    await log.save();

    res.json({
      settings,
      policyTightened,
      flaggedCount,
      message: policyTightened
        ? `Settings saved. ${flaggedCount} existing user(s) have been flagged to reset their password to comply with the new policy.`
        : "Settings saved successfully.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET compliance status: how many users still need to reset password
router.get("/compliance", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden: Admin only." });
    }
    const pendingCount = await User.countDocuments({
      mustResetPassword: true,
      role: { $in: ["Doctor", "Nurse"] },
    });
    const totalNonAdmin = await User.countDocuments({
      role: { $in: ["Doctor", "Nurse"] },
    });
    res.json({ pendingCount, totalNonAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
