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
      max: new Date().getFullYear() + 1,
    },

    categories: {
      type: [String],
      required: true,
      validate: (v) => v.length > 0,
    },

    seating_capacity: { type: Number, required: true, min: 1 },
    fuel_type: { type: String, required: true, trim: true },
    transmission: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 1 },

    location: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    description: { type: String, default: "" },
    availableCount: { type: Number, required: true, default: 1, min: 0 },

    images: [{ type: String, default: "" }],
    isAvailable: { type: Boolean, default: true },

    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Hook: har save/update par isAvailable ko auto-set karo
carSchema.pre("save", function (next) {
  this.isAvailable = this.availableCount > 0;
  next();
});

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;
