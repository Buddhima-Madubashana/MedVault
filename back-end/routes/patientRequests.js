const express = require("express");
const router = express.Router();
const PatientRequest = require("../models/PatientRequest");
const Patient = require("../models/Patient");

// 1. Create a Request
router.post("/", async (req, res) => {
  try {
    const newRequest = new PatientRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Get Requests
router.get("/", async (req, res) => {
  const { role, userId } = req.query;
  try {
    let query = { status: "Pending" };
    if (role === "Nurse") query.nurseId = userId;
    if (role === "Doctor") query.doctorId = userId;

    const requests = await PatientRequest.find(query)
      .populate("nurseId", "name")
      .populate("doctorId", "name")
      .populate("patientId", "name"); // Populate patient details for delete requests

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Approve Request (Handles ADD and DELETE)
router.post("/:id/approve", async (req, res) => {
  try {
    const request = await PatientRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.requestType === "Delete") {
      // --- DELETE LOGIC ---
      if (request.patientId) {
        await Patient.findByIdAndDelete(request.patientId);
      }
      await PatientRequest.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ message: "Patient discharge approved and record deleted." });
    } else {
      // --- ADD LOGIC ---
      const newPatient = new Patient({
        name: request.name,
        age: request.age,
        disease: request.disease,
        ward: request.ward,
        imageUrl: request.imageUrl,
        approvedBy: request.doctorId, // Link the patient to this doctor
      });
      await newPatient.save();
      await PatientRequest.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ message: "Admission approved and patient added." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Reject Request
router.delete("/:id", async (req, res) => {
  try {
    await PatientRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
