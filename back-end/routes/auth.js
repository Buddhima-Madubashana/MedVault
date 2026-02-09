const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logAction } = require("../utils/logger"); // Import Logger

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check Locked Status
    if (user.isLocked && (user.role === "Doctor" || user.role === "Nurse")) {
      await logAction(
        user,
        "LOGIN_BLOCKED",
        "Attempted login while account locked",
        req,
      );
      return res
        .status(403)
        .json({ message: "Account Locked. Contact Admin." });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if (user.role !== "Admin") {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 3) {
          user.isLocked = true;
          await user.save();
          await logAction(
            user,
            "ACCOUNT_LOCKED",
            "Account locked due to 3 failed login attempts",
            req,
          );
          return res
            .status(403)
            .json({ message: "Account Locked: Max attempts reached." });
        }
        await user.save();
        await logAction(
          user,
          "LOGIN_FAILED",
          `Failed attempt ${user.failedLoginAttempts}/3`,
          req,
        );
        return res
          .status(400)
          .json({
            message: `Invalid credentials. ${3 - user.failedLoginAttempts} attempts left.`,
          });
      }
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Reset Lockout Counters
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.isLocked = false;
      await user.save();
    }

    // --- NEW: SESSION EXPIRY LOGIC ---
    // Admins get 24h, others get value from .env (e.g., '15m')
    const expiryTime =
      user.role === "Admin" ? "24h" : process.env.SESSION_EXPIRY || "1h";

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: expiryTime },
    );

    await logAction(user, "LOGIN_SUCCESS", "User logged in successfully", req);

    const userInfo = user.toObject();
    delete userInfo.password;

    res.json({ token, user: userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... (Keep the existing Register route below) ...
// REGISTER ROUTE (Admin Only) - Paste your existing register route here
router.post("/register", async (req, res) => {
  // ... existing register code ...
  try {
    const { name, email, password, role, specialty, ward, imageUrl } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialty,
      ward,
      imageUrl,
    });
    await newUser.save();
    // LOG REGISTER
    // Note: Since req.user isn't set yet, we might need to manually pass admin info if available,
    // or just log the new user creation context. For now, let's log the new user:
    await logAction(
      newUser,
      "USER_REGISTERED",
      `New ${newUser.role} account created: ${newUser.email}`,
      req,
    );
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
