import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Service from "./models/Service.js";
import Vehicle from "./models/Vehicle.js";
import Appointment from "./models/Appointment.js";
import services from "./data/services.js";

dotenv.config();

await connectDB();

async function importData() {
  try {
    await Appointment.deleteMany();
    await Vehicle.deleteMany();
    await Service.deleteMany();
    await User.deleteMany();

    await User.create({
      name: "Administrator",
      email: "admin@test.com",
      password: "admin123",
      role: "admin",
      phone: "",
      city: "",
    });

    await Service.insertMany(services);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Import error: ${error.message}`);
    process.exit(1);
  }
}

async function destroyData() {
  try {
    await Appointment.deleteMany();
    await Vehicle.deleteMany();
    await Service.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Destroy error: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}