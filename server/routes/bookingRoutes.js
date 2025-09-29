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

// ✅ Availability check
bookingRouter.post('/check-availability', checkAvailabilityOfCar);

// ✅ Booking create (guest + logged in both allowed)
bookingRouter.post('/create', createBooking);

// ✅ User bookings (login required)  --> /api/bookings/user
bookingRouter.get('/user', protect, getUserBookings);

// ✅ Owner bookings (login required, role=owner) --> /api/bookings/owner
bookingRouter.get('/owner', protect, getOwnerBookings);

// ✅ Status change (owner only) --> /api/bookings/change-status
bookingRouter.post('/change-status', protect, changeBookingStatus);

// ✅ Cancel booking --> /api/bookings/:id/cancel
bookingRouter.put('/:id/cancel', protect, cancelBooking);

// ✅ Exchange booking --> /api/bookings/:id/exchange
bookingRouter.put('/:id/exchange', protect, exchangeBookingVehicle);

export default bookingRouter;
