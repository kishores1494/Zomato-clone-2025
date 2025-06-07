const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.initiatePayment = async (req, res) => {
  try {
    const { amount, customerId, email, mobileNo } = req.body;

    const options = {
      amount: parseInt(amount) * 100,
      currency: "INR",
      receipt: `receipt_${customerId}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
      customerId,
      email,
      mobileNo,
    });
  } catch (err) {
    console.error("❌ Razorpay error:", err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
};
