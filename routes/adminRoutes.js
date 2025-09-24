const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Admin } = require("../models/dbConnect");
const { Society } = require("../models/Society");
const upload = require('../middlewares/upload');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// ==================== Admin Signup Route ====================
router.post("/signup", async (req, res) => {
  try {
    const { username, firstName, lastName, password } = req.body;

    if (!username || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists. Please sign in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Admin created successfully", token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==================== Admin Signin Route ====================
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==================== Create Society Route ====================
router.post("/create-society", upload.single("poster"), async (req, res) => {
  try {
    const {
      societyName,
      address,
      contact,
      ownerName,
      email,
      numBlocks,
      city,
      pincode,
      securityHead,
      registrationNumber
    } = req.body;

    const newSociety = new Society({
      societyName,
      address,
      contact,
      ownerName,
      email,
      numBlocks,
      city,
      pincode,
      securityHead,
      registrationNumber,
      poster: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newSociety.save();
    res.status(201).json({ message: "Society created successfully", society: newSociety });
  } catch (error) {
    console.error("Create Society Error:", error);
    res.status(500).json({ message: "Failed to create society" });
  }
});

// ==================== Get All Societies Route ====================
// Get all societies route
// Route to get all societies
router.get("/secure-societies", async (req, res) => {
  try {
    const societies = await Society.find(); // Fetch all societies from the database
    res.status(200).json({ societies });
  } catch (error) {
    console.error("Error fetching societies:", error);
    res.status(500).json({ message: "Failed to fetch societies" });
  }
});



// ==================== Get Single Society by ID ====================
router.get("/society/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    res.status(200).json({ society });
  } catch (error) {
    console.error("Error fetching society by ID:", error);
    res.status(500).json({ message: "Failed to fetch society" });
  }
});


module.exports = router;
