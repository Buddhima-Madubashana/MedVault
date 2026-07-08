const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    backupDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    emergencyOverride: {
      isActive: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      expiresAt: { type: Date },
    },
    emergencyRequest: {
      isRequested: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      durationHours: { type: Number, default: 2 },
      requestedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
