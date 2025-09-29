import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// =======================
// Car Populate Config
// =======================
const carPopulate = {
  path: "car",
  select: `
    brand model year categories seating_capacity fuel_type transmission
    pricePerDay availableCount isAvailable description images
    location.line1 location.line2 location.city location.state location.pincode
  `,
};

// =======================
// User Populate Config
// =======================
const userPopulate = {
  path: "user",
  select: "name email whatsapp address pincode",
};

// =======================
// Function: Check Availability (internal)
// =======================
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
    status: { $ne: "cancelled" },
  });
  return bookings.length === 0;
};

// =======================
// API: Check Availability
// =======================
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { pickupDate, returnDate } = req.body;
    const cars = await Car.find();

    const availableCars = await Promise.all(
      cars.map(async (c) => {
        const isAvailable = await checkAvailability(c._id, pickupDate, returnDate);
        return isAvailable ? c : null;
      })
    );

    res.json({
      success: true,
      availableCars: availableCars.filter((c) => c !== null),
    });
  } catch (error) {
    console.error("Check Availability Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Create Booking
// =======================
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user || {}; // guest ke liye null hoga
    const {
      car,
      pickupDate,
      returnDate,
      name,
      email,
      whatsapp,
      address,
      pincode,
      vehicleUse,
      otherUse,
      paymentMethod,
    } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.max(
      1,
      Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
    );
    const price = carData.pricePerDay * noOfDays;

    const booking = await Booking.create({
      car,
      owner: carData.owner,
      user: _id || null, // ✅ guest = null
      pickupDate,
      returnDate,
      price,
      status: "pending",
      name,
      email,
      whatsapp,
      address,
      pincode,
      vehicleUse,
      otherUse,
      paymentMethod: paymentMethod || "offline",
    });

    await booking.populate(carPopulate);
    await booking.populate(userPopulate);

    res.json({ success: true, message: "Booking Created", booking });
  } catch (error) {
    console.error("Create Booking Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: User Bookings (Guest + Logged-in)
// =======================
export const getUserBookings = async (req, res) => {
  try {
    let query = {};

    // ✅ Logged-in user
    if (req.user?._id) {
      query.user = req.user._id;
    }

    // ✅ Guest user (search by email/whatsapp if provided)
    if (req.query.email) {
      query.email = req.query.email;
    }
    if (req.query.whatsapp) {
      query.whatsapp = req.query.whatsapp;
    }

    if (Object.keys(query).length === 0) {
      return res.json({
        success: false,
        message: "User identifier (id/email/whatsapp) is required",
      });
    }

    const bookings = await Booking.find(query)
      .populate(carPopulate)
      .populate(userPopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("User Bookings Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Owner Bookings
// =======================
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user?.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate(carPopulate)
      .populate(userPopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Owner Bookings Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Change Booking Status
// =======================
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
      .populate(carPopulate)
      .populate(userPopulate);

    res.json({
      success: true,
      message: "Status Updated",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Change Status Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Cancel Booking
// =======================
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.user && booking.user.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cancelledBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    )
      .populate(carPopulate)
      .populate(userPopulate);

    await Car.findByIdAndUpdate(cancelledBooking.car._id, {
      $inc: { availableCount: 1 },
    });

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Exchange Booking Vehicle
// =======================
export const exchangeBookingVehicle = async (req, res) => {
  try {
    const { newCarId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.user && booking.user.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const newCar = await Car.findById(newCarId);
    if (!newCar) {
      return res.json({ success: false, message: "New car not found" });
    }

    const available = await checkAvailability(
      newCarId,
      booking.pickupDate,
      booking.returnDate
    );
    if (!available) {
      return res.json({
        success: false,
        message: "New car is not available in selected dates",
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { car: newCarId },
      { new: true }
    )
      .populate(carPopulate)
      .populate(userPopulate);

    res.json({
      success: true,
      message: "Car exchanged successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Exchange Booking Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
