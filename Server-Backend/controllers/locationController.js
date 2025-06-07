const Location = require("../models/Location");

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();

    res
      .status(200)
      .json({ message: "All Locations fetched successfully", locations });
  } catch (err) {
    res.status(500).json({ message: "Error fetching locations" });
  }
};
