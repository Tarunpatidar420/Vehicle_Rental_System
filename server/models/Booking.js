import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // ✅ Booked Car
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // ✅ Owner of the Car
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Booking User (registered user ID, optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // ✅ Guest / User Details (always saved, even if user is logged in)
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },

    // ✅ Usage purpose
    vehicleUse: { type: String, required: true, trim: true },
    otherUse: { type: String, default: "", trim: true },

    // ✅ Booking dates
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    // ✅ Pricing
    price: { type: Number, default: 0, min: 0 },

    // ✅ Payment Method
    paymentMethod: {
      type: String,
      enum: ["offline", "googlepay", "paytm", "card"],
      default: "offline",
    },

    // ✅ Booking Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Index for faster availability & conflict checks
bookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
