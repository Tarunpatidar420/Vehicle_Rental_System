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
    
// Sirf active cars (jo owner ne available rakhe hain)
let cars = await Car.find({ isAvailable: true });

// ✅ Always check availability if car has bookings
const availablePromises = cars.map(async (car) => {
  // Agar user ne dates diye hain to un dates ke hisaab se check karo
  // Warna aaj ki date ko reference lelo
  const start = pickupDate || new Date();
  const end = returnDate || new Date(Date.now() + 24 * 60 * 60 * 1000); // default 1 din
  const isAvailable = await checkAvailability(car, start, end);
  return isAvailable ? car : null;
});

cars = (await Promise.all(availablePromises)).filter((c) => c !== null);
  

    res.json({ success: true, cars });
  } catch (error) {
    console.error("Error in getAvailableVehicles:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
