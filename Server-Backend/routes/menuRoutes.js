const express = require("express");
const router = express.Router();
const { getMenuByRestaurantId } = require("../controllers/menuController");

router.get(
  "/:restaurantId",
  (req, res, next) => {
    next();
  },
  getMenuByRestaurantId
);

module.exports = router;
