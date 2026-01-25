const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Create Token
    const secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "1d",
    });

    // 4. Send Response
    // Use .toObject() to safely remove password
    const userInfo = user.toObject();
    delete userInfo.password;

    res.json({ token, user: userInfo });
  } catch (err) {
    // PRINT THE ERROR TO THE TERMINAL
    console.error("❌ Login Error:", err);
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
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
