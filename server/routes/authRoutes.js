// server/routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Register error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
});

// ✅ Login User (with owner dashboard key check)
router.post("/login", async (req, res) => {
  try {
    const { email, password, dashboardKey } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Special check for owner
    if (email === process.env.OWNER_EMAIL) {
      if (dashboardKey !== process.env.DASHBOARD_KEY) {
        return res.status(403).json({
          success: false,
          message: "Dashboard Access Key required or incorrect",
        });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      message:
        email === process.env.OWNER_EMAIL
          ? "Owner login successful"
          : "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
});

export default router;
