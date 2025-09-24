const { Visitor } = require("../models/dbConnect");

// Utility: Build sorting object
const buildSortCriteria = (sortBy, sortOrder) => {
  if (!sortBy) return {};
  return { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
};

// Utility: Validate date in DD-MM-YYYY format
const isValidDate = (dateStr) => /^\d{2}-\d{2}-\d{4}$/.test(dateStr);

// Get all visitors
const getAllVisitors = async (req, res) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({})
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found" });
    }
    return res.status(200).json({ visitors });
  } catch (err) {
    console.error("Error fetching visitors:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get visitors by date
const getVisitorByDate = async (req, res) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const dateParam = req.params.date;

    if (!isValidDate(dateParam)) {
      return res.status(400).json({ message: "Invalid date format. Use DD-MM-YYYY." });
    }

    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({ date: dateParam })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found for this date" });
    }
    return res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by date:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get visitors by time range on a specific date
const getVisitorByTime = async (req, res) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 30 } = req.query;
    const { from: timeFromParam, to: timeToParam, date: dateParam } = req.params;

    if (!isValidDate(dateParam)) {
      return res.status(400).json({ message: "Invalid date format. Use DD-MM-YYYY." });
    }

    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({
      date: dateParam,
      time: { $gte: timeFromParam, $lte: timeToParam },
    })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found in this time range" });
    }
    return res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by time:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get visitors by block
const getVisitorByBlock = async (req, res) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const blockNumber = req.params.block;

    if (!blockNumber) {
      return res.status(400).json({ message: "Block number is required" });
    }

    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({ block: blockNumber })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found for this block" });
    }
    return res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by block:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get visitors by room (block + room_no)
const getVisitorByRoom = async (req, res) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 20 } = req.query;
    const { block: blockNumber, room: flatNumber } = req.params;

    if (!blockNumber || !flatNumber) {
      return res.status(400).json({ message: "Block and room number are required" });
    }

    const sortCriteria = buildSortCriteria(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find({
      block: blockNumber,
      room_no: flatNumber,
    })
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!visitors.length) {
      return res.status(404).json({ message: "No visitors found for this room" });
    }
    return res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error retrieving visitors by room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllVisitors,
  getVisitorByDate,
  getVisitorByRoom,
  getVisitorByTime,
  getVisitorByBlock,
};
