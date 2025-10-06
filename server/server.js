import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./configs/db.js";

// ✅ Import Routes
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import vehicleRouter from "./routes/vehicleRoutes.js";
import contactRouter from "./routes/contactRoute.js"; // ✅ Contact form route
import authRouter from "./routes/authRoutes.js";



const app = express();

// ✅ Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect Database
await connectDB();

// ✅ Proper CORS Config
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Allow localhost (any port) + deployed frontend
      if (
        origin.startsWith("http://localhost:5173") ||
        origin.startsWith("http://localhost:5174") ||
        origin.startsWith("http://localhost:") || // any localhost port
        origin ===  "https://vehicalwalamain.onrender.com"
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Static folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.get("/", (req, res) => res.send("Server is running ✅"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/contact", contactRouter); // ✅ Added contact route
app.use("/api/auth", authRouter);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
