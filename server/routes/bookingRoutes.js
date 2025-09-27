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
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar);
bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.post('/change-status', protect, changeBookingStatus);

// 🔹 Better REST conventions
bookingRouter.put('/:id/cancel', protect, cancelBooking);
bookingRouter.put('/:id/exchange', protect, exchangeBookingVehicle);

export default bookingRouter;
