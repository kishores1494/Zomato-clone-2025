const express = require("express");
const connectDB = require("../config/db");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("--- serverless index.js loaded ---");

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zc-frontend-5nqwb3ll0-kishores-projects-431a402e.vercel.app",
      "https://zomato-clone-kishore.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/restaurants", require("../routes/restaurantRoutes"));
app.use("/locations", require("../routes/locationRoutes"));
app.use("/mealtypes", require("../routes/mealTypeRoutes"));
app.use("/filter", require("../routes/filterRoutes"));
app.use("/menu", require("../routes/menuRoutes"));
app.use("/orders", require("../routes/orderRoutes"));
app.use("/payment", require("../routes/paymentRoutes"));
app.use("/auth", require("../routes/authRoutes"));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
connectDB().catch(err => {
  console.error("❌ MongoDB connection failed:", err);
});


module.exports = app;
module.exports.handler = serverless(app);