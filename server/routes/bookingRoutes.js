import express from "express";
import { deleteBooking } from "../controllers/bookingController.js";
import {  
  checkAvailabilityOfCar, 
  createBooking, 
  getOwnerBookings, 
  getUserBookings,
  cancelBooking,   
  exchangeBookingVehicle,
  changeBookingStatus
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

// ✅ Availability check (sab ke liye)
bookingRouter.post("/check-availability", checkAvailabilityOfCar);

// ✅ Booking create (login required)
// ❌ Galat
// bookingRouter.post("/create", createBooking);

// ✅ Sahi
bookingRouter.post("/create", protect, createBooking);


// ✅ User bookings (sirf login hone par)
bookingRouter.get("/user", protect, getUserBookings);

// ✅ Owner bookings (login required + owner role)
bookingRouter.get("/owner", protect, getOwnerBookings);

// ✅ Change booking status (owner only)
bookingRouter.put("/change-status", protect, changeBookingStatus);


// ✅ Booking cancel (hard delete + count adjust)
bookingRouter.delete("/:id/cancel", protect, cancelBooking);

// ✅ Exchange booking (login required)
bookingRouter.put("/:id/exchange", protect, exchangeBookingVehicle);


bookingRouter.post("/delete", protect, deleteBooking);


export default bookingRouter;
