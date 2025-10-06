import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // ✅ Booked Car Reference
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // ✅ Owner of the Car (car owner id)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Booking User (registered user)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // ✅ Guest / User Details (always saved)
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

    // ✅ Quantity (how many cars booked at once)
    quantity: { type: Number, default: 1, min: 1 },

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

// ✅ Indexes for fast availability checks
bookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1 });
bookingSchema.index({ owner: 1 });
bookingSchema.index({ user: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
