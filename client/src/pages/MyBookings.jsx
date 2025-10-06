import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBookings = () => {
  const { axios, token, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewCar, setViewCar] = useState(null);
  const [exchangeBooking, setExchangeBooking] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);

  // ✅ Fetch login user's bookings
  const fetchBookings = async () => {
    if (!token) {
      toast.error("Please login to view your bookings");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBookings(res.data.bookings || []);
      } else {
        toast.error(res.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  // ✅ Cancel Booking
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const { data } = await axios.delete(`/api/bookings/${bookingId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Booking cancelled successfully");
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancel Booking Error:", error);
      toast.error("Something went wrong while cancelling");
    }
  };

  // ✅ Open exchange modal and fetch available cars
  const openExchangeModal = async (booking) => {
    setExchangeBooking(booking);

    try {
      const { data } = await axios.get("/api/vehicles/available", {
        params: {
          pickupDate: booking.pickupDate,
          returnDate: booking.returnDate,
        },
      });

      if (data.success) {
        setAvailableCars(data.cars || []);
      } else {
        toast.error(data.message || "No cars available");
      }
    } catch (error) {
      console.error("Fetch Available Cars Error:", error);
      toast.error("Failed to fetch available cars");
    }
  };

  // ✅ Exchange Vehicle API
  const handleExchange = async (newCarId) => {
    try {
      const { data } = await axios.put(
        `/api/bookings/${exchangeBooking._id}/exchange`,
        { newCarId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Car exchanged successfully");
        setExchangeBooking(null);
        fetchBookings(); // refresh bookings
      } else {
        toast.error(data.message || "Exchange failed");
      }
    } catch (error) {
      console.error("Exchange Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Date formatter
  const formatDate = (date, withTime = false) => {
    if (!date) return "--";
    try {
      return new Date(date).toLocaleString(
        "en-IN",
        withTime
          ? { dateStyle: "medium", timeStyle: "short" }
          : { dateStyle: "medium" }
      );
    } catch {
      return "--";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"
      />

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Car Info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking.car?.images?.[0] || assets.no_image}
                  alt="car"
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {(booking.car?.brand || "Unknown")} {booking.car?.model || ""}
              </p>
              <p className="text-gray-500">
                Year: {booking.car?.year || "--"} • Category:{" "}
                {booking.car?.categories?.join(", ") || "--"} • Seats:{" "}
                {booking.car?.seating_capacity || "--"}
              </p>
            </div>

            {/* Booking Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : booking.status === "cancelled"
                      ? "bg-red-400/15 text-red-600"
                      : "bg-yellow-400/15 text-yellow-600"
                  }`}
                >
                  {booking.status || "pending"}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  alt="calendar"
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate?.split("T")[0] || "--"} To{" "}
                    {booking.returnDate?.split("T")[0] || "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* Price + Actions */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => openExchangeModal(booking)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Exchange Vehicle
                </button>

                {booking.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel Booking
                  </button>
                )}

                <button
                  onClick={() => setViewCar(booking.car)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  View Vehicle Info
                </button>
              </div>

              <div className="text-sm text-gray-500 text-right">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency}
                  {booking.price || "0"}
                </h1>
                <p>Booked on {booking.createdAt?.split("T")[0] || "--"}</p>
              </div>
            </div>
          </motion.div>
        ))
      )}

      {/* ✅ Vehicle Info Modal */}
      {viewCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {(viewCar?.brand || "Unknown")} {viewCar?.model || ""}
            </h2>

            {/* Images */}
            <div className="flex gap-2 overflow-x-auto mb-4">
              {viewCar?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="car"
                  className="h-32 w-48 rounded object-cover"
                />
              ))}
            </div>

            {/* Vehicle Info */}
            <h1 className="text-3xl font-bold text-primary mb-2">
              {currency}
              {viewCar?.pricePerDay || 0}/day
            </h1>

            <p><b>Seats:</b> {viewCar?.seating_capacity || "--"}</p>
            <p><b>Available Count:</b> {viewCar?.availableCount || "--"}</p>
            <p><b>Discount:</b> {viewCar?.discount || 0}%</p>
            <p><b>Fuel:</b> {viewCar?.fuel_type || "--"}</p>
            <p><b>Transmission:</b> {viewCar?.transmission || "--"}</p>
            <p><b>Category:</b> {viewCar?.categories?.join(", ") || "--"}</p>
            <p><b>Location:</b> {viewCar?.location?.line1}, {viewCar?.location?.line2}, {viewCar?.location?.city}, {viewCar?.location?.state} - {viewCar?.location?.pincode}</p>
            <p><b>Email:</b> {viewCar?.email || "--"}</p>
            <p><b>Whatsapp:</b> {viewCar?.whatsapp || "--"}</p>
            <p><b>Description:</b> {viewCar?.description || "--"}</p>

            {/* ✅ Added & Updated Date */}
            <p className="text-sm text-gray-500 mt-2">
              <b>Added On:</b> {formatDate(viewCar?.createdAt, true)} <br />
              <b>Last Updated:</b> {formatDate(viewCar?.updatedAt, true)}
            </p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewCar(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Exchange Modal */}
      {exchangeBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Exchange Booking #{exchangeBooking._id}
            </h2>

            {availableCars.length === 0 ? (
              <p className="text-gray-500">No cars available for this period.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableCars.map((car) => (
                  <div
                    key={car._id}
                    className="border p-3 rounded-lg flex flex-col"
                  >
                    <img
                      src={car.images?.[0] || assets.no_image}
                      alt={car.model}
                      className="h-32 w-full object-cover rounded mb-2"
                    />
                    <h3 className="font-medium">
                      {(car.brand || "Unknown")} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currency}
                      {car.pricePerDay}/day
                    </p>
                    <button
                      onClick={() => handleExchange(car._id)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Select This Car
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setExchangeBooking(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyBookings;
