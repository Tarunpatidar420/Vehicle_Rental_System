import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ find user
    req.user = await User.findById(decoded.id || decoded._id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};

// ✅ Owner check middleware (Dashboard access)
export const requireOwner = (req, res, next) => {
  const ownerEmail = process.env.OWNER_EMAIL;
  const dashboardKey = process.env.DASHBOARD_KEY;

  // ✅ Owner check with dashboardKey
  if (
    req.user?.email === ownerEmail &&
    req.headers["x-dashboard-key"] === dashboardKey
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied: Only owner with valid key can access dashboard",
  });
};

// ✅ Admin check (optional if you want to give admin rights too)
export const requireAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied: Admins only",
  });
};
