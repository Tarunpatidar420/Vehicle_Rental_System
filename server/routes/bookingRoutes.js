import express from "express";
import { 
  changeBookingStatus, 
  checkAvailabilityOfCar, 
  createBooking, 
  getOwnerBookings, 
  getUserBookings,
  cancelBooking,
  exchangeBookingVehicle
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";  // ✅ sirf protect use kar

const bookingRouter = express.Router();

// ✅ Availability check (sab ke liye)
bookingRouter.post("/check-availability", checkAvailabilityOfCar);

// ✅ Booking create (guest + logged in dono allowed)
bookingRouter.post("/create", createBooking);

// ✅ User bookings (sirf login hone par)
bookingRouter.get("/user", protect, getUserBookings);

// ✅ Owner bookings (login required + owner role)
bookingRouter.get("/owner", protect, getOwnerBookings);

// ✅ Status change (owner only)
bookingRouter.post("/change-status", protect, changeBookingStatus);

// ✅ Cancel booking (login required)
bookingRouter.put("/:id/cancel", protect, cancelBooking);

// ✅ Exchange booking (login required)
bookingRouter.put("/:id/exchange", protect, exchangeBookingVehicle);

export default bookingRouter;
