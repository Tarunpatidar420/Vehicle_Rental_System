import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// ✅ Local images
import farmtack from "../assets/farmtack.png";
import ktm from "../assets/ktm.png";
import miniharvester from "../assets/miniharvester.png";
import carImg from "../assets/car_image5.png";
import agricultureMachinary from "../assets/agriculture-machinary.png";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredCars, setFilteredCars] = useState([]);

  const isSearchData = pickupLocation && pickupDate && returnDate;

  const categories = [
    { name: "All", img: agricultureMachinary, emoji: "✨" },
    { name: "Car", img: carImg, emoji: "🚗" },
    { name: "Tractor", img: farmtack, emoji: "🚜" },
    { name: "Bike", img: ktm, emoji: "🏍️" },
    { name: "Agriculture", img: miniharvester, emoji: "🌾" },
  ];

  const applyFilter = () => {
    if (!cars) return;
    let filtered = cars;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((car) =>
        car.categories?.some(
          (cat) =>
            cat.toLowerCase() === selectedCategory.toLowerCase() ||
            cat.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    if (input !== "") {
      filtered = filtered.filter((car) => {
        return (
          car.brand?.toLowerCase().includes(input.toLowerCase()) ||
          car.model?.toLowerCase().includes(input.toLowerCase()) ||
          car.categories?.some((cat) =>
            cat.toLowerCase().includes(input.toLowerCase())
          ) ||
          car.transmission?.toLowerCase().includes(input.toLowerCase())
        );
      });
    }

    setFilteredCars(filtered);
  };

  const searchCarAvailablity = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        setFilteredCars(data.availableCars);
        if (data.availableCars.length === 0) toast("No vehicles available");
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  useEffect(() => {
    isSearchData && searchCarAvailablity();
  }, []);

  useEffect(() => {
    cars?.length > 0 && !isSearchData && applyFilter();
  }, [input, cars, selectedCategory]);

  if (!cars) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading Vehicles...
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Vehicles"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        {/* ✅ Category Slider */}
        <div className="w-full max-w-5xl mt-6 px-6">
          <Swiper
            modules={[Navigation]}
            spaceBetween={14}
            slidesPerView={3.2}
            navigation
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2.5 },
              640: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5 },
            }}
          >{categories.map((cat, index) => (
  <SwiperSlide key={index}>
    <motion.div
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => setSelectedCategory(cat.name)}
      className={`flex flex-col items-center w-28 h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out
        ${
          selectedCategory === cat.name
            ? "bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 shadow-lg ring-2 ring-yellow-400"
            : "bg-white shadow-md hover:shadow-lg"
        }`}
    >
      {/* ✅ Image Section */}
      <div className="relative w-full h-20 overflow-hidden">
        <motion.img
          src={cat.img}
          alt={cat.name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <span className="absolute top-1 left-1 bg-white/90 text-sm p-1 rounded-md">
          {cat.emoji}
        </span>
      </div>

      {/* ✅ Text Section */}
      <p
        className={`mt-1 text-xs font-medium text-center ${
          selectedCategory === cat.name
            ? "text-yellow-800 font-semibold"
            : "text-gray-700"
        }`}
      >
        {cat.name}
      </p>
    </motion.div>
  </SwiperSlide>
))}

          </Swiper>
        </div>

        {/* ✅ Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center bg-white px-4 mt-6 max-w-lg w-full h-12 rounded-full shadow-lg"
        >
          <img src={assets.search_icon} alt="" className="w-5 h-5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-600 text-sm"
          />
          <img src={assets.filter_icon} alt="" className="w-5 h-5 ml-2" />
        </motion.div>
      </motion.div>

      {/* ✅ Vehicles Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-6 md:px-12 lg:px-20 xl:px-32 mt-10"
      >
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length}{" "}
          {selectedCategory === "All" ? "Vehicles" : selectedCategory}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {Array.isArray(filteredCars) && filteredCars.length > 0 ? (
            filteredCars.map((car, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full py-10">
              🚗 No vehicles found. Please adjust filters or search again.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;
