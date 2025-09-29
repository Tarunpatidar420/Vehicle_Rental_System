// middleware/optionalAuth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalProtect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      console.log("Optional auth failed:", error.message);
      req.user = null; // ❌ zaroori hai, warna undefined rahega
    }
  } else {
    req.user = null; // ✅ agar guest hai
  }

  next();
};
