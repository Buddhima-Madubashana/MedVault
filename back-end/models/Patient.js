const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    disease: { type: String, required: true },
    ward: { type: String, required: true },
    imageUrl: { type: String },
    
    // Contact Info
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    guardianName: { type: String },

    // Track who authorized this patient (so we know who to ask for deletion)
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Patient", patientSchema);
