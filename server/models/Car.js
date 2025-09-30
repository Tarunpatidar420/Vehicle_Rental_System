import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema(
  {
    // ✅ Owner reference
    owner: { type: ObjectId, ref: "User", required: true },

    // ✅ Brand (multi-brand support)
    brand: {
      type: [String],
      required: true,
      validate: (v) => v.length > 0,
      set: (v) => v.map((b) => b.trim().toLowerCase()), // normalize
    },

    model: { type: String, required: true, trim: true },

    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },

    categories: {
      type: [String],
      required: true,
      validate: (v) => v.length > 0,
      set: (v) => v.map((c) => c.trim().toLowerCase()), // normalize
    },

    seating_capacity: { type: Number, required: true, min: 1 },
    fuel_type: { type: String, required: true, trim: true },
    transmission: { type: String, required: true, trim: true },

    pricePerDay: { type: Number, required: true, min: 1 },

    discount: { type: Number, default: 0, min: 0, max: 100 },

    // ✅ Kitni gaadi physically hai (stock count)
    availableCount: { type: Number, required: true, default: 1, min: 0 },

    location: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    description: { type: String, default: "" },

    images: {
      type: [String],
      default: [],
      validate: (v) => v.length <= 4,
    },

    // ✅ runtime update based on stock
    isAvailable: { type: Boolean, default: true },

    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Auto-update isAvailable before save
carSchema.pre("save", function (next) {
  this.isAvailable = this.availableCount > 0;
  next();
});

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);
export default Car;
