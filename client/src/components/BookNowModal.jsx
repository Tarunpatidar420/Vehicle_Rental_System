// src/components/BookNowModal.jsx
import React, { useState } from "react";

const BookNowModal = ({ car, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    purpose: "",
    paymentMethod: "offline",
    otherPurpose: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // purpose check
    const finalData = {
      ...formData,
      purpose: formData.purpose === "other" ? formData.otherPurpose : formData.purpose,
    };
    onSubmit(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Book {car.brand} {car.model}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="whatsapp"
            placeholder="WhatsApp Number"
            value={formData.whatsapp}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          {/* Purpose */}
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Purpose</option>
            <option value="farming">Farming</option>
            <option value="transport">Transport</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>

          {formData.purpose === "other" && (
            <input
              type="text"
              name="otherPurpose"
              placeholder="Enter your purpose"
              value={formData.otherPurpose}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          )}

          {/* Payment */}
          <label className="block font-medium">Payment Method</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="offline"
                checked={formData.paymentMethod === "offline"}
                onChange={handleChange}
              />{" "}
              Offline
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="gpay"
                checked={formData.paymentMethod === "gpay"}
                onChange={handleChange}
              />{" "}
              Google Pay
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paytm"
                checked={formData.paymentMethod === "paytm"}
                onChange={handleChange}
              />{" "}
              Paytm
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />{" "}
              Card
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookNowModal;
