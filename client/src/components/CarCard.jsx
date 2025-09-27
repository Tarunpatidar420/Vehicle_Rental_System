import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from "react-hot-toast";

const CarCard = ({ car, exchangeBookingId }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const { axios } = useAppContext();

  // 👇 Vehicle Exchange ka function
  const handleExchange = async (e) => {
    e.stopPropagation(); // prevent card click navigation
    try {
      const { data } = await axios.put(`/api/bookings/${exchangeBookingId}/exchange`, {
        newVehicleId: car._id,
      });

      if (data.success) {
        toast.success("Vehicle exchanged successfully!");
        navigate("/my-bookings"); // redirect after exchange
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 👇 Normal booking navigation
  const handleCardClick = () => {
    if (exchangeBookingId) return; // exchange mode me card click disable
    navigate(`/car-details/${car._id}`);
    scrollTo(0, 0);
  };

  // ✅ Image URL fix
  const getImageUrl = () => {
    if (car.images && car.images.length > 0) {
      return car.images[0].startsWith("http")
        ? car.images[0]
        : `${import.meta.env.VITE_BACKEND_URL}/${car.images[0]}`
    }
    return "/images/no-image.png";
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* Vehicle Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {car.isAvailable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">{currency}{car.pricePerDay}</span>
          <span className="text-sm text-white/80"> / day</span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">{car.brand} {car.model}</h3>
            <p className="text-muted-foreground text-sm">
              {car.categories?.join(", ")} • {car.year}
            </p>
          </div>
        </div>

        {/* Basic Specs */}
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600">
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.users_icon} alt="" className="h-4 mr-2"/>
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.fuel_icon} alt="" className="h-4 mr-2"/>
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.car_icon} alt="" className="h-4 mr-2"/>
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* ✅ Location Box - Full width */}
        
{/* ✅ Location Box - Full width */}
<div className="mt-4 p-4 border rounded-xl bg-gray-50 shadow-sm w-full">
  <div className="flex items-center mb-2">
    <img src={assets.location_icon} alt="Location" className="h-6 w-6 mr-2" />
    <h4 className="text-base font-semibold text-gray-800">Location Details</h4>
  </div>

  <div className="ml-8 space-y-1 text-sm text-gray-700">
    <p><span className="font-medium">Address:</span> 
      {car.location?.line1 || "N/A"}, {car.location?.line2 || ""}
    </p>
    <p><span className="font-medium">Pincode:</span> {car.location?.pincode || "N/A"}</p>
    <p><span className="font-medium">WhatsApp:</span> {car.whatsapp || "N/A"}</p>
    <p><span className="font-medium">Email:</span> {car.email || "N/A"}</p>
  </div>
</div>



        {/* 👇 Conditional button */}
        {exchangeBookingId && (
          <button
            onClick={handleExchange}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Exchange This Vehicle
          </button>
        )}
      </div>
    </div>
  )
}

export default CarCard
