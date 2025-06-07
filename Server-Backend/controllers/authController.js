const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "Account created successfully",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");

      user = await User.create({
        username: name,
        email,
        password: randomPassword,
      });
    }

    res.status(200).json({
      message: "Google login successful",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Google login failed" });
  }
};
