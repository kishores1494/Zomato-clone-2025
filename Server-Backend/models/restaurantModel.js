const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  _id: String,
  name: String,
  locality: String,
  city: String,
  mealtype_id: Number,
  location_id: Number,
  city_id: Number,
  cuisine: [
    {
      name: String,
    },
  ],
  min_price: Number,
  image: String,
  aggregate_rating: Number,
  rating_text: String,
  contact_number: Number,
  thumb: [String],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
