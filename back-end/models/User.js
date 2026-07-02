const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Doctor", "Nurse"],
      default: "Doctor",
    },
    imageUrl: { type: String },
    specialty: { type: String },
    ward: { type: String },
    
    // Temporary Admin Permissions
    isTempAdmin: { type: Boolean, default: false },
    tempAdminExpiresAt: { type: Date },

    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },

    // Last login tracking
    lastLoginAt: { type: Date },

    // Password policy compliance
    mustResetPassword: { type: Boolean, default: false },
    passwordChangedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
