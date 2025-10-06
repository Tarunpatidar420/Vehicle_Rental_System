import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  // ✅ Image URL Fix
  const getImageUrl = (img) => {
    return img?.startsWith("http")
      ? img
      : `${import.meta.env.VITE_BACKEND_URL}/${img}`;
  };

  // ✅ Discounted Price Calculation
  const finalPrice = car.discount
    ? (car.pricePerDay - (car.pricePerDay * car.discount) / 100).toFixed(0)
    : car.pricePerDay;

  // ✅ Auto Offer Text
  const getOfferText = (discount) => {
    if (discount >= 90) return "🚀 Unbelievable Offer!";
    if (discount >= 70) return "🔥 Mega Offer!";
    if (discount >= 50) return "🎉 Big Offer!";
    if (discount >= 30) return "💎 Special Discount!";
    return null;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/car-details/${car._id}`)}
      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                 hover:-translate-y-1 transition-all duration-500 bg-white cursor-pointer"
    >
      {/* 🚘 Vehicle Images Auto Carousel */}
      <div className="relative w-full h-56 sm:h-64">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          modules={[Autoplay]}
        >
          {car.images?.slice(0, 4).map((img, index) => (
            <SwiperSlide key={index}>
              <motion.img
                src={getImageUrl(img)}
                alt={`vehicle-${index}`}
                className="w-full h-56 sm:h-64 object-cover rounded-lg"
                whileHover={{ scale: 1.05 }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 🎉 Discount Badge - Bigger than Price */}
        {car.discount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-3 left-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 
                       text-white font-extrabold px-6 py-3 rounded-full shadow-2xl text-2xl z-20"
          >
            🎉 {car.discount}% OFF
          </motion.div>
        )}

        {/* 🏷️ Offer Ribbon - Auto text based on discount */}
        {getOfferText(car.discount) && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-5 right-[-40px] bg-gradient-to-r from-pink-600 to-purple-600 
                       text-white font-extrabold text-lg px-14 py-2 rotate-45 shadow-2xl z-20"
          >
            {getOfferText(car.discount)}
          </motion.div>
        )}

        {/* 💰 Price (smaller than discount/offer) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 
                     bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                     px-6 py-3 rounded-2xl shadow-lg text-xl font-bold text-center z-10"
        >
          {currency}{finalPrice}
          <span className="text-sm font-medium"> / day</span>
          {car.discount && (
            <p className="line-through text-sm text-gray-200 mt-1">
              {currency}{car.pricePerDay}
            </p>
          )}
        </motion.div>
      </div>

      {/* 📋 Vehicle Info */}
      <div className="p-4 sm:p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">
          {car.brand} {car.model}
        </h2>
        <p className="text-gray-500">{car.description || "No description available"}</p>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
          <p><b>Seats:</b> {car.seating_capacity}</p>
          <p><b>Available:</b> {car.availableCount}</p>
          <p><b>Category:</b> {car.categories?.join(", ")}</p>
          <p><b>Year:</b> {car.year}</p>
          <p><b>Fuel:</b> {car.fuel_type}</p>
          <p><b>Transmission:</b> {car.transmission}</p>
        </div>

        {/* 📍 Location */}
        <div className="mt-4 p-3 border rounded-xl bg-gray-50 shadow-sm w-full">
          <div className="flex items-center mb-2">
            <img src={assets.location_icon} alt="Location" className="h-5 w-5 mr-2" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-800">Location</h4>
          </div>
          <div className="ml-7 space-y-1 text-sm text-gray-700">
            <p><b>Address:</b> {car.location?.line1 || "N/A"}, {car.location?.line2 || ""}</p>
            <p><b>Pincode:</b> {car.location?.pincode || "N/A"}</p>
            <p><b>WhatsApp:</b> {car.whatsapp || "N/A"}</p>
            <p><b>Email:</b> {car.email || "N/A"}</p>
          </div>
        </div>

        {/* ⏱️ Dates */}
        <div className="mt-3 text-xs text-gray-500">
          <p><b>Added On:</b> {new Date(car.createdAt).toLocaleString()}</p>
          <p><b>Updated On:</b> {new Date(car.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
