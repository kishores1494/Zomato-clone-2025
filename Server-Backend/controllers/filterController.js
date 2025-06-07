const Restaurant = require("../models/restaurantModel");

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

    let filter = {};

    if (mealtype) filter.mealtype_id = Number(mealtype);
    if (location) filter.location_id = Number(location);
    if (cuisine && cuisine.length > 0) {
      filter["cuisine.name"] = { $in: cuisine };
    }

    if (lcost !== undefined && hcost !== undefined) {
      filter.min_price = { $gte: lcost, $lte: hcost };
    }

    const perPage = 5;
    const skip = (page - 1) * perPage;

    const restaurants = await Restaurant.find(filter)
      .select(
        "_id name locality city mealtype_id location_id cuisine min_price image aggregate_rating contact_number rating_text thumb"
      )
      .sort({ min_price: sort })
      .skip(skip)
      .limit(perPage)
      .lean();

    res.json({ restaurants });
  } catch (error) {
    console.error("Error in filter API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
