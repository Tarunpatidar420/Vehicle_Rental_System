// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import User from "../models/User.js";

// const router = express.Router();

// /* ================= REGISTER ================= */
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const role =
//       email === process.env.OWNER_EMAIL ? "owner" : "user";

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     const token = jwt.sign(
//       { id: user._id, role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ success: true, token });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//     });
//   }
// });

// /* ================= LOGIN ================= */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password, dashboardKey } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password required",
//       });
//     }

//     let user = await User.findOne({ email });

//     // 🔥 AUTO CREATE OWNER IF NOT EXISTS
//     if (!user && email === process.env.OWNER_EMAIL) {
//       if (dashboardKey !== process.env.DASHBOARD_KEY) {
//         return res.status(403).json({
//           success: false,
//           message: "Invalid dashboard key",
//         });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       user = await User.create({
//         name: "Owner",
//         email,
//         password: hashedPassword,
//         role: "owner",
//       });
//     }

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     if (user.role === "owner") {
//       if (dashboardKey !== process.env.DASHBOARD_KEY) {
//         return res.status(403).json({
//           success: false,
//           message: "Dashboard key required",
//         });
//       }
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ success: true, token });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Login failed",
//     });
//   }
// });

// export default router;

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === process.env.OWNER_EMAIL ? "owner" : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password, dashboardKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    let user = await User.findOne({ email });

    // AUTO CREATE OWNER
    if (!user && email === process.env.OWNER_EMAIL) {
      if (dashboardKey !== process.env.DASHBOARD_KEY) {
        return res.status(403).json({ success: false, message: "Invalid dashboard key" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: "Owner",
        email,
        password: hashedPassword,
        role: "owner",
      });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (user.role === "owner" && dashboardKey !== process.env.DASHBOARD_KEY) {
      return res.status(403).json({ success: false, message: "Dashboard key required" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // 🔥 Email sending logic yahan add kar sakte ho
    console.log("RESET TOKEN (for testing):", resetToken);

    res.json({
      success: true,
      message: "Password reset link sent to email",
      token: resetToken, // dev only
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Forgot password failed" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Reset password failed" });
  }
});

export default router;
