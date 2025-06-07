const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  location_id: { type: Number, required: true, unique: true },
  country: { type: String, required: true },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
