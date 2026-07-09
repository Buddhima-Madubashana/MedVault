const express = require("express");
const router = express.Router();
const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { logAction } = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");

// Apply for Leave (Doctor or Nurse)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Start date, end date, and reason are required" });
    }

    const newRequest = new LeaveRequest({
      requester: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "Pending",
    });

    await newRequest.save();

    // Log the action
    await logAction(req.user, "LEAVE_REQUEST_CREATED", `${req.user.role} ${req.user.name} applied for leave from ${startDate} to ${endDate}`, req);

    // Notify Admins
    const admins = await User.find({ role: "Admin" });
    for (const admin of admins) {
      await Notification.create({
        recipientId: admin._id,
        type: "Leave Request",
        title: "New Leave Request",
        message: `${req.user.name} (${req.user.role}) applied for leave.`,
        link: "/admin/leaves",
        icon: "calendar",
      });
    }

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Leave Requests (Admin: all, Doctor/Nurse: their own)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let requests;
    if (req.user.role === "Admin") {
      requests = await LeaveRequest.find()
        .populate("requester", "name email role specialty ward")
        .populate("approvedBy", "name")
        .sort({ createdAt: -1 });
    } else {
      requests = await LeaveRequest.find({ requester: req.user._id })
        .populate("approvedBy", "name")
        .sort({ createdAt: -1 });
    }
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject Leave Request (Admin Only)
router.put("/:id/:action", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied: Admins only" });
    }

    const { id, action } = req.params;
    if (action !== "approve" && action !== "reject") {
      return res.status(400).json({ error: "Invalid action" });
    }

    const request = await LeaveRequest.findById(id).populate("requester");
    if (!request) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    request.status = action === "approve" ? "Approved" : "Rejected";
    request.approvedBy = req.user._id;
    await request.save();

    await logAction(
      req.user,
      `LEAVE_REQUEST_${action.toUpperCase()}`,
      `Admin approved/rejected leave request for ${request.requester.name}`,
      req
    );

    // Notify requester
    await Notification.create({
      recipientId: request.requester._id,
      type: "Leave Request Update",
      title: `Leave Request ${request.status}`,
      message: `Your leave request from ${request.startDate.toDateString()} to ${request.endDate.toDateString()} was ${request.status.toLowerCase()}.`,
      link: "/leaves",
      icon: action === "approve" ? "check-circle" : "x-circle",
    });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Grant Emergency Access Override (Admin Only)
router.post("/:id/override", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied: Admins only" });
    }

    const { id } = req.params;
    const { durationHours, reason } = req.body;

    if (!durationHours || isNaN(durationHours) || durationHours <= 0) {
      return res.status(400).json({ error: "A valid positive duration in hours is required" });
    }

    const request = await LeaveRequest.findById(id).populate("requester");
    if (!request) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    const expiresAt = new Date(Date.now() + parseFloat(durationHours) * 60 * 60 * 1000);
    const overrideReason = reason || "Emergency access approved by Admin";

    request.emergencyOverride = {
      isActive: true,
      reason: overrideReason,
      grantedBy: req.user._id,
      expiresAt,
    };

    // Clear the emergency request flag since it's been handled
    if (request.emergencyRequest?.isRequested) {
      request.emergencyRequest.isRequested = false;
    }

    await request.save();

    // Log the override action
    await logAction(
      req.user,
      "LEAVE_OVERRIDE_GRANTED",
      `Emergency access granted to ${request.requester.name} for ${durationHours} hours. Reason: ${overrideReason}`,
      req
    );

    // Notify the user
    await Notification.create({
      recipientId: request.requester._id,
      type: "Emergency Access Granted",
      title: "Emergency Access Granted",
      message: `You have been granted emergency access to the system until ${expiresAt.toLocaleTimeString()}. Reason: ${overrideReason}`,
      link: "/",
      icon: "key",
    });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Revoke Emergency Access Override (Admin Only)
router.post("/:id/revoke-override", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied: Admins only" });
    }

    const { id } = req.params;
    const request = await LeaveRequest.findById(id).populate("requester");
    if (!request) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    if (request.emergencyOverride) {
      request.emergencyOverride.isActive = false;
    }

    await request.save();

    // Log the revocation
    await logAction(
      req.user,
      "LEAVE_OVERRIDE_REVOKED",
      `Emergency access revoked for ${request.requester.name}`,
      req
    );

    // Notify the user
    await Notification.create({
      recipientId: request.requester._id,
      type: "Emergency Access Revoked",
      title: "Emergency Access Revoked",
      message: `Your emergency access has been revoked by the Administrator.`,
      link: "/",
      icon: "lock",
    });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Request Emergency Access Override (Public: called from Login page)
router.post("/emergency-request", async (req, res) => {
  try {
    const { email, reason, durationHours } = req.body;

    if (!email || !reason || !durationHours) {
      return res.status(400).json({ error: "Email, reason, and duration are required" });
    }

    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find active leave request (Approved)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    const approvedLeaves = await LeaveRequest.find({
      requester: user._id,
      status: "Approved"
    });

    const activeLeave = approvedLeaves.find(leave => {
      const startStr = leave.startDate.toISOString().split("T")[0];
      const endStr = leave.endDate.toISOString().split("T")[0];
      return todayStr >= startStr && todayStr <= endStr;
    });

    if (!activeLeave) {
      return res.status(400).json({ error: "No active approved leave found for this user today." });
    }

    // Update emergency request info
    activeLeave.emergencyRequest = {
      isRequested: true,
      reason,
      durationHours: parseFloat(durationHours),
      requestedAt: new Date()
    };

    await activeLeave.save();

    // Log override request
    await logAction(
      user,
      "LEAVE_OVERRIDE_REQUESTED",
      `User requested emergency override for ${durationHours} hours. Reason: ${reason}`,
      req
    );

    // Notify Admins
    const admins = await User.find({ role: "Admin" });
    for (const admin of admins) {
      await Notification.create({
        recipientId: admin._id,
        type: "Emergency Leave Request",
        title: "Emergency Login Request",
        message: `${user.name} on leave requested emergency access.`,
        link: "/admin/leaves",
        icon: "alert-triangle",
      });
    }

    res.json({ message: "Emergency access request submitted successfully. Please contact your administrator." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
