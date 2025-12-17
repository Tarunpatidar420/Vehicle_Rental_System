// import express from "express";
// import { protect, requireOwner } from "../middleware/auth.js";
// import {
//   addCar,
//   changeRoleToOwner,
//   deleteCar,
//   getDashboardData,
//   getOwnerCars,
//   toggleCarAvailability,
//   updateUserImage,
//   updateCar,
// } from "../controllers/ownerController.js";
// import upload from "../middleware/multer.js";

// const ownerRouter = express.Router();

// // ✅ Change Role (only owner)
// ownerRouter.post("/change-role", protect, requireOwner, changeRoleToOwner);

// // ✅ Add Car (only owner)
// ownerRouter.post(
//   "/add-car",
//   protect,
//   requireOwner,
//   (req, res, next) => {
//     upload.array("images", 5)(req, res, function (err) {
//       if (err) {
//         console.error("Multer Error in /add-car:", err.message);
//         return res
//           .status(400)
//           .json({ success: false, message: err.message });
//       }
//       next();
//     });
//   },
//   addCar
// );

// // ✅ Get Owner Cars (only owner)
// ownerRouter.get("/cars", protect, requireOwner, getOwnerCars);

// // ✅ Toggle Availability (only owner)
// ownerRouter.post("/toggle-car", protect, requireOwner, toggleCarAvailability);

// // ✅ Delete Car (only owner)
// ownerRouter.post("/delete-car", protect, requireOwner, deleteCar);

// // ✅ Dashboard Data (only owner + dashboard key)
// ownerRouter.get("/dashboard", protect, requireOwner, getDashboardData);


// // ✅ Update Profile Image (only owner)
// ownerRouter.post(
//   "/update-image",
//   protect,
//   requireOwner,
//   (req, res, next) => {
//     upload.single("image")(req, res, function (err) {
//       if (err) {
//         console.error("Multer Error in /update-image:", err.message);
//         return res
//           .status(400)
//           .json({ success: false, message: err.message });
//       }
//       next();
//     });
//   },
//   updateUserImage
// );

// // ✅ Update Car (only owner)
// ownerRouter.put(
//   "/update-car/:id",
//   protect,
//   requireOwner,
//   (req, res, next) => {
//     upload.array("images", 5)(req, res, function (err) {
//       if (err) {
//         console.error("Multer Error in /update-car:", err.message);
//         return res
//           .status(400)
//           .json({ success: false, message: err.message });
//       }
//       next();
//     });
//   },
//   updateCar
// );

// export default ownerRouter;

import express from "express";
import { protect, requireOwner } from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
  updateCar,
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// ✅ CHANGE ROLE (login user + dashboard key check inside controller)
ownerRouter.post("/change-role", protect, changeRoleToOwner);

// ✅ Add Car (only owner)
ownerRouter.post(
  "/add-car",
  protect,
  requireOwner,
  upload.array("images", 5),
  addCar
);

// ✅ Get Owner Cars
ownerRouter.get("/cars", protect, requireOwner, getOwnerCars);

// ✅ Toggle Availability
ownerRouter.post("/toggle-car", protect, requireOwner, toggleCarAvailability);

// ✅ Delete Car
ownerRouter.post("/delete-car", protect, requireOwner, deleteCar);

// ✅ Dashboard Data
ownerRouter.get("/dashboard", protect, requireOwner, getDashboardData);

// ✅ Update Profile Image
ownerRouter.post(
  "/update-image",
  protect,
  requireOwner,
  upload.single("image"),
  updateUserImage
);

// ✅ Update Car
ownerRouter.put(
  "/update-car/:id",
  protect,
  requireOwner,
  upload.array("images", 5),
  updateCar
);

export default ownerRouter;
