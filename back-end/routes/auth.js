const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// LOGIN ROUTE (Updated with Lockout Logic)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. CHECK IF ACCOUNT IS LOCKED (Only for Doctors and Nurses)
    if (user.isLocked && (user.role === "Doctor" || user.role === "Nurse")) {
      return res.status(403).json({
        message: "Account Locked: Too many failed attempts. Contact Admin.",
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // --- WRONG PASSWORD LOGIC ---
      if (user.role === "Doctor" || user.role === "Nurse") {
        user.failedLoginAttempts += 1;

        // Lock if attempts >= 3
        if (user.failedLoginAttempts >= 3) {
          user.isLocked = true;
          await user.save();
          return res.status(403).json({
            message:
              "Account Locked: You have reached the maximum of 3 attempts.",
          });
        }

        await user.save();
        const attemptsLeft = 3 - user.failedLoginAttempts;
        return res.status(400).json({
          message: `Invalid credentials. ${attemptsLeft} attempt(s) left.`,
        });
      }

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // --- SUCCESS LOGIC ---
    // Reset counters on successful login
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.isLocked = false;
      await user.save();
    }

    // Create Token
    const secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "1d",
    });

    const userInfo = user.toObject();
    delete userInfo.password;

    res.json({ token, user: userInfo });
  } catch (err) {
    console.error("❌ Login Error:", err);
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
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
