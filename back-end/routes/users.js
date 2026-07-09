const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { logAction } = require("../utils/logger");

// Get All Users (with optional role filter)
router.get("/", async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) {
      query.role = role;
    }
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Nurses
router.get("/nurses", async (req, res) => {
  try {
    const nurses = await User.find({ role: "Nurse" }).select("-password");
    res.json(nurses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: Get Locked Accounts ---
router.get("/locked", async (req, res) => {
  try {
    const lockedUsers = await User.find({ isLocked: true }).select("-password");
    res.json(lockedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: Get Single User ---
router.get("/:id", async (req, res) => {
   try {
     const user = await User.findById(req.params.id).select("-password");
     if (!user) return res.status(404).json({ message: "User not found" });
     res.json(user);
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
});

// --- NEW: Unlock Account ---
router.post("/:id/unlock", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isLocked = false;
    user.failedLoginAttempts = 0;
    await user.save();

    // LOG UNLOCK
    await logAction(user, "ACCOUNT_UNLOCKED", `Account unlocked by Admin`, req);

    res.json({ message: "Account unlocked successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: Reset Password (required after policy change) ---
router.post("/:id/reset-password", async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const SystemSettings = require("../models/SystemSettings");

    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "New password is required." });

    // Validate against current policy
    let settings = await SystemSettings.findOne();
    if (!settings) settings = new SystemSettings();

    const errors = [];
    if (newPassword.length < settings.minPasswordLength) {
      errors.push(`Password must be at least ${settings.minPasswordLength} characters.`);
    }
    if (settings.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      errors.push("Password must contain at least one special character (!@#$...).");
    }
    if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustResetPassword = false;
    user.passwordChangedAt = new Date();
    await user.save();

    await logAction(user, "PASSWORD_RESET", "User reset password to comply with policy", req);

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: Delete User (Doctor/Nurse/Admin) ---
router.delete("/:id", async (req, res) => {
  try {
    const { actionBy } = req.query; // Admin ID
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete)
      return res.status(404).json({ message: "User not found" });

    // Prevent deleting the last Admin (optional safety check, good practice)
    if (userToDelete.role === "Admin") {
      const adminCount = await User.countDocuments({ role: "Admin" });
      if (adminCount <= 1)
        return res
          .status(400)
          .json({ message: "Cannot delete the only Admin." });
    }

    await User.findByIdAndDelete(req.params.id);

    // LOG ACTION
    if (actionBy) {
      const admin = await User.findById(actionBy);
      if (admin) {
        await logAction(
          admin,
          "USER_DELETED",
          `Deleted ${userToDelete.role} account: ${userToDelete.name}`,
          req,
        );
      }
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Shift (Admin only or authorized users)
router.put("/:id/shift", async (req, res) => {
  try {
    const { shiftStart, shiftEnd } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.shiftStart = shiftStart || "";
    user.shiftEnd = shiftEnd || "";
    await user.save();

    // Log the change
    await logAction(user, "SHIFT_CONFIG_UPDATE", `Shift updated to: ${shiftStart || "None"} - ${shiftEnd || "None"}`, req);

    res.json({ message: "User shift updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
