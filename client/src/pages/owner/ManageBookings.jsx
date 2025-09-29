import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { currency, axios, isOwner } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);

  // ✅ Safe date formatter
  const formatDate = (date) => {
    if (!date) return '--';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return '--';
    }
  };

  // =========================
  // Fetch owner bookings
  // =========================
  const fetchOwnerBookings = async () => {
    if (!isOwner) return;
    try {
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =========================
  // Change booking status
  // =========================
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message || "Status updated");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status } : b
          )
        );
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      toast.error(error.message);
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

      <div className="max-w-5xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Vehicle</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-400">
                  No bookings found
                </td>
              </tr>
            )}

            {bookings.map((b) => (
              <React.Fragment key={b._id}>
                <tr className="border-t border-borderColor">
                  {/* Vehicle info */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={b.car?.images?.[0] || '/default_car_image.png'}
                      alt={b.car?.model || 'Vehicle'}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="max-md:hidden">
                      <div className="font-medium">
                        {b.car?.brand || 'Unknown'} {b.car?.model || ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {b.car?.year || '--'} • {b.car?.categories || '--'} •
                        Seats: {b.car?.seating_capacity || '--'}
                      </div>
                    </div>
                  </td>

                  {/* Date Range */}
                  <td className="p-3 max-md:hidden">
                    {formatDate(b.pickupDate)} to {formatDate(b.returnDate)}
                  </td>

                  {/* Total price */}
                  <td className="p-3">
                    {currency}
                    {b.price || 0}
                  </td>

                  {/* Payment */}
                  <td className="p-3 max-md:hidden">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs capitalize">
                      {b.paymentMethod || 'offline'}
                    </span>
                  </td>

                  {/* Status (editable dropdown) */}
                  <td className="p-3">
                    <select
                      value={(b.status || 'pending').toLowerCase()}
                      onChange={(e) => changeBookingStatus(b._id, e.target.value)}
                      className="px-2 py-1 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Expand/Collapse details */}
                  <td className="p-3">
                    <button
                      onClick={() =>
                        setExpandedBooking(expandedBooking === b._id ? null : b._id)
                      }
                      className="text-blue-500 underline text-sm"
                    >
                      {expandedBooking === b._id ? 'Hide Info' : 'Show Info'}
                    </button>
                  </td>
                </tr>

                {/* Expanded User & Booking Details */}
                {expandedBooking === b._id && (
                  <tr className="bg-gray-50 text-gray-600">
                    <td colSpan={6} className="p-3 text-xs space-y-1">
                      <div><strong>Name:</strong> {b.user?.name || b.name || '--'}</div>
                      <div><strong>Email:</strong> {b.user?.email || b.email || '--'}</div>
                      <div><strong>Whatsapp:</strong> {b.user?.whatsapp || b.whatsapp || '--'}</div>
                      <div><strong>Address:</strong> {b.user?.address || b.address || '--'}</div>
                      <div><strong>Pincode:</strong> {b.user?.pincode || b.pincode || '--'}</div>
                      <div>
                        <strong>Vehicle:</strong>{' '}
                        {b.car?.brand || 'Unknown'} {b.car?.model || ''} (
                        {b.car?.year || '--'}) • Seats: {b.car?.seating_capacity || '--'}
                      </div>
                      <div>
                        <strong>Payment Method:</strong> {b.paymentMethod || 'offline'}
                      </div>
                      {b.description && (
                        <div><strong>Description:</strong> {b.description}</div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
