import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// =======================
// Car Populate Config
// =======================
const carPopulate = {
  path: "car",
  select: `
    brand model year categories seating_capacity fuel_type transmission
    pricePerDay availableCount discount isAvailable description images
    location.line1 location.line2 location.city location.state location.pincode
    email whatsapp createdAt updatedAt
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
// Mail Transporter
// =======================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Car Rental" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("📧 Mail sent to:", to);
  } catch (err) {
    console.error("❌ Mail error:", err.message);
  }
};

// =======================
// API: Check Availability
// =======================
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    const availableCars = cars.filter((c) => c.availableCount > 0);

    res.json({ success: true, availableCars });
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
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Login required to book a car" });
    }

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

    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (carData.availableCount <= 0) {
      return res.json({ success: false, message: "Car is not available" });
    }

    // Price calculation
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.max(
      1,
      Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
    );
    const price = carData.pricePerDay * noOfDays;

    // Create booking
    const booking = await Booking.create({
      car,
      owner: carData.owner,
      user: req.user._id,
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

    // Reduce availableCount
    carData.availableCount -= 1;
    if (carData.availableCount <= 0) {
      carData.isAvailable = false;
    }
    await carData.save();

    await booking.populate(carPopulate);
    await booking.populate(userPopulate);

    res.json({ success: true, message: "Booking Created", booking });
  } catch (error) {
    console.error("Create Booking Error:", error.message);
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

    await Booking.deleteOne({ _id: req.params.id });

    // Increase count back
    const car = await Car.findById(booking.car);
    if (car) {
      car.availableCount += 1;
      car.isAvailable = true;
      await car.save();
    }

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel Booking Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Exchange Booking
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
    if (!newCar || newCar.availableCount <= 0) {
      return res.json({ success: false, message: "New car not available" });
    }

    // Return old car
    const oldCar = await Car.findById(booking.car);
    if (oldCar) {
      oldCar.availableCount += 1;
      oldCar.isAvailable = true;
      await oldCar.save();
    }

    // Decrease new car count
    newCar.availableCount -= 1;
    if (newCar.availableCount <= 0) {
      newCar.isAvailable = false;
    }
    await newCar.save();

    booking.car = newCarId;
    await booking.save();

    await booking.populate(carPopulate);
    await booking.populate(userPopulate);

    res.json({ success: true, message: "Car exchanged successfully", booking });
  } catch (error) {
    console.error("Exchange Booking Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Get User Bookings
// =======================
export const getUserBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, bookings: [] });
    }

    const bookings = await Booking.find({
      user: new mongoose.Types.ObjectId(req.user._id),
    })
      .populate(carPopulate)
      .populate(userPopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get User Bookings Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// API: Get Owner Bookings
// =======================
export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      owner: new mongoose.Types.ObjectId(req.user._id),
    })
      .populate(carPopulate)
      .populate(userPopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get Owner Bookings Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Change Booking Status
// =======================
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
      .populate(carPopulate)
      .populate(userPopulate);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // 📧 send emails only when confirmed
    if (status === "confirmed") {
      let ownerEmail = process.env.FALLBACK_OWNER_EMAIL || null;
      try {
        const ownerUser = await User.findById(booking.owner).select("email");
        if (ownerUser?.email) ownerEmail = ownerUser.email;
      } catch {}

      const userEmail = booking.email || booking.user?.email;
      const userName = booking.name || booking.user?.name;

      const car = booking.car;

      const pickupDate = new Date(booking.pickupDate).toLocaleString();
      const returnDate = new Date(booking.returnDate).toLocaleString();

      // Owner mail
      if (ownerEmail) {
        await sendMail({
          to: ownerEmail,
          subject: `New Booking Confirmed — ${car.brand} ${car.model}`,
          html: `
            <h2>New Booking Confirmed</h2>
            <p>Booking ID: ${booking._id}</p>
            <p>User: ${userName} (${userEmail})</p>
            <p>Pickup: ${pickupDate}</p>
            <p>Return: ${returnDate}</p>
            <p>Vehicle: ${car.brand} ${car.model} (${car.year})</p>
          `,
        });
      }

      // User mail
      if (userEmail) {
        await sendMail({
          to: userEmail,
          subject: `Your booking is confirmed — ${car.brand} ${car.model}`,
          html: `
            <h2>Your Booking is Confirmed</h2>
            <p>Booking ID: ${booking._id}</p>
            <p>Pickup: ${pickupDate}</p>
            <p>Return: ${returnDate}</p>
            <p>Total Price: ${booking.price}</p>
            <p>Vehicle: ${car.brand} ${car.model} (${car.year})</p>
          `,
        });
      }
    }

    res.json({ success: true, message: "Status updated", booking });
  } catch (error) {
    console.error("Change Booking Status Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================
// API: Delete Booking
// =======================
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID required" });
    }

    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
