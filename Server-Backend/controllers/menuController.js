const Menu = require("../models/menuModel");

const getMenuByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const trimmedId = restaurantId.trim();

    const menu = await Menu.find({ restaurant_id: restaurantId.trim() });

    if (!menu || menu.length === 0) {
      return res
        .status(404)
        .json({ message: `No menu found for restaurant ${trimmedId}` });
    }

    res.status(200).json({ menu });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getMenuByRestaurantId,
};
