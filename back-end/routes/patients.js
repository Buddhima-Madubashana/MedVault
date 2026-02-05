const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const User = require("../models/User"); // Need User model to find actor name
const { logAction } = require("../utils/logger");

// GET Patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
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
