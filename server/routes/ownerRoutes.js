
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


   // OWNER ONLY ROUTES



  //CHANGE ROLE → OWNER ONLY
 
ownerRouter.post(
  "/change-role",
  protect,
  requireOwner,
  changeRoleToOwner
);


  //ADD CAR
 
ownerRouter.post(
  "/add-car",
  protect,
  requireOwner,
  upload.array("images", 5),
  addCar
);


 //GET OWNER CARS
 
ownerRouter.get(
  "/cars",
  protect,
  requireOwner,
  getOwnerCars
);


  //TOGGLE CAR AVAILABILITY
 
ownerRouter.post(
  "/toggle-car",
  protect,
  requireOwner,
  toggleCarAvailability
);


 // DELETE CAR
 
ownerRouter.post(
  "/delete-car",
  protect,
  requireOwner,
  deleteCar
);


 //OWNER DASHBOARD DATA
 
ownerRouter.get(
  "/dashboard",
  protect,
  requireOwner,
  getDashboardData
);


 //UPDATE OWNER PROFILE IMAGE
 
ownerRouter.post(
  "/update-image",
  protect,
  requireOwner,
  upload.single("image"),
  updateUserImage
);


  //UPDATE CAR
 
ownerRouter.put(
  "/update-car/:id",
  protect,
  requireOwner,
  upload.array("images", 5),
  updateCar
);

export default ownerRouter;
