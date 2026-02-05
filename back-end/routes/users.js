const express = require("express");
const router = express.Router();
const User = require("../models/User");

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

// --- NEW: Unlock Account ---
router.post("/:id/unlock", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isLocked = false;
    user.failedLoginAttempts = 0;
    await user.save();

    res.json({ message: "Account unlocked successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
