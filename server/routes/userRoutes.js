// import express from "express";
// import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController.js";
// import { protect } from "../middleware/auth.js";

// const userRouter = express.Router();

// userRouter.post('/register', registerUser)
// userRouter.post('/login', loginUser)
// userRouter.get('/data', protect, getUserData)
// userRouter.get('/cars', getCars)

// export default userRouter;
import express from "express";
import {
  getCars,
  getUserData,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

/* ===============================
   👤 AUTH ROUTES
================================ */

// Register (normal user / owner both)
userRouter.post("/register", registerUser);

// Login (owner dashboard key logic backend me hi handle hota hai)
userRouter.post("/login", loginUser);

/* ===============================
   🔐 PROTECTED ROUTES
================================ */

// Get logged-in user data
userRouter.get("/data", protect, getUserData);

/* ===============================
   🚗 PUBLIC ROUTES
================================ */

// Get all available cars (no login required)
userRouter.get("/cars", getCars);

export default userRouter;
