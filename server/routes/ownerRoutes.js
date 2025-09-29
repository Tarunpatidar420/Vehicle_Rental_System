import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
  updateCar,   // ✅ import added
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// ✅ Role change
ownerRouter.post("/change-role", protect, changeRoleToOwner);

// ✅ Add Car (multiple images optional, max 5)
ownerRouter.post(
  "/add-car",
  protect,
  (req, res, next) => {
    upload.array("images", 5)(req, res, function (err) {
      if (err) {
        console.error("Multer Error in /add-car:", err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  addCar
);

// ✅ Get Owner Cars
ownerRouter.get("/cars", protect, getOwnerCars);

// ✅ Toggle Availability
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);

// ✅ Delete Car
ownerRouter.post("/delete-car", protect, deleteCar);

// ✅ Dashboard Data
ownerRouter.get("/dashboard", protect, getDashboardData);

// ✅ Update Profile Image
ownerRouter.post(
  "/update-image",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("Multer Error in /update-image:", err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  updateUserImage
);

// ✅ Update Car (full info)
ownerRouter.put(
  "/update-car/:id",
  protect,
  (req, res, next) => {
    upload.array("images", 5)(req, res, function (err) {
      if (err) {
        console.error("Multer Error in /update-car:", err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  updateCar
);

export default ownerRouter;
