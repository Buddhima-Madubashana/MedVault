const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");
const SystemSettings = require("../models/SystemSettings");
const { logAction } = require("../utils/logger");
const { checkUserLeaveStatus } = require("../utils/leaveChecker");

// Helper: fetch the active system settings (returns defaults if none saved)
async function getSettings() {
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = new SystemSettings();
    await settings.save();
  }
  return settings;
}

// Helper: validate a plaintext password against policy settings
function validatePasswordPolicy(password, settings) {
  const errors = [];
  if (password.length < settings.minPasswordLength) {
    errors.push(`Password must be at least ${settings.minPasswordLength} characters.`);
  }
  if (settings.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$...).");
  }
  return errors;
}

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const settings = await getSettings();

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check Leave Status
    const leaveStatus = await checkUserLeaveStatus(user._id);
    if (leaveStatus.onLeave && !leaveStatus.overrideActive) {
      if (!user.isLocked) {
        user.isLocked = true;
        await user.save();
      }
      await logAction(
        user,
        "LOGIN_BLOCKED",
        "Attempted login while on approved leave without active emergency override",
        req
      );
      return res.status(403).json({
        message: "Access Denied: You are currently on leave. Contact administrator for emergency access override.",
        onLeave: true,
      });
    } else {
      // Not on leave (or has override)
      // Auto-unlock if locked solely due to leave (failedLoginAttempts < maxLoginAttempts)
      if (user.isLocked && user.failedLoginAttempts < settings.maxLoginAttempts) {
        user.isLocked = false;
        await user.save();
      }
    }

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
        // Use maxLoginAttempts from system settings
        if (user.failedLoginAttempts >= settings.maxLoginAttempts) {
          user.isLocked = true;
          await user.save();
          await logAction(
            user,
            "ACCOUNT_LOCKED",
            `Account locked due to ${settings.maxLoginAttempts} failed login attempts`,
            req,
          );
          
          // Notify ALL Admins
          const admins = await User.find({ role: "Admin" });
          for (const admin of admins) {
            await Notification.create({
              recipientId: admin._id,
              type: "Account Locked",
              title: "Security Alert",
              message: `User ${user.name} (${user.role}) was locked out after ${settings.maxLoginAttempts} failed login attempts.`,
              link: "/admin/locked",
              icon: "lock"
            });
          }

          return res
            .status(403)
            .json({ message: "Account Locked: Max attempts reached." });
        }
        await user.save();
        const attemptsLeft = settings.maxLoginAttempts - user.failedLoginAttempts;
        await logAction(
          user,
          "LOGIN_FAILED",
          `Failed attempt ${user.failedLoginAttempts}/${settings.maxLoginAttempts}`,
          req,
        );
        return res
          .status(400)
          .json({
            message: `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`,
          });
      }
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Reset Lockout Counters
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.isLocked = false;
    }
    user.lastLoginAt = new Date();
    await user.save();

    // SESSION EXPIRY: Admins get 24h, others get sessionTimeout minutes from settings
    const sessionMinutes = settings.sessionTimeout || 60;
    const expiryTime =
      user.role === "Admin" ? "24h" : `${sessionMinutes}m`;

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

// REGISTER ROUTE (Admin Only)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialty, ward, imageUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // --- Validate password against current system policy ---
    const settings = await getSettings();
    const policyErrors = validatePasswordPolicy(password, settings);
    if (policyErrors.length > 0) {
      return res.status(400).json({ message: policyErrors.join(" ") });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialty,
      ward,
      imageUrl,
      passwordChangedAt: new Date(),
      mustResetPassword: false,
    });
    await newUser.save();

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
