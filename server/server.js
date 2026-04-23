import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./configs/db.js";

import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

//  Import Routes
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import vehicleRouter from "./routes/vehicleRoutes.js";
import contactRouter from "./routes/contactRoute.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

//  Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Connect to MongoDB
await connectDB();

//  Improved & Safe CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://myvehicalclient.onrender.com" //  CORRECT FRONTEND URL
];



app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // For Postman, mobile apps, etc.
      if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:"))
        return callback(null, true);
      console.warn(` Blocked CORS request from: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, //  Needed for cookies or JWT via headers
  })
);

//  Core Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//  Static file serving (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Health Check Route
app.get("/", (req, res) => {
  res.status(200).send(" Smart Vehicle Backend Running Successfully ✅");
});

//  Register API Routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);

//  Global Error Handler (for debugging in Render)
app.use((err, req, res, next) => {
  console.error(" Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//  Handle Unmatched Routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//  Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` VehicalWala Backend running on port ${PORT}`);
  console.log(` Frontend allowed: ${allowedOrigins.join(", ")}`);
});
