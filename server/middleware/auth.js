import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>" se token nikalna

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ verify token
    req.user = await User.findById(decoded.id).select("-password"); // decoded me user id hona chahiye
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};
