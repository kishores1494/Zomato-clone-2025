const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  restaurant_id: String,
  item_name: String,
  price: Number,
  user: String,
  timestamp: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
