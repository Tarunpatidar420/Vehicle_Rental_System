import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

// ✅ Generate JWT Token with proper payload
const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register User
// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Field check
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Password validation (6 to 8 chars + at least one special char)
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,8}$/;

    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message: "Password must be 6–8 characters long and include at least one special character (!@#$%^&*).",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id.toString());

    res.json({ success: true, token });
  } catch (error) {
    console.log("Register Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log("Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get User data using Token (JWT)
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log("GetUserData Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Cars for the Frontend
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json({ success: true, cars });
  } catch (error) {
    console.log("GetCars Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
