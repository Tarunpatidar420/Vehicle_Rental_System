import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBookings = () => {
  const { axios, token, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);

  // ✅ Fetch login user's bookings
  const fetchBookings = async () => {
    if (!token) {
      toast.error("Please login to view your bookings");
      return;
    }

    try {
      const res = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ backticks fixed
      });

      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        toast.error(res.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // ✅ Cancel Booking
  // ✅ Cancel Booking (Hard Delete)
const handleCancel = async (bookingId) => {
  if (!window.confirm("Are you sure you want to delete this booking?")) return;

  // ⏳ UI se turant hata do
  setBookings((prev) => prev.filter((b) => b._id !== bookingId));

  try {
    const { data } = await axios.delete(
      `/api/bookings/${bookingId}/cancel`,  // 👈 delete request
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success("Booking deleted successfully");
    } else {
      toast.error(data.message || "Failed to delete booking");
      fetchBookings(); // rollback in case of error
    }
  } catch (error) {
    toast.error(error.message);
    fetchBookings();
  }
};

  // ✅ Exchange Vehicle
  const handleExchange = (bookingId) => {
    window.location.href = `/?exchangeBookingId=${bookingId}`; // ✅ backticks fixed
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

      <div>
        {bookings.length === 0 ? (
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
                  {booking.car?.brand || "Unknown"} {booking.car?.model || ""}
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
                    onClick={() => handleExchange(booking._id)}
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
      </div>
    </motion.div>
  );
};

export default MyBookings;
