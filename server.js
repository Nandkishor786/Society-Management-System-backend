const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/dbConnect"); // Ensure DB connection is established

const adminRoutes = require("./routes/adminRoutes");
const visitorRoutes = require("./routes/visitor-router");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust front-end origin as needed
app.use(express.json());

// Serve static files from public directory
app.use(express.static("public"));

// Serve images from uploads directory
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/admin", adminRoutes);  // Admin routes
app.use("/visitor", visitorRoutes); // Visitor routes
app.use("/admin", eventRoutes);  // Event routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
