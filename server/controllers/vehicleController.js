import Car from "../models/Car.js";   // ✅ Directly Car import
import Booking from "../models/Booking.js";

// Helper function to check car availability based on count
const checkAvailability = async (car, pickupDate, returnDate) => {
  try {
    const bookings = await Booking.find({
      car: car._id,
      pickupDate: { $lte: returnDate },
      returnDate: { $gte: pickupDate },
      status: { $ne: "cancelled" }, // Cancelled bookings ignore
    });

    // ✅ Agar booked < availableCount hai to car available hai
    return bookings.length < (car.availableCount || 1);
  } catch (err) {
    console.error("Error in checkAvailability:", err.message);
    return false;
  }
};

// ✅ Get Available Vehicles (with optional date filters)
export const getAvailableVehicles = async (req, res) => {
  try {
    let { pickupDate, returnDate } = req.query;

    // Dates ko safe parse karo
    if (pickupDate) pickupDate = new Date(pickupDate);
    if (returnDate) returnDate = new Date(returnDate);

    // Sirf active cars (jo owner ne available rakhe hain)
    let cars = await Car.find({ isAvailable: true });

    if (pickupDate && returnDate) {
      // Date diya gaya hai to check availability with count
      const availablePromises = cars.map(async (car) => {
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        return isAvailable ? car : null;
      });

      cars = (await Promise.all(availablePromises)).filter((c) => c !== null);
    }

    res.json({ success: true, cars });
  } catch (error) {
    console.error("Error in getAvailableVehicles:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
