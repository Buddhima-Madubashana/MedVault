const mongoose = require("mongoose");

const adminRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Revoked", "Expired"],
      default: "Pending",
    },
    approvedAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AdminRequest", adminRequestSchema);
