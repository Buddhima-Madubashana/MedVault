require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    // 1. Define the URI explicitly
    const dbUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medvault";

    // Debug: Print the URI to ensure it's a string
    console.log("🔌 Attempting to connect to:", dbUri);

    // 2. Connect to MongoDB
    await mongoose.connect(dbUri);
    console.log("✅ Connected to MongoDB...");

    // 3. Check if an Admin already exists
    const existingAdmin = await User.findOne({ email: "admin@medvault.com" });

    if (existingAdmin) {
      console.log("⚠️ Admin account already exists.");
      process.exit();
    }

    // 4. Create the Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt); // Default password

    const newAdmin = new User({
      name: "System Administrator",
      email: "admin@medvault.com",
      password: hashedPassword,
      role: "Admin",
      imageUrl:
        "https://ui-avatars.com/api/?name=System+Admin&background=0D8ABC&color=fff",
    });

    await newAdmin.save();
    console.log("🎉 Admin account created successfully!");
    console.log("👉 Email: admin@medvault.com");
    console.log("👉 Password: admin123");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    // 5. Close connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit();
  }
};

seedAdmin();
