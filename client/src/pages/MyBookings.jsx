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
  const [exchangeBooking, setExchangeBooking] =
    useState(null);
  const [availableCars, setAvailableCars] =
    useState([]);

  // ======================
  // Fetch Bookings
  // ======================
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        "/api/bookings/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  // ======================
  // Cancel Booking
  // ======================
  const handleCancel = async (
    bookingId
  ) => {
    const ok = window.confirm(
      "Cancel this booking?"
    );

    if (!ok) return;

    try {
      const { data } =
        await axios.delete(
          `/api/bookings/${bookingId}/cancel`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (data.success) {
        toast.success(
          "Booking cancelled"
        );
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(
        "Cancel failed"
      );
    }
  };

  // ======================
  // Delete Booking
  // ======================
  const deleteBooking = async (
    bookingId
  ) => {
    const ok = window.confirm(
      "Delete this cancelled booking?"
    );

    if (!ok) return;

    try {
      const { data } =
        await axios.delete(
          `/api/bookings/delete/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (data.success) {
        toast.success(
          "Booking deleted"
        );
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(
        "Delete failed"
      );
    }
  };

  // ======================
  // Open Exchange Modal
  // ======================
  const openExchangeModal =
    async (booking) => {
      if (
        booking.status ===
        "cancelled"
      )
        return;

      setExchangeBooking(
        booking
      );

      try {
        const { data } =
          await axios.get(
            "/api/bookings/check-availability",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (data.success) {
          setAvailableCars(
            data.availableCars || []
          );
        }
      } catch {
        toast.error(
          "No vehicles available"
        );
      }
    };

  // ======================
  // Exchange Vehicle
  // ======================
  const handleExchange = async (
    newCarId
  ) => {
    try {
      const { data } =
        await axios.put(
          `/api/bookings/${exchangeBooking._id}/exchange`,
          { newCarId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (data.success) {
        toast.success(
          "Vehicle exchanged"
        );
        setExchangeBooking(
          null
        );
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(
        "Exchange failed"
      );
    }
  };

  const formatDate = (
    date
  ) => {
    if (!date) return "--";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN"
    );
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"
      />

      {/* Loading */}
      {loading ? (
        <p className="mt-10 text-center">
          Loading...
        </p>
      ) : bookings.length ===
        0 ? (
        <p className="mt-10 text-center">
          No bookings found
        </p>
      ) : (
        bookings.map(
          (
            booking,
            index
          ) => (
            <div
              key={
                booking._id
              }
              className="grid grid-cols-1 md:grid-cols-4 gap-6 border rounded-xl p-6 mt-6"
            >
              {/* Vehicle */}
              <div>
                <img
                  src={
                    booking.car
                      ?.images?.[0] ||
                    assets.no_image
                  }
                  alt="car"
                  className="rounded-lg aspect-video object-cover"
                />

                <h2 className="text-xl font-semibold mt-3">
                  {
                    booking
                      .car
                      ?.brand
                  }{" "}
                  {
                    booking
                      .car
                      ?.model
                  }
                </h2>

                <p className="text-gray-500">
                  Year:{" "}
                  {
                    booking
                      .car
                      ?.year
                  }
                </p>
              </div>

              {/* Booking Info */}
              <div className="md:col-span-2">
                <div className="flex gap-2 items-center">
                  <span className="px-3 py-1 bg-gray-100 rounded">
                    Booking #
                    {index +
                      1}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status ===
                      "confirmed"
                        ? "bg-green-100 text-green-600"
                        : booking.status ===
                          "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {
                      booking.status
                    }
                  </span>
                </div>

                <p className="mt-5 text-gray-500">
                  Rental Period:
                </p>

                <p className="font-medium">
                  {formatDate(
                    booking.pickupDate
                  )}{" "}
                  To{" "}
                  {formatDate(
                    booking.returnDate
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-3">
                  {/* Exchange */}
                  <button
                    disabled={
                      booking.status ===
                      "cancelled"
                    }
                    onClick={() =>
                      openExchangeModal(
                        booking
                      )
                    }
                    className={`py-3 rounded-lg text-white ${
                      booking.status ===
                      "cancelled"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {booking.status ===
                    "cancelled"
                      ? "Exchange Disabled"
                      : "Exchange Vehicle"}
                  </button>

                  {/* Cancel */}
                  {booking.status !==
                    "cancelled" && (
                    <button
                      onClick={() =>
                        handleCancel(
                          booking._id
                        )
                      }
                      className="py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {/* Delete */}
                  {booking.status ===
                    "cancelled" && (
                    <button
                      onClick={() =>
                        deleteBooking(
                          booking._id
                        )
                      }
                      className="py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Booking
                    </button>
                  )}

                  {/* View Vehicle */}
                  <button
                    onClick={() =>
                      setViewCar(
                        booking.car
                      )
                    }
                    className="py-3 rounded-lg bg-slate-700 hover:bg-slate-800 text-white"
                  >
                    View Vehicle Info
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-gray-500">
                    Total Price
                  </p>

                  <h2 className="text-3xl font-bold text-blue-600">
                    {currency}
                    {
                      booking.price
                    }
                  </h2>

                  <p className="text-gray-500">
                    Booked on{" "}
                    {formatDate(
                      booking.createdAt
                    )}
                  </p>
                </div>
              </div>
            </div>
          )
        )
      )}

      {/* =======================
          VIEW VEHICLE MODAL
      ======================= */}
      {viewCar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                {viewCar.brand}{" "}
                {viewCar.model}
              </h2>

              <button
                onClick={() =>
                  setViewCar(
                    null
                  )
                }
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {viewCar.images?.map(
                (
                  img,
                  i
                ) => (
                  <img
                    key={i}
                    src={img}
                    alt="vehicle"
                    className="w-full h-56 object-cover rounded-lg"
                  />
                )
              )}
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-4 text-sm">

              <p>
                <b>Brand:</b>{" "}
                {viewCar.brand}
              </p>

              <p>
                <b>Model:</b>{" "}
                {viewCar.model}
              </p>

              <p>
                <b>Year:</b>{" "}
                {viewCar.year}
              </p>

              <p>
                <b>Fuel:</b>{" "}
                {viewCar.fuel_type}
              </p>

              <p>
                <b>Transmission:</b>{" "}
                {
                  viewCar.transmission
                }
              </p>

              <p>
                <b>Seats:</b>{" "}
                {
                  viewCar.seating_capacity
                }
              </p>

              <p>
                <b>Price/Day:</b>{" "}
                ₹
                {
                  viewCar.pricePerDay
                }
              </p>

              <p>
                <b>Available:</b>{" "}
                {
                  viewCar.availableCount
                }
              </p>

              <p>
                <b>Email:</b>{" "}
                {viewCar.email}
              </p>

              <p>
                <b>Whatsapp:</b>{" "}
                {
                  viewCar.whatsapp
                }
              </p>

              <p className="md:col-span-2">
                <b>Description:</b>{" "}
                {viewCar.description ||
                  "--"}
              </p>

              <p className="md:col-span-2">
                <b>Location:</b>{" "}
                {
                  viewCar.location
                    ?.line1
                }
                ,{" "}
                {
                  viewCar.location
                    ?.line2
                }
                ,{" "}
                {
                  viewCar.location
                    ?.city
                }
                ,{" "}
                {
                  viewCar.location
                    ?.state
                }{" "}
                -{" "}
                {
                  viewCar.location
                    ?.pincode
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =======================
          EXCHANGE MODAL
      ======================= */}
      {exchangeBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">

            <h2 className="text-xl font-bold mb-5">
              Select New
              Vehicle
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {availableCars.map(
                (car) => (
                  <div
                    key={
                      car._id
                    }
                    className="border rounded-lg p-3"
                  >
                    <img
                      src={
                        car
                          .images?.[0]
                      }
                      alt="car"
                      className="h-40 w-full object-cover rounded"
                    />

                    <h3 className="font-semibold mt-2">
                      {
                        car.brand
                      }{" "}
                      {
                        car.model
                      }
                    </h3>

                    <p className="text-gray-500">
                      {currency}
                      {
                        car.pricePerDay
                      }
                      /day
                    </p>

                    <button
                      onClick={() =>
                        handleExchange(
                          car._id
                        )
                      }
                      className="mt-3 w-full bg-blue-500 text-white py-2 rounded"
                    >
                      Select
                    </button>
                  </div>
                )
              )}
            </div>

            <button
              onClick={() =>
                setExchangeBooking(
                  null
                )
              }
              className="mt-5 px-5 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyBookings;