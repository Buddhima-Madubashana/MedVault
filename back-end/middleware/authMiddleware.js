const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    );
    
    // Fetch full user to ensure we have latest permissions (like isTempAdmin)
    const User = require("../models/User");
    const user = await User.findById(verified.id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
