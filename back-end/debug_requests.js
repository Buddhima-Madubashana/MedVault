const mongoose = require("mongoose");
const AdminRequest = require("./models/AdminRequest");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/medvault", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("Connected to MongoDB");

  try {
    const admins = await User.find({ role: "Admin" });
    console.log("\n--- ADMINS ---");
    admins.forEach(a => console.log(`ID: ${a._id}, Name: ${a.name}`));

    const requests = await AdminRequest.find({});
    console.log("\n--- REQUESTS ---");
    requests.forEach(r => {
        console.log(`ID: ${r._id}, Status: ${r.status}`);
        console.log(`  Requester: ${r.requester}`);
        console.log(`  Admin Targeted: ${r.admin}`);
        
        // Check match
        const matchingAdmin = admins.find(a => a._id.toString() === r.admin.toString());
        if (matchingAdmin) {
            console.log(`  -> MATCH FOUND: Targeted admin is ${matchingAdmin.name}`);
        } else {
            console.log(`  -> NO MATCH: Targeted admin ID not found in admins list!`);
        }
    });

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
})
.catch(err => console.error(err));
