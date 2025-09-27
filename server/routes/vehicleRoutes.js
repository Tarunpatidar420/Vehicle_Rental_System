import express from "express";
import { getAvailableVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

// 👇 Ye route frontend ko available vehicles dega
router.get("/available", getAvailableVehicles);

export default router;
