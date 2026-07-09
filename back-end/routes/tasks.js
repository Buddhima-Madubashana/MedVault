const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { logAction } = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");

// Create a task (Doctor only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Doctor") {
      return res.status(403).json({ error: "Access Denied: Doctors only" });
    }

    const { assignedTo, patientId, description } = req.body;

    if (!assignedTo || !description) {
      return res.status(400).json({ error: "Nurse assignment and description are required" });
    }

    // Verify assignedTo is a Nurse
    const nurse = await User.findById(assignedTo);
    if (!nurse || nurse.role !== "Nurse") {
      return res.status(400).json({ error: "Assigned user must be a Nurse" });
    }

    const newTask = new Task({
      assignedTo,
      assignedBy: req.user._id,
      patientId: patientId || null,
      description,
      status: "Pending"
    });

    await newTask.save();

    // Log the assignment
    await logAction(
      req.user,
      "TASK_ASSIGNED",
      `Doctor ${req.user.name} assigned task to Nurse ${nurse.name}: "${description}"`,
      req
    );

    // Notify Nurse
    await Notification.create({
      recipientId: assignedTo,
      type: "Task Assigned",
      title: "New Task Assigned",
      message: `Dr. ${req.user.name} assigned you a new task: "${description}"`,
      link: "/nurse",
      icon: "clipboard-list"
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List Tasks (Doctors see tasks they assigned, Nurses see tasks assigned to them)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "Nurse") {
      query.assignedTo = req.user._id;
    } else if (req.user.role === "Doctor") {
      query.assignedBy = req.user._id;
    } else if (req.user.role === "Admin") {
      // Admins can see all tasks (optional but good)
      query = {};
    } else {
      return res.status(403).json({ error: "Access Denied" });
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name specialty ward")
      .populate("assignedBy", "name specialty ward")
      .populate("patientId", "name ward disease")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete Task (Nurse only)
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Nurse") {
      return res.status(403).json({ error: "Access Denied: Nurses only" });
    }

    const task = await Task.findById(req.params.id)
      .populate("assignedBy")
      .populate("patientId");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access Denied: This task is not assigned to you" });
    }

    task.status = "Completed";
    task.completedAt = new Date();
    await task.save();

    // Log the completion
    await logAction(
      req.user,
      "TASK_COMPLETED",
      `Nurse ${req.user.name} completed task: "${task.description}"`,
      req
    );

    // Notify assigning Doctor
    await Notification.create({
      recipientId: task.assignedBy._id,
      type: "Task Completed",
      title: "Task Completed",
      message: `Nurse ${req.user.name} has completed the task: "${task.description}"`,
      link: "/doctor",
      icon: "check-circle"
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
