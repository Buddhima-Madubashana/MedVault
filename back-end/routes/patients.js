const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const User = require("../models/User"); // Need User model to find actor name
const { logAction } = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");
const maskData = require("../utils/maskData");

// GET All Patients
router.get("/", authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.find();
    // Apply Role-Based Masking
    const maskedData = maskData(patients, req.user);
    res.json(maskedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Single Patient by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    // Apply Role-Based Masking (wrap in array then unwrap)
    const masked = maskData([patient], req.user);
    res.json(masked[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD Patient (Direct)
router.post("/", async (req, res) => {
  try {
    const { actionBy, ...patientData } = req.body; // Extract user ID
    const newPatient = new Patient(patientData);
    await newPatient.save();

    // Log Action
    if (actionBy) {
      const actor = await User.findById(actionBy);
      if (actor)
        await logAction(
          actor,
          "PATIENT_ADD_DIRECT",
          `Added patient: ${newPatient.name}`,
          req,
        );
    }

    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH Patient - Update medical history, status, or add timeline entry (Doctors only)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    // Only Doctors (and Admins) can update these fields
    if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden: Only doctors can update patient records." });
    }

    const { medicalHistory, status, newTimelineEntry } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Update medical history if provided
    if (medicalHistory !== undefined) {
      patient.medicalHistory = medicalHistory;
    }

    // Update status if provided
    if (status !== undefined) {
      patient.status = status;
    }

    // Add a new timeline entry if provided
    if (newTimelineEntry && newTimelineEntry.event) {
      patient.treatmentTimeline.push({
        event: newTimelineEntry.event,
        date: newTimelineEntry.date || new Date(),
        doctorId: req.user._id,
        doctorName: req.user.name,
      });
    }

    await patient.save();

    // Log the action
    await logAction(
      req.user,
      "PATIENT_RECORD_UPDATE",
      `Updated record for patient: ${patient.name}`,
      req,
    );

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Patient (Direct)
router.delete("/:id", async (req, res) => {
  try {
    const { actionBy } = req.query; // Get User ID from query param
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (patient && actionBy) {
      const actor = await User.findById(actionBy);
      if (actor)
        await logAction(
          actor,
          "PATIENT_DELETE_DIRECT",
          `Deleted patient record: ${patient.name}`,
          req,
        );
    }

    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
