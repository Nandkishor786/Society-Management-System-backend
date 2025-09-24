const express = require("express");
const router = express.Router();
const { Visitor } = require("../models/dbConnect");

// Utility function to build sorting criteria
const buildSortCriteria = (sortBy, sortOrder) => {
  if (!sortBy) return {};
  return { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
};

// Utility function to validate date format
const isValidDate = (dateStr) => /^\d{2}-\d{2}-\d{4}$/.test(dateStr);

// Submit visitor
router.post("/submit", async (req, res) => {
  try {
    const { name, contact_no, block, room_no, date, time, purpose } = req.body;

    // Validation for required fields
    if (!name || !contact_no || !block || !room_no || !date || !time || !purpose) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validation for numeric fields
    if (isNaN(contact_no) || isNaN(room_no)) {
      return res.status(400).json({ message: "Contact and room number must be valid numbers." });
    }

    const newVisitor = new Visitor({ name, contact_no, block, room_no, date, time, purpose });
    await newVisitor.save();

    res.status(200).json({ message: "Visitor submitted successfully!", visitor: newVisitor });
  } catch (error) {
    console.error("❌ Error submitting visitor:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all visitors with pagination and sorting
router.get("/all", async (req, res) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find()
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found" });
    }

    res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get visitors by date with pagination and sorting
router.get("/dates/:date", async (req, res) => {
  try {
    const requestedDate = req.params.date;

    if (!isValidDate(requestedDate)) {
      return res.status(400).json({ message: "Invalid date format. Use DD-MM-YYYY." });
    }

    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({ date: requestedDate })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found for this date" });
    }

    res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by date:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get visitors by time range with pagination and sorting
router.get("/time/:date/:from/:to", async (req, res) => {
  try {
    const { date, from, to } = req.params;

    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Invalid date format. Use DD-MM-YYYY." });
    }

    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({
      date,
      time: { $gte: from, $lte: to },
    })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found in this time range" });
    }

    res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by time:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get visitors by block with pagination and sorting
router.get("/block/:block", async (req, res) => {
  try {
    const block = req.params.block.toUpperCase();
    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({ block })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found for this block" });
    }

    res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by block:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get visitors by room number with pagination and sorting
router.get("/room/:room_no", async (req, res) => {
  try {
    const room_no = parseInt(req.params.room_no);
    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({ room_no })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found for this room" });
    }

    res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
