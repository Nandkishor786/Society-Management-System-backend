const mongoose = require("mongoose");

const societySchema = new mongoose.Schema(
  {
    societyName: String,
    address: String,
    contact: String,
    ownerName: String,
    email: String,
    numBlocks: Number,
    city: String,
    pincode: Number,
    securityHead: String,
    registrationNumber: String,
    poster: String, // store the file path or URL
  },
  {
    timestamps: true,
  }
);

const Society = mongoose.model("Society", societySchema);
module.exports = { Society };
