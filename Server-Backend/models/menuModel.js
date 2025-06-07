const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  restaurant_id: String,
  name: String,
  price: Number,
  description: String,
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
