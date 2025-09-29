import express from "express";
import { getAvailableVehicles } from "../controllers/vehicleController.js";
import Car from "../models/Car.js";

const router = express.Router();

// ✅ Available vehicles (list)
router.get("/available", getAvailableVehicles);

// ✅ Get single vehicle details by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);  // ✅ Car model use
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.json({ success: true, car });
  } catch (error) {
    console.error("Error fetching car:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;   // ✅ Correct export
