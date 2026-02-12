const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/encryption");

const patientRequestSchema = new mongoose.Schema(
  {
    requestType: { type: String, enum: ["Add", "Delete"], default: "Add" }, // NEW
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }, // NEW (For delete requests)

    name: { type: String }, // Optional for delete
    age: { type: String, set: encrypt, get: decrypt },
    disease: { type: String, set: encrypt, get: decrypt },
    ward: { type: String, set: encrypt, get: decrypt },
    imageUrl: { type: String },

    // Contact Info
    email: { type: String, set: encrypt, get: decrypt },
    phone: { type: String, set: encrypt, get: decrypt },
    address: { type: String, set: encrypt, get: decrypt },
    guardianName: { type: String, set: encrypt, get: decrypt },

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
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

module.exports = mongoose.model("PatientRequest", patientRequestSchema);
