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
    const patients = await Patient.find().populate("approvedBy", "name");
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
    const patient = await Patient.findById(req.params.id).populate("approvedBy", "name");
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    // Apply Role-Based Masking (wrap in array then unwrap)
    const masked = maskData([patient], req.user);
    res.json(masked[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD Patient (Direct) — requires auth so we can mask the response
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { actionBy, ...patientData } = req.body; // Extract user ID

    // Task 1: Set approvedBy so the PatientDetails page shows the correct doctor name
    const newPatient = new Patient({
      ...patientData,
      approvedBy: actionBy || null,
    });
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

    // Task 2: Populate approvedBy and apply role-based masking before returning
    const populated = await Patient.findById(newPatient._id).populate("approvedBy", "name");
    const masked = maskData([populated], req.user);
    res.status(201).json(masked[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH Patient - Update medical history, status, or add timeline entry (Doctors only)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    // Doctors, Admins, and Nurses can update (Nurses can update vitals only)
    if (req.user.role !== "Doctor" && req.user.role !== "Admin" && req.user.role !== "Nurse") {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions." });
    }

    const { medicalHistory, status, newTimelineEntry, vitals } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Nurses can only update vitals
    if (req.user.role === "Nurse") {
      if (medicalHistory !== undefined || status !== undefined || newTimelineEntry) {
        return res.status(403).json({ error: "Nurses can only update vitals." });
      }
    }

    // Update medical history if provided
    if (medicalHistory !== undefined) {
      patient.medicalHistory = medicalHistory;
    }

    // Update status if provided
    if (status !== undefined) {
      patient.status = status;
    }

    // Update vitals if provided and auto-add timeline entry
    if (vitals) {
      const changes = [];
      if (vitals.heartRate && vitals.heartRate !== patient.vitals.heartRate) {
        changes.push(`Heart Rate: ${patient.vitals.heartRate} → ${vitals.heartRate}`);
        patient.vitals.heartRate = vitals.heartRate;
      }
      if (vitals.bloodPressure && vitals.bloodPressure !== patient.vitals.bloodPressure) {
        changes.push(`BP: ${patient.vitals.bloodPressure} → ${vitals.bloodPressure}`);
        patient.vitals.bloodPressure = vitals.bloodPressure;
      }
      if (vitals.temperature && vitals.temperature !== patient.vitals.temperature) {
        changes.push(`Temp: ${patient.vitals.temperature} → ${vitals.temperature}`);
        patient.vitals.temperature = vitals.temperature;
      }
      if (changes.length > 0) {
        patient.treatmentTimeline.push({
          event: `Vitals updated: ${changes.join(", ")}`,
          date: new Date(),
          doctorId: req.user._id,
          doctorName: req.user.name,
          doctorRole: req.user.role,
        });
      }
    }

    // Add a new timeline entry if provided
    if (newTimelineEntry && newTimelineEntry.event) {
      patient.treatmentTimeline.push({
        event: newTimelineEntry.event,
        date: newTimelineEntry.date || new Date(),
        doctorId: req.user._id,
        doctorName: req.user.name,
        doctorRole: req.user.role,
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

    // Task 4: Re-populate approvedBy so the frontend keeps the doctor name intact
    // Task 2: Apply role-based masking to the PATCH response
    const populated = await Patient.findById(patient._id).populate("approvedBy", "name");
    const masked = maskData([populated], req.user);
    res.json(masked[0]);
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
