import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ guest booking allowed
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },

    vehicleUse: { type: String, required: true },
    otherUse: { type: String },

    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    price: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["offline", "googlepay", "paytm", "card"],
      default: "offline",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
