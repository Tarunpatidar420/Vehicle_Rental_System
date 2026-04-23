import express from "express";

import {
  checkAvailabilityOfCar,
  createBooking,
  getOwnerBookings,
  getUserBookings,
  cancelBooking,
  exchangeBookingVehicle,
  changeBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

// ==============================
//  Check Available Vehicles
// ==============================
bookingRouter.get(
  "/check-availability",
  protect,
  checkAvailabilityOfCar
);

// ==============================
//  Create Booking
// ==============================
bookingRouter.post(
  "/create",
  protect,
  createBooking
);

// ==============================
//  User Bookings
// ==============================
bookingRouter.get(
  "/user",
  protect,
  getUserBookings
);

// ==============================
//  Owner Bookings
// ==============================
bookingRouter.get(
  "/owner",
  protect,
  getOwnerBookings
);

// ==============================
//  Owner Change Status
// ==============================
bookingRouter.put(
  "/change-status",
  protect,
  changeBookingStatus
);

// ==============================
//  Cancel Booking (User)
// ==============================
bookingRouter.delete(
  "/:id/cancel",
  protect,
  cancelBooking
);

// ==============================
//  Exchange Vehicle
// ==============================
bookingRouter.put(
  "/:id/exchange",
  protect,
  exchangeBookingVehicle
);

// ==============================
//  Delete Cancelled Booking
// ==============================
bookingRouter.delete(
  "/delete/:id",
  protect,
  deleteBooking
);

export default bookingRouter;