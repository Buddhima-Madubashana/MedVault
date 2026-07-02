const mongoose = require("mongoose");

const { encrypt, decrypt } = require("../utils/encryption");

const timelineEntrySchema = new mongoose.Schema({
  event: { type: String, required: true },
  date: { type: Date, default: Date.now },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorName: { type: String },
  doctorRole: { type: String },
});

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true, set: encrypt, get: decrypt },
    disease: { type: String, required: true, set: encrypt, get: decrypt },
    ward: { type: String, required: true, set: encrypt, get: decrypt },
    imageUrl: { type: String },

    // Patient status
    status: {
      type: String,
      enum: ["Stable", "Critical", "Under Observation", "Recovering", "Discharged"],
      default: "Stable",
    },

    // Editable medical history notes
    medicalHistory: { type: String, default: "" },

    // Current vitals (editable by Doctor and Nurse)
    vitals: {
      heartRate: { type: String, default: "72 bpm" },
      bloodPressure: { type: String, default: "120/80" },
      temperature: { type: String, default: "98.6 °F" },
    },

    // Treatment timeline entries added by doctors
    treatmentTimeline: [timelineEntrySchema],

    // Contact Info
    email: { type: String, set: encrypt, get: decrypt },
    phone: { type: String, set: encrypt, get: decrypt },
    address: { type: String, set: encrypt, get: decrypt },
    guardianName: { type: String, set: encrypt, get: decrypt },

    // Track who authorized this patient (so we know who to ask for deletion)
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

module.exports = mongoose.model("Patient", patientSchema);
