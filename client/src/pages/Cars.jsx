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

// Images
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

  //  Date Validation
  const isValidDateRange = () => {
    if (!pickupDate || !returnDate) return false;

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (picked < today) {
      toast.error("Pickup date cannot be in the past");
      return false;
    }

    if (returned <= picked) {
      toast.error("Return date must be after pickup date");
      return false;
    }

    return true;
  };

  const categories = [
    { name: "All", img: agricultureMachinary, emoji: "✨" },
    { name: "Car", img: carImg, emoji: "🚗" },
    { name: "Tractor", img: farmtack, emoji: "🚜" },
    { name: "Bike", img: ktm, emoji: "🏍️" },
    { name: "Agriculture", img: miniharvester, emoji: "🌾" },
  ];

  //  Filter logic
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

  //  API call with validation
  const searchCarAvailability = async () => {
    try {
      if (!isValidDateRange()) return;

      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setFilteredCars(data.availableCars);

        if (data.availableCars.length === 0) {
          toast("No vehicles available");
        }
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  // FIXED useEffect
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    }
  }, [pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if (!isSearchData && cars?.length > 0) {
      applyFilter();
    }
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Vehicles"
          subTitle="Browse our selection of premium vehicles"
        />

        {/* Category Slider */}
        <div className="w-full max-w-5xl mt-6 px-6">
          <Swiper
            modules={[Navigation]}
            spaceBetween={14}
            slidesPerView={3.2}
            navigation
            loop
          >
            {categories.map((cat, index) => (
              <SwiperSlide key={index}>
                <div
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`cursor-pointer p-2 rounded-xl text-center ${
                    selectedCategory === cat.name
                      ? "bg-yellow-200"
                      : "bg-white"
                  }`}
                >
                  <img src={cat.img} alt={cat.name} />
                  <p>{cat.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-lg w-full h-12 rounded-full shadow-lg">
          <img src={assets.search_icon} className="w-5 mr-2" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search vehicles..."
            className="w-full outline-none"
          />
        </div>
      </motion.div>

      {/* Cars Grid */}
      <div className="px-6 mt-10">
        <p>Showing {filteredCars.length} vehicles</p>

        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {filteredCars.length > 0 ? (
            filteredCars.map((car, i) => (
              <CarCard key={i} car={car} />
            ))
          ) : (
            <p>No vehicles found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;