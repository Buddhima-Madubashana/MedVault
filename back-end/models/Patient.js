const mongoose = require("mongoose");

const { encrypt, decrypt } = require("../utils/encryption");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true, set: encrypt, get: decrypt },
    disease: { type: String, required: true, set: encrypt, get: decrypt },
    ward: { type: String, required: true, set: encrypt, get: decrypt },
    imageUrl: { type: String },
    
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
    toObject: { getters: true }
  },
);

module.exports = mongoose.model("Patient", patientSchema);
