const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { logAction } = require("../utils/logger");

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

    // LOG UNLOCK
    await logAction(user, "ACCOUNT_UNLOCKED", `Account unlocked by Admin`, req);

    res.json({ message: "Account unlocked successfully", user });
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

module.exports = router;
