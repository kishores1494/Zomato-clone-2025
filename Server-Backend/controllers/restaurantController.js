const Restaurant = require("../models/restaurantModel");
const mongoose = require("mongoose");

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res
      .status(200)
      .json({ message: "All Restaurants fetched successfully", restaurants });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const id = req.params.id;

    const restaurant = await Restaurant.findOne({ _id: id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    res.status(200).json({
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (err) {
    console.error(`Error fetching restaurant with ID ${req.params.id}:`, err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getRestaurantsByLocation = async (req, res) => {
  try {
    const locationId = parseInt(req.query.locationId);

    const restaurants = await Restaurant.find({ location_id: locationId });

    res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurants,
    });
  } catch (error) {
    console.error("Error filtering restaurants:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.filterRestaurants = async (req, res) => {
  try {
    const {
      mealtype,
      location,
      cuisine,
      lcost,
      hcost,
      sort = 1,
      page = 1,
    } = req.body;

    const filter = {};
    if (mealtype) filter.mealtype_id = Number(mealtype);
    if (location) filter.location_id = Number(location);
    if (cuisine && cuisine.length > 0) filter["cuisine.id"] = { $in: cuisine };
    if (lcost !== undefined && hcost !== undefined) {
      filter.min_price = { $gte: lcost, $lte: hcost };
    }

    const sortOption = { min_price: sort === 1 ? 1 : -1 };
    const limit = 2;
    const skip = (page - 1) * limit;

    const [restaurants, totalCount] = await Promise.all([
      Restaurant.find(filter).sort(sortOption).skip(skip).limit(limit),
      Restaurant.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Filtered restaurants fetched successfully",
      restaurants,
      totalCount,
    });
  } catch (err) {
    console.error("Error in filterRestaurants:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
