// models/dbConnect.js
const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection URI
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("❌ MongoDB URI is not defined in the .env file");
}

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });

// Visitor Schema
const VisitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact_no: { type: Number, required: true },
  block: { type: String, required: true },
  room_no: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true },
}, { timestamps: true });

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Event Schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: String },
}, { timestamps: true });

// Models
const Visitor = mongoose.model("Visitor", VisitorSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Event = mongoose.model("Event", EventSchema);

module.exports = { Visitor, Admin, Event };
