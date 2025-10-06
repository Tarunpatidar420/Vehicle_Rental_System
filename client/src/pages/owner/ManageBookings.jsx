import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { currency, axios, isOwner } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);

  // ✅ Safe date formatter
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

  // ✅ Fetch owner bookings
  const fetchOwnerBookings = async () => {
    if (!isOwner) return;
    try {
      const { data } = await axios.get("/api/bookings/owner");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Change booking status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.put("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (data.success) {
        toast.success(data.message || "Status updated");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Delete booking
  const deleteBooking = async (bookingId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this booking?"))
        return;

      const { data } = await axios.delete(`/api/bookings/${bookingId}/cancel`);

      if (data.success) {
        toast.success(data.message);
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
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

      {/* ✅ Mobile Friendly Wrapper */}
      <div className="max-w-5xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-[700px]">
            <thead className="text-gray-500 bg-gray-100">
              <tr>
                <th className="p-3 font-medium">Vehicle</th>
                <th className="p-3 font-medium max-md:hidden">Date Range</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium max-md:hidden">Payment</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Details</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-400">
                    No bookings found
                  </td>
                </tr>
              )}

              {bookings.map((b) => (
                <React.Fragment key={b._id}>
                  <tr className="border-t border-borderColor hover:bg-gray-50">
                    {/* Vehicle info */}
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={b.car?.images?.[0] || "/default_car_image.png"}
                        alt={b.car?.model || "Vehicle"}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="max-md:hidden">
                        <div className="font-medium">
                          {b.car?.brand || "Unknown"} {b.car?.model || ""}
                        </div>
                        <div className="text-xs text-gray-500">
                          {b.car?.year || "--"} • {b.car?.categories?.join(", ") || "--"} • Seats:{" "}
                          {b.car?.seating_capacity || "--"}
                        </div>
                      </div>
                    </td>

                    {/* Date Range */}
                    <td className="p-3 max-md:hidden">
                      {formatDate(b.pickupDate)} to {formatDate(b.returnDate)}
                    </td>

                    {/* Total price */}
                    <td className="p-3 font-semibold text-gray-800">
                      {currency}{b.price || 0}
                    </td>

                    {/* Payment */}
                    <td className="p-3 max-md:hidden">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs capitalize">
                        {b.paymentMethod || "offline"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <select
                        value={(b.status || "pending").toLowerCase()}
                        onChange={(e) => changeBookingStatus(b._id, e.target.value)}
                        className="px-2 py-1 text-gray-700 border border-borderColor rounded-md outline-none text-xs sm:text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Expand/Collapse */}
                    <td className="p-3">
                      <button
                        onClick={() => setExpandedBooking(expandedBooking === b._id ? null : b._id)}
                        className="text-blue-500 underline text-xs sm:text-sm"
                      >
                        {expandedBooking === b._id ? "Hide Info" : "Show Info"}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-3">
                      <button
                        onClick={() => deleteBooking(b._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-xs sm:text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* Expanded User & Booking Details */}
                  {expandedBooking === b._id && (
                    <tr className="bg-gray-50 text-gray-600">
                      <td colSpan={7} className="p-3 text-xs space-y-1">
                        <div><strong>Name:</strong> {b.name || b.user?.name || "--"}</div>
                        <div><strong>Email:</strong> {b.email || b.user?.email || "--"}</div>
                        <div><strong>Whatsapp:</strong> {b.whatsapp || b.user?.whatsapp || "--"}</div>
                        <div><strong>Address:</strong> {b.address || b.user?.address || "--"}</div>
                        <div><strong>Pincode:</strong> {b.pincode || b.user?.pincode || "--"}</div>
                        <div><strong>Vehicle:</strong> {b.car?.brand || "Unknown"} {b.car?.model || ""} ({b.car?.year || "--"}) • Seats: {b.car?.seating_capacity || "--"}</div>
                        <div><strong>Payment Method:</strong> {b.paymentMethod || "offline"}</div>
                        <div><strong>Booked On:</strong> {formatDate(b.createdAt, true)}</div>
                        <div><strong>Last Updated:</strong> {formatDate(b.updatedAt, true)}</div>
                        <div><strong>Available Count:</strong> {b.car?.availableCount ?? "--"}</div>
                        {b.description && <div><strong>Description:</strong> {b.description}</div>}
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
