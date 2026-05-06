import mongoose from "mongoose";
import env from "dotenv";
import User, { ROLE_DEFAULT_PERMISSIONS } from "../features/user/user.model.js";

env.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/vms");

    const adminExists = await User.findOne({ userEmail: "admin@vms.com" });
    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const admin = new User({
      employeeCode: "ADMIN001",
      firstName: "Super",
      lastName: "Admin",
      phone: "1234567890",
      userEmail: "admin@vms.com",
      password: "password123", // User should change this
      userRole: "admin",
      permissions: ROLE_DEFAULT_PERMISSIONS.admin,
      isActive: true,
    });

    await admin.save();
    console.log("Admin user seeded successfully. Email: admin@vms.com, Password: password123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
