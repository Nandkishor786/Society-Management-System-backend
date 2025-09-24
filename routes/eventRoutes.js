// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Event } = require("../models/dbConnect");

// Use CORS middleware
router.use(cors());

// Multer Storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/posters"); // Store uploaded posters in 'public/posters'
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Create Event route (with poster upload)
router.post("/event", upload.single("poster"), async (req, res) => {
  try {
    const { title, date, time, description } = req.body;

    // Ensure all fields are provided
    if (!title || !date || !time || !description) {
      return res.status(400).json({ message: "All event details are required" });
    }

    const eventData = {
      title,
      date,
      time,
      description,
      poster: req.file ? req.file.filename : null, // Save the poster file name if uploaded
    };

    // Create event in the database
    const event = await Event.create(eventData);

    // Send success response
    res.status(200).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all events route
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find(); // Retrieve all events from DB

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.json(events); // Send events as response
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
