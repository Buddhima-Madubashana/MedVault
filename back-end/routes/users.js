const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all Doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Nurses
router.get("/nurses", async (req, res) => {
  try {
    const nurses = await User.find({ role: "Nurse" }).select("-password");
    res.json(nurses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
