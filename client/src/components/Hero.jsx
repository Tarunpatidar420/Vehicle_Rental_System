import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();

    if (new Date(returnDate) <= new Date(pickupDate)) {
      alert("⚠️ Return date must be after pickup date!");
      return;
    }

    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center px-4"
    >
      {/* Title */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold leading-snug"
      >
        Luxury Cars on Rent
      </motion.h1>

      {/* Search Form */}
      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10 p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        {/* Pickup Location */}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="pickup-location" className="text-sm font-medium">
            Pickup Location
          </label>
          <input
            id="pickup-location"
            type="text"
            value={pickupLocation}
            onChange={(e) =>
              setPickupLocation(
                e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
              )
            }
            placeholder="Enter city or state"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 w-52 md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="px-1 text-xs text-gray-500">
            {pickupLocation ? pickupLocation : "Please enter location"}
          </p>
        </div>

        {/* Pickup Date */}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="pickup-date" className="text-sm font-medium">
            Pick-up Date
          </label>
          <input
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            type="date"
            id="pickup-date"
            min={new Date().toISOString().split("T")[0]}
            className="text-sm text-gray-600 border border-gray-300 rounded-lg px-2 py-1"
            required
          />
        </div>

        {/* Return Date */}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="return-date" className="text-sm font-medium">
            Return Date
          </label>
          <input
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            type="date"
            id="return-date"
            min={pickupDate || new Date().toISOString().split("T")[0]}
            className="text-sm text-gray-600 border border-gray-300 rounded-lg px-2 py-1"
            required
          />
        </div>

        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-9 py-3 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer w-full md:w-auto"
        >
          <img src={assets.search_icon} alt="search" className="brightness-300 w-5" />
          Search
        </motion.button>
      </motion.form>

      {/* Hero Car Image */}
      <motion.img
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        src={assets.main_car}
        alt="car"
        className="max-h-72 md:max-h-80"
      />
    </motion.div>
  );
};

export default Hero;
