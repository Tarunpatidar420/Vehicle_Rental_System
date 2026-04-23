import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { currency, axios, isOwner } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);

  //  Date Formatter
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

  //  Fetch Owner Bookings
  const fetchOwnerBookings = async () => {
    if (!isOwner) return;

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("/api/bookings/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  //  Change Status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        "/api/bookings/change-status",
        { bookingId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Status updated");

        setBookings((prev) =>
          prev.map((item) =>
            item._id === bookingId ? { ...item, status } : item
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  //  Delete Booking
  const deleteBooking = async (bookingId) => {
    try {
      const ok = window.confirm(
        "Are you sure you want to delete this booking?"
      );

      if (!ok) return;

      const token = localStorage.getItem("token");

      const { data } = await axios.delete(
        `/api/bookings/delete/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        setBookings((prev) =>
          prev.filter((item) => item._id !== bookingId)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      <div className="max-w-6xl w-full rounded-md overflow-hidden border mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700 min-w-[900px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Date Range</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Details</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    No Bookings Found
                  </td>
                </tr>
              )}

              {bookings.map((booking) => (
                <React.Fragment key={booking._id}>
                  <tr className="border-t hover:bg-gray-50">
                    {/* Vehicle */}
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={
                          booking.car?.images?.[0] ||
                          "/default_car_image.png"
                        }
                        alt="car"
                        className="h-14 w-14 rounded object-cover"
                      />

                      <div>
                        {booking.car?.brand} {booking.car?.model}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-3">
                      {formatDate(booking.pickupDate)} <br />
                      to <br />
                      {formatDate(booking.returnDate)}
                    </td>

                    {/* Price */}
                    <td className="p-3 font-semibold">
                      {currency}
                      {booking.price}
                    </td>

                    {/* Payment */}
                    <td className="p-3">
                      {booking.paymentMethod}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          changeBookingStatus(
                            booking._id,
                            e.target.value
                          )
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="pending">
                          Pending
                        </option>
                        <option value="confirmed">
                          Confirmed
                        </option>
                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    {/* Show Details */}
                    <td className="p-3">
                      <button
                        onClick={() =>
                          setExpandedBooking(
                            expandedBooking === booking._id
                              ? null
                              : booking._id
                          )
                        }
                        className="text-blue-600 underline"
                      >
                        {expandedBooking === booking._id
                          ? "Hide Info"
                          : "Show Info"}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-3">
                      <button
                        onClick={() =>
                          deleteBooking(booking._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* Full User Details */}
                  {expandedBooking === booking._id && (
                    <tr>
                      <td
                        colSpan={7}
                        className="bg-gray-50 p-4 text-sm space-y-1"
                      >
                        <div>
                          <b>Name:</b> {booking.name}
                        </div>

                        <div>
                          <b>Email:</b> {booking.email}
                        </div>

                        <div>
                          <b>WhatsApp:</b>{" "}
                          {booking.whatsapp}
                        </div>

                        <div>
                          <b>Address:</b>{" "}
                          {booking.address}
                        </div>

                        <div>
                          <b>Pincode:</b>{" "}
                          {booking.pincode}
                        </div>

                        <div>
                          <b>Vehicle Use:</b>{" "}
                          {booking.vehicleUse}
                        </div>

                        {booking.otherUse && (
                          <div>
                            <b>Other Use:</b>{" "}
                            {booking.otherUse}
                          </div>
                        )}

                        <div>
                          <b>Booked On:</b>{" "}
                          {formatDate(
                            booking.createdAt,
                            true
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;