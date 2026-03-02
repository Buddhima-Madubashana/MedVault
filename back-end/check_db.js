const mongoose = require("mongoose");
const AdminRequest = require("./models/AdminRequest");

mongoose.connect("mongodb://localhost:27017/medvault").then(async () => {
    console.log("Connected");
    const requests = await AdminRequest.find().lean();
    console.log("ALL REQUESTS:", JSON.stringify(requests, null, 2));

    const User = require("./models/User");
    const admins = await User.find({role: "Admin"}).lean();
    console.log("ALL ADMINS:", JSON.stringify(admins, null, 2));
    
    process.exit(0);
});
