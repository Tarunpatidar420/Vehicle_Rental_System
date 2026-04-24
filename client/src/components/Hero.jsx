import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

//  Import your local car images from assets folder
import car1 from "../assets/car_image1.png";
import car2 from "../assets/car_image2.png";
import car3 from "../assets/car_image3.png";
import car4 from "../assets/car_image4.png";
import car5 from "../assets/car_image5.png"; // If available
import car6 from "../assets/car_image6.png"; // If available

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const scrollRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickupLocation) return alert(" Please enter pickup location!");
    window.location.href = `/cars?pickupLocation=${pickupLocation}`;
  };

  //  Local car data (using imported images)
  const cars = [
    {
      name: "Sedan",
      desc: "Comfortable sedans for family & business trips.",
      img: car1,
    },
    {
      name: "SUV",
      desc: "Spacious SUVs perfect for long drives and family travel.",
      img: car2,
    },
    {
      name: "Luxury Car",
      desc: "Premium cars with world-class comfort & style.",
      img: car3,
    },
    {
      name: "Electric Car",
      desc: "Eco-friendly EVs for smooth, silent driving.",
      img: car4,
    },
    {
      name: "Hatchback",
      desc: "Compact hatchbacks, efficient & easy to drive.",
      img: car5 || car1, // fallback if missing
    },
    {
      name: "Sports Car",
      desc: "Thrilling speed and performance for car lovers.",
      img: car6 || car2, // fallback if missing
    },
  ];

  //  Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollStep = 250;
    const interval = setInterval(() => {
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth
      ) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center gap-10 bg-light text-center px-4 py-12"
    >
      {/* Title */}
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-2xl sm:text-4xl md:text-5xl font-semibold leading-snug"
      >
        Find the Best Vehicles for Rent 
      </motion.h1>

      {/* Search Bar */}
      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg md:rounded-full w-full max-w-lg bg-white shadow-md"
      >
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="pickup-location" className="text-xs font-medium">
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
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer w-full md:w-auto"
        >
          Search
        </motion.button>
      </motion.form>

      {/*  Car  */}
      <div className="relative w-full max-w-7xl">
        <h2 className="text-lg sm:text-xl font-bold text-left mb-3 px-2">
          Explore Cars
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide scroll-smooth"
        >
          {cars.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 w-44 sm:w-52 bg-white border rounded-xl shadow-md hover:shadow-lg transition"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-32 sm:h-36 object-cover rounded-t-xl"
              />
              <div className="p-3 text-left">
                <h2 className="text-base font-semibold">{item.name}</h2>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </motion.div>
  );
};

export default Hero;
