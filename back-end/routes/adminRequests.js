const express = require("express");
const router = express.Router();
const AdminRequest = require("../models/AdminRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { logAction } = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to check if user has admin privileges (either permanent or temporary)
const hasAdminPrivilege = (user) => {
  return (
    user.role === "Admin" ||
    (user.isTempAdmin && user.tempAdminExpiresAt > new Date())
  );
};

// Create Request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { adminId, reason, duration } = req.body;
    const admin = await User.findById(adminId);

    if (!admin || admin.role !== "Admin") {
      return res.status(400).json({ error: "Invalid admin selected" });
    }

    const newRequest = new AdminRequest({
      requester: req.user._id,
      admin: adminId,
      reason,
      duration,
      status: "Pending",
    });

    await newRequest.save();
    
    // Convert req.user (which is just token payload) to full user object for logger if needed
    // Or assume logAction handles it. Let's look at logger.js later.
    // Assuming req.user has userId and role from JWT.
    
    // Simple log
    console.log(`User ${req.user._id} requested admin permission from ${admin.name}`);

    // Notify the target Admin
    const requester = await User.findById(req.user._id);
    await Notification.create({
      recipientId: adminId,
      type: "Admin Permission Request",
      title: "New Admin Request",
      message: `Dr. ${requester.name} requested temporary admin access.`,
      link: "/admin/requests",
      icon: "shield"
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Requests (For Admin: show pending directed to them. For Doctor: show their own requests)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let requests;
    if (user.role === "Admin") {
      console.log(`[AdminRequests] Fetching requests for Admin ID: ${user._id}`);
      // If a real Admin wants to see requests:
      // Search for requests assigned to them (handle both ObjectId and String formats just in case)
      requests = await AdminRequest.find({ 
        $or: [
          { admin: user._id },
          { admin: user._id.toString() }
        ]
      })
        .populate("requester", "name email specialty ward")
        .populate("admin", "name")
        .sort({ createdAt: -1 });
      console.log(`[AdminRequests] Found ${requests.length} requests for this admin.`);
      
    } else {
      // Show requests made by this user
      requests = await AdminRequest.find({ requester: user._id })
        .populate("admin", "name")
        .sort({ createdAt: -1 });
    }

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve Request
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    // Only the target admin can approve? Or any admin?
    // User prompt: "Only if the admin reviews and accepts it"
    // Let's enforce that only the assigned admin can approve.
    const request = await AdminRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Request is not pending" });
    }

    if (request.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to approve this request" });
    }

    // Update Request
    request.status = "Approved";
    request.approvedAt = new Date();
    // Calculate expiration
    const expiration = new Date(new Date().getTime() + request.duration * 60000);
    request.expiresAt = expiration;
    await request.save();

    // Update User Permissions
    await User.findByIdAndUpdate(request.requester, {
      isTempAdmin: true,
      tempAdminExpiresAt: expiration,
      role: "Doctor", // Keep role as Doctor but with privileges
    });

    // Log Action
    const actor = await User.findById(req.user._id);
    const requesterUser = await User.findById(request.requester);
    const requesterName = requesterUser ? requesterUser.name : request.requester;
    await logAction(actor, "ADMIN_GRANT", `Granted temporary admin access to doctor ${requesterName}`, req);

    // Notify the Doctor
    await Notification.create({
      recipientId: request.requester,
      type: "Permission Granted",
      title: "Admin Access Approved",
      message: `Admin ${actor.name} granted you temporary admin access.`,
      link: null,
      icon: "check"
    });

    res.json({ message: "Permission granted", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject Request
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.admin.toString() !== req.user._id) {
      return res.status(403).json({ error: "Not authorized to reject this request" });
    }

    request.status = "Rejected";
    await request.save();

    // Notify the Doctor
    const actor = await User.findById(req.user._id);
    await Notification.create({
      recipientId: request.requester,
      type: "Permission Denied",
      title: "Admin Access Rejected",
      message: `Admin ${actor.name} rejected your admin access request.`,
      link: null,
      icon: "x"
    });

    res.json({ message: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Revoke Permission
router.put("/:id/revoke", authMiddleware, async (req, res) => {
  try {
    // Admin can revoke permission
    // This could be called on the request ID or User ID?
    // Let's assume on request ID for now as it's cleaner to track which request granted it.
    // Or we can just find the active request for a user.
    // Logic: If passed ID is a User ID, revoke for that user. If Request ID, revoke that request.
    // Let's stick to Request ID as per route structure, or implement a separate route for users.
    
    const request = await AdminRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Verify Admin
    // Any admin should be able to revoke? Or only the granter?
    // Usually any admin.
    const admin = await User.findById(req.user._id);
    if (admin.role !== "Admin") return res.status(403).json({ error: "Only admins can revoke permissions" });

    request.status = "Revoked";
    await request.save();

    // Remove User Permissions
    await User.findByIdAndUpdate(request.requester, {
      isTempAdmin: false,
      tempAdminExpiresAt: null,
    });
    
    // Log Action
    const requesterUser = await User.findById(request.requester);
    const requesterName = requesterUser ? requesterUser.name : request.requester;
    await logAction(admin, "ADMIN_REVOKE", `Revoked temporary admin access for doctor ${requesterName}`, req);

    // Notify the Doctor
    await Notification.create({
      recipientId: request.requester,
      type: "Permission Revoked",
      title: "Admin Access Revoked",
      message: `Admin ${admin.name} revoked your temporary admin access.`,
      link: null,
      icon: "alert"
    });

    res.json({ message: "Permission revoked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
