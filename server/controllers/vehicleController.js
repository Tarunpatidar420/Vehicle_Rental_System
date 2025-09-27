import Vehicle from "../models/Car.js";
import Booking from "../models/Booking.js";

// Helper function to check car availability for given dates
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
    status: { $ne: "cancelled" } // 👈 cancelled bookings ignore
  });
  return bookings.length === 0;
};

// ✅ Get Available Vehicles (with optional date filters)
export const getAvailableVehicles = async (req, res) => {
  try {
    const { pickupDate, returnDate } = req.query; // 👈 query params se date le lo

    // Pehle sirf active/available vehicles fetch karo
    let vehicles = await Vehicle.find({ status: "available" });

    if (pickupDate && returnDate) {
      // Agar date diya gaya hai to unke basis pe filter karo
      const availablePromises = vehicles.map(async (car) => {
        const isAvailable = await checkAvailability(
          car._id,
          pickupDate,
          returnDate
        );
        return isAvailable ? car : null;
      });

      vehicles = (await Promise.all(availablePromises)).filter((v) => v !== null);
    }

    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
