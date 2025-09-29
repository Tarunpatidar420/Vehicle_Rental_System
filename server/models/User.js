import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["owner", "user"],
    default: "user",
  },
  image: { type: String, default: "" },

  // ✅ New fields for booking info
  whatsapp: { type: String, default: "" },
  address: { type: String, default: "" },
  pincode: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
