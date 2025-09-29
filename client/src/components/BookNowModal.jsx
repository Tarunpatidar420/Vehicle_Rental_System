import React, { useState } from "react";
import axios from "axios";

const BookNowModal = ({ isOpen, onClose, car, pickupDate, returnDate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    address: "",
    pincode: "",
    vehicleUse: "", // ✅ backend ke sath sync
    paymentMethod: "offline", // ✅ lowercase backend ke sath match karega
  });

  // Input handle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Booking confirm
  const handleConfirmBooking = async () => {
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return date first!");
      return;
    }

    if (!car?._id) {
      alert("Car details not found!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings/create",
        {
          ...formData,
          car: car._id,
          pickupDate,
          returnDate,
        }
        // ❌ withCredentials hata diya kyunki bina login ke booking allow hai
      );

      if (res.data.success) {
        alert("Booking confirmed!");
        onClose();
      } else {
        alert(res.data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Error while creating booking");
    }
  };

  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Booking for {car?.brand || "Unknown"} {car?.model || ""}
        </h2>

        {/* Full Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full mb-2"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Whatsapp Number */}
        <input
          type="text"
          name="whatsapp"
          placeholder="Whatsapp Number"
          className="border p-2 w-full mb-2"
          value={formData.whatsapp}
          onChange={handleChange}
          required
        />

        {/* Address */}
        <textarea
          name="address"
          placeholder="Address"
          className="border p-2 w-full mb-2"
          value={formData.address}
          onChange={handleChange}
          required
        />

        {/* Pincode */}
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          className="border p-2 w-full mb-2"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        {/* Purpose of booking */}
        <input
          type="text"
          name="vehicleUse"
          placeholder="Purpose of booking"
          className="border p-2 w-full mb-2"
          value={formData.vehicleUse}
          onChange={handleChange}
          required
        />

        {/* Payment Method */}
        <select
          name="paymentMethod"
          className="border p-2 w-full mb-4"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="offline">Offline</option>
          <option value="googlepay">Google Pay</option>
          <option value="paytm">Paytm</option>
          <option value="card">Debit/Credit Card</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookNowModal;
