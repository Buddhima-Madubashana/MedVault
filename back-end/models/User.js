const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Doctor", "Nurse"], required: true },
    specialty: { type: String }, // Only for Doctors
    ward: { type: String }, // For Nurses
    imageUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
