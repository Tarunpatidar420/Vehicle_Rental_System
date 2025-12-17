// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ success: false, message: "Not authorized" });
//   }

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ find user
//     req.user = await User.findById(decoded.id || decoded._id).select("-password");
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: "Not authorized" });
//   }
// };

// // ✅ Owner check middleware (Dashboard access)
// export const requireOwner = (req, res, next) => {
//   const ownerEmail = process.env.OWNER_EMAIL;
//   const dashboardKey = process.env.DASHBOARD_KEY;

//   // ✅ Owner check with dashboardKey
//   if (
//     req.user?.email === ownerEmail &&
//     req.headers["x-dashboard-key"] === dashboardKey
//   ) {
//     return next();
//   }

//   return res.status(403).json({
//     success: false,
//     message: "Access denied: Only owner with valid key can access dashboard",
//   });
// };

// // ✅ Admin check (optional if you want to give admin rights too)
// export const requireAdmin = (req, res, next) => {
//   if (req.user?.role === "admin") {
//     return next();
//   }
//   return res.status(403).json({
//     success: false,
//     message: "Access denied: Admins only",
//   });
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ===========================
   🔐 PROTECT (JWT VERIFY)
=========================== */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ IMPORTANT FIX: always use decoded._id
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

/* ===========================
   👑 OWNER DASHBOARD ACCESS
=========================== */
export const requireOwner = (req, res, next) => {
  const ownerEmail = process.env.OWNER_EMAIL;
  const dashboardKey = process.env.DASHBOARD_KEY;

  // ✅ SAME logic as before (dashboard key preserved)
  if (
    req.user &&
    req.user.email === ownerEmail &&
    req.headers["x-dashboard-key"] === dashboardKey
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied: Owner only",
  });
};
