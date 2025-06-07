const mongoose = require("mongoose");

const mealTypeSchema = new mongoose.Schema(
  {
    name: String,
    content: String,
    image: String,
    meal_type: Number,
  },
  { collection: "mealType" }
);

module.exports = mongoose.model("MealType", mealTypeSchema);
