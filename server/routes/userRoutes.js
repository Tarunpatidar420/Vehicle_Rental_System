
import express from "express";
import {
  getCars,
  getUserData,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();


   // AUTH ROUTES


// Register (normal user / owner both)
userRouter.post("/register", registerUser);

// Login 
userRouter.post("/login", loginUser);


   // PROTECTED ROUTES


// Get logged-in user data
userRouter.get("/data", protect, getUserData);


   


// Get all available vehicles 
userRouter.get("/cars", getCars);

export default userRouter;
