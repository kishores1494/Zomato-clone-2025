const express = require("express");
const router = express.Router();
const { initiatePayment } = require("../controllers/paymentController");

router.post("/paynow", initiatePayment);

router.post("/success", (req, res) => {
  res.send(`
    <h1>✅ Payment Successful</h1>
    <p>Thank you for your order. We'll get cooking!</p>
    <a href="http://localhost:5173/">Back to Home</a>
  `);
});

module.exports = router;
