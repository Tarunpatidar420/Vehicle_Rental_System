import vehicleRouter from "./routes/vehicleRoutes.js";

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express();

// Connect Database
await connectDB();

// ✅ Proper CORS Config
app.use(cors({
  origin: [
    "http://localhost:5173",                 // local frontend
    "https://carrentalfull-main.onrender.com" // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Server is running ✅"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/vehicles", vehicleRouter);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
