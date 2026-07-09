const express = require("express");
const router = express.Router();
const PatientRequest = require("../models/PatientRequest");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { logAction } = require("../utils/logger");

// Create Request
router.post("/", async (req, res) => {
  try {
    const newRequest = new PatientRequest(req.body);
    await newRequest.save();

    // Log Action (Nurse)
    const nurse = await User.findById(req.body.nurseId);
    if (nurse) {
      const type =
        req.body.requestType === "Delete" ? "Discharge" : "Admission";
      await logAction(
        nurse,
        `REQUEST_${type.toUpperCase()}_SENT`,
        `Requested ${type} for: ${req.body.name}`,
        req,
      );
      
      // Notify the Doctor
      await Notification.create({
        recipientId: req.body.doctorId,
        type: `${type} Request`,
        title: `New ${type} Request`,
        message: `Nurse ${nurse.name} sent a request for ${req.body.name}`,
        link: "/doctor/reviews",
        icon: req.body.requestType === "Delete" ? "trash" : "userplus"
      });
    }

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Requests
router.get("/", async (req, res) => {
  // ... existing get logic ...
  const { role, userId } = req.query;
  try {
    let query = { status: "Pending" };
    if (role === "Nurse") query.nurseId = userId;
    if (role === "Doctor") {
      query.doctorId = userId;
    }

    const requests = await PatientRequest.find(query)
      .populate("nurseId", "name")
      .populate("doctorId", "name")
      .populate("patientId", "name");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve Request
router.post("/:id/approve", async (req, res) => {
  try {
    const request = await PatientRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Identify Doctor
    const { actionBy } = req.query;
    const approver = actionBy ? await User.findById(actionBy) : null;
    const doctor = approver || await User.findById(request.doctorId);
    const isBackup = approver && approver._id.toString() !== request.doctorId.toString();
    const backupNote = isBackup ? ` (Approved via Backup Cover by Dr. ${approver.name})` : "";

    if (request.requestType === "Delete") {
      if (request.patientId) await Patient.findByIdAndDelete(request.patientId);
      await PatientRequest.findByIdAndDelete(req.params.id);

      // Log
      if (doctor) {
        await logAction(
          doctor,
          "REQUEST_DISCHARGE_APPROVED",
          `Approved discharge for: ${request.name}${backupNote}`,
          req,
        );
        // Notify the Nurse
        await Notification.create({
          recipientId: request.nurseId,
          type: "Request Approved",
          title: "Discharge Approved",
          message: `Dr. ${doctor.name} approved discharge for ${request.name}${backupNote}`,
          link: "/nurse/approvals",
          icon: "check"
        });
      }
      res.status(200).json({ message: "Discharge approved" });
    } else {
      const newPatient = new Patient({
        name: request.name,
        age: request.age,
        disease: request.disease,
        ward: request.ward,
        imageUrl: request.imageUrl,
        email: request.email,
        phone: request.phone,
        address: request.address,
        guardianName: request.guardianName,
        approvedBy: doctor._id,
      });
      await newPatient.save();
      await PatientRequest.findByIdAndDelete(req.params.id);

      // Log
      if (doctor) {
        await logAction(
          doctor,
          "REQUEST_ADMISSION_APPROVED",
          `Approved admission for: ${request.name}${backupNote}`,
          req,
        );
        // Notify the Nurse
        await Notification.create({
          recipientId: request.nurseId,
          type: "Request Approved",
          title: "Admission Approved",
          message: `Dr. ${doctor.name} approved admission for ${request.name}${backupNote}`,
          link: "/nurse/approvals",
          icon: "check"
        });
      }
      res.status(200).json({ message: "Admission approved" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject Request
router.delete("/:id", async (req, res) => {
  try {
    const { actionBy } = req.query; // Doctor ID
    const request = await PatientRequest.findByIdAndDelete(req.params.id);

    if (request && actionBy) {
      const doctor = await User.findById(actionBy);
      if (doctor) {
        await logAction(
          doctor,
          "REQUEST_REJECTED",
          `Rejected request for: ${request.name}`,
          req,
        );
        // Notify the Nurse
        await Notification.create({
          recipientId: request.nurseId,
          type: "Request Rejected",
          title: "Request Rejected",
          message: `Dr. ${doctor.name} rejected your request for ${request.name}`,
          link: "/nurse/approvals",
          icon: "x"
        });
      }
    }

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
