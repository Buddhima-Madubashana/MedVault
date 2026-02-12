const mongoose = require("mongoose");

const patientRequestSchema = new mongoose.Schema(
  {
    requestType: { type: String, enum: ["Add", "Delete"], default: "Add" }, // NEW
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }, // NEW (For delete requests)

    name: { type: String }, // Optional for delete
    age: { type: Number },
    disease: { type: String },
    ward: { type: String },
    imageUrl: { type: String },

    // Contact Info
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    guardianName: { type: String },

    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PatientRequest", patientRequestSchema);
