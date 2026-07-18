const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const auth = require("../middleware/authMiddleware");

// Helper to check if user has Admin privileges (either Admin role or Temp Admin)
const isAdmin = (user) => {
  return (
    user.role === "Admin" ||
    (user.isTempAdmin &&
      user.tempAdminExpiresAt &&
      new Date(user.tempAdminExpiresAt) > new Date())
  );
};

// GET /api/announcements
// Get all active announcements (for all authenticated users)
router.get("/", auth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate("author", "firstName lastName role")
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/announcements/all
// Get all announcements (for Admins only)
router.get("/all", auth, async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const announcements = await Announcement.find()
      .populate("author", "firstName lastName role")
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/announcements
// Create a new announcement (Admin only)
router.post("/", auth, async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { title, message, priority, isActive } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: "Title and message are required" });
  }

  try {
    const newAnnouncement = new Announcement({
      title,
      message,
      priority: priority || "normal",
      isActive: isActive !== undefined ? isActive : true,
      author: req.user._id,
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/announcements/:id
// Update an announcement (Admin only)
router.put("/:id", auth, async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json(updatedAnnouncement);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/announcements/:id
// Delete an announcement (Admin only)
router.delete("/:id", auth, async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
