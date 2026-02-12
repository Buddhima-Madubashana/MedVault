const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    minPasswordLength: { type: Number, default: 8 },
    requireSpecialChars: { type: Boolean, default: true },
    sessionTimeout: { type: Number, default: 15 }, // minutes
    maxLoginAttempts: { type: Number, default: 3 },
    accountLockoutDuration: { type: Number, default: 30 }, // minutes
    
    // Track last update
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// We only need one settings document, but schema supports history if needed
module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
