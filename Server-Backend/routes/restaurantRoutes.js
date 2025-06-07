const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/", restaurantController.getAllRestaurants);

router.get("/:id", restaurantController.getRestaurantById);

router.get(
  "/filter/restaurants",
  restaurantController.getRestaurantsByLocation
);

module.exports = router;
