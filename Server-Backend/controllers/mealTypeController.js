const MealType = require("../models/MealType");

exports.getAllMealTypes = async (req, res) => {
  const mealTypes = await MealType.find();
  res.status(200).json({
    message: "Meal Types fetched successfully",
    mealTypes,
  });
};
