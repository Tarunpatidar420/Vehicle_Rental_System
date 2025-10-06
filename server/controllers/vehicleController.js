import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// =======================
// Helper: Check Availability
// =======================
const checkAvailability = async (car, pickupDate, returnDate) => {
  try {
    const bookings = await Booking.find({
      car: car._id,
      pickupDate: { $lte: returnDate },
      returnDate: { $gte: pickupDate },
      status: { $ne: "cancelled" }, // ✅ cancelled bookings ignore
    });

    // ✅ Agar already booked < car.availableCount hai to gaadi available hai
    return bookings.length < (car.availableCount || 1);
  } catch (err) {
    console.error("Error in checkAvailability:", err.message);
    return false;
  }
};

// =======================
// API: Get Available Vehicles (Public)
// =======================
export const getAvailableVehicles = async (req, res) => {
  try {
    let { pickupDate, returnDate } = req.query;

    // ✅ Dates ko safe parse karo
    if (pickupDate) pickupDate = new Date(pickupDate);
    if (returnDate) returnDate = new Date(returnDate);

    // ✅ Sirf cars jisme isAvailable true hai aur availableCount > 0 hai
    let cars = await Car.find({ isAvailable: true, availableCount: { $gt: 0 } });

    // ✅ Bookings ke hisaab se filter karo
    const availablePromises = cars.map(async (car) => {
      const start = pickupDate || new Date();
      const end =
        returnDate || new Date(Date.now() + 24 * 60 * 60 * 1000); // default 1 din
      const isAvailable = await checkAvailability(car, start, end);
      return isAvailable ? car : null;
    });

    cars = (await Promise.all(availablePromises)).filter((c) => c !== null);

    res.json({ success: true, cars });
  } catch (error) {
    console.error("Error in getAvailableVehicles:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
