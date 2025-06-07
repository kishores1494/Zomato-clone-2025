const express = require("express");
const router = express.Router();
const { filterRestaurants } = require("../controllers/filterController");

router.post("/", filterRestaurants);

module.exports = router;
