import React, { useState } from "react";
import { motion } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickupLocation) {
      alert("⚠️ Please enter pickup location!");
      return;
    }
    window.location.href = `/cars?pickupLocation=${pickupLocation}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center gap-14 bg-light text-center px-4 py-16"
    >
      {/* Title */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold leading-snug"
      >
        Find the Best Vehicles for Rent 🚜🚗🏍️
      </motion.h1>

      {/* Search Form */}
      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg md:rounded-full w-full max-w-2xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        {/* Pickup Location */}
        <div className="flex flex-col items-start gap-2 w-full">
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
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-9 py-3 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer w-full md:w-auto"
        >
          Search
        </motion.button>
      </motion.form>

      {/* Vehicle Categories */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-center w-full max-w-7xl">
        {/* Category Card Component */}
        {[
          {
            name: "Cars",
            desc: "Comfortable cars for family & business trips.",
            img: "/images/car.png",
          },
          {
            name: "Tractors",
            desc: "Powerful tractors for agriculture and farming.",
            img: "/images/tractor.png",
          },
          {
            name: "Harvesters",
            desc: "Modern machines to ease your harvesting process.",
            img: "/images/harvester.png",
          },
          {
            name: "Bikes",
            desc: "Sport & commuter bikes for quick travel.",
            img: "/images/bike.png",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="shadow-xl p-6 rounded-xl hover:shadow-2xl transition bg-white border"
            style={{ width: "100%", height: "auto" }}
          >
            <img
              src={item.img}
              alt={item.name}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
              className="rounded-md"
            />
            <h2 className="mt-3 text-xl font-bold">{item.name}</h2>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Hero;
