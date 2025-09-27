import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema(
  {
    owner: { type: ObjectId, ref: "User", required: true },

    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1, // अगले साल तक valid
    },

    // ✅ Single + Multiple categories सपोर्ट
    categories: {
      type: [String],
      required: true,
      validate: (v) => v.length > 0,
    },

    seating_capacity: { type: Number, required: true, min: 1 },
    fuel_type: { type: String, required: true, trim: true },
    transmission: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 1 },

    // ✅ Location optional
    location: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    description: { type: String, default: "" },

    // ✅ Vehicle Count
    availableCount: { type: Number, required: true, default: 1, min: 0 },

    // ✅ Multiple Images सपोर्ट
    images: [{ type: String, default: "" }],

    // ✅ Status
    isAvailable: { type: Boolean, default: true },

    // ✅ Optional Contact Details
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ OverwriteModelError से बचने का तरीका
const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;
