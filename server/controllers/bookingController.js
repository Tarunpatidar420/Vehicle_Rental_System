import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return bookings.length === 0;
};

// =======================
// API: Check Availability
// =======================
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    const cars = await Car.find({ location, isAvaliable: true });

    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Create Booking
// =======================
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res.json({ success: true, message: "Booking Created" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: User Bookings
// =======================
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Owner Bookings
// =======================
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Change Booking Status (Owner Only)
// =======================
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Cancel Booking
// =======================
// =======================
// API: Cancel Booking (Hard Delete)
// =======================
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // ✅ Sirf wahi user cancel kar sake jiska booking hai
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // ✅ Car ko available kar do
    await Car.findByIdAndUpdate(booking.car, { isAvaliable: true });

    // ✅ Booking ko DB se hata do (hard delete)
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Booking cancelled & removed permanently" });
  } catch (error) {
    console.log("Cancel Booking Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


// =======================
// API: Exchange Booking Vehicle
// =======================
export const exchangeBookingVehicle = async (req, res) => {
  try {
    const { newVehicleId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const newCar = await Car.findById(newVehicleId);
    if (!newCar) {
      return res.json({ success: false, message: "New vehicle not found" });
    }

    // ❌ Availability aur price check hata diya
    const oldCar = booking.car;
    booking.car = newVehicleId;
    await booking.save();

    // Update availability (optional)
    await Car.findByIdAndUpdate(oldCar, { isAvaliable: true });
    await Car.findByIdAndUpdate(newVehicleId, { isAvaliable: false });

    res.json({
      success: true,
      message: "Vehicle exchanged successfully",
      booking,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
