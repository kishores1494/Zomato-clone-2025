const express = require("express");
const router = express.Router();
const { getAllMealTypes } = require("../controllers/mealTypeController");

router.get("/", getAllMealTypes);

module.exports = router;
