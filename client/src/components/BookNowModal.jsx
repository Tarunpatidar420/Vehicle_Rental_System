import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const BookNowModal = ({ isOpen, onClose, car, pickupDate, returnDate }) => {
  const { token, axios } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    address: "",
    pincode: "",
    vehicleUse: "",
    paymentMethod: "offline",
  });

  // Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    //  Required checks
    if (!pickupDate || !returnDate) {
      return alert("Please select pickup and return date first!");
    }

    if (!car?._id) {
      return alert("Car details not found!");
    }

    if (!token) {
      return alert("Please login first to book a vehicle!");
    }

    //  Date validation
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (picked < today) {
      return alert("Pickup date cannot be in the past");
    }

    if (returned <= picked) {
      return alert("Return date must be after pickup date");
    }

    //  Form validation (basic)
    const { name, email, whatsapp, address, pincode, vehicleUse } = formData;

    if (!name || !email || !whatsapp || !address || !pincode || !vehicleUse) {
      return alert("Please fill all required fields");
    }

    try {
      const { data } = await axios.post(
        "/api/bookings/create",
        {
          ...formData,
          car: car._id,
          pickupDate,
          returnDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, //  IMPORTANT
          },
        }
      );

      if (data.success) {
        alert("Booking confirmed successfully!");

        // Reset form
        setFormData({
          name: "",
          email: "",
          whatsapp: "",
          address: "",
          pincode: "",
          vehicleUse: "",
          paymentMethod: "offline",
        });

        onClose();
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Booking for {car.brand} {car.model}
        </h2>

        {/* User Inputs */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full mb-2"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="Whatsapp Number"
          className="border p-2 w-full mb-2"
          value={formData.whatsapp}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          className="border p-2 w-full mb-2"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          className="border p-2 w-full mb-2"
          value={formData.pincode}
          onChange={handleChange}
        />

        <input
          type="text"
          name="vehicleUse"
          placeholder="Purpose of booking"
          className="border p-2 w-full mb-2"
          value={formData.vehicleUse}
          onChange={handleChange}
        />

        <select
          name="paymentMethod"
          className="border p-2 w-full mb-4"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="offline">Offline</option>
          <option value="googlepay">Google Pay</option>
          <option value="paytm">Paytm</option>
          <option value="card">Debit / Credit Card</option>
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