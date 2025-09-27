import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
  car: { type: ObjectId, ref: "Car", required: true },   // ✅ Car reference
  user: { type: ObjectId, ref: "User", required: true }, // ✅ Booking करने वाला user
  owner: { type: ObjectId, ref: "User", required: true },// ✅ Vehicle का owner
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  },
  price: { type: Number, required: true }
}, { timestamps: true });

// ✅ OverwriteModelError से बचने का तरीका
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
