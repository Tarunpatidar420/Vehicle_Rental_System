import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

//  Local Images Imports
import herohonda from "../assets/herohonda.png";
import ktm from "../assets/ktm.png";
import pulsure from "../assets/pulsure.png";
import farmtack from "../assets/farmtack.png";
import johndere from "../assets/johndere.png";
import mahindra from "../assets/mahindra.png";
import messay from "../assets/messay.png";
import trali from "../assets/trali.png"; // check spelling: if file is trali.png → change to "../assets/trali.png"

const CategoriesSection = () => {
  const navigate = useNavigate();

  //  Categories with Local Images
  const categories = [
    //  Bikes
    {
      title: "Hero Honda",
      emoji: "🏍️",
      image: herohonda,
      route: "/bikes",
      desc: "Reliable commuter bike for smooth city rides.",
    },
    {
      title: "KTM Duke",
      emoji: "🏁",
      image: ktm,
      route: "/bikes",
      desc: "Sporty design and power-packed performance.",
    },
    {
      title: "Pulsar",
      emoji: "🛵",
      image: pulsure,
      route: "/bikes",
      desc: "Perfect balance of speed and comfort.",
    },

    //  Tractors
    {
      title: "Mahindra Tractor",
      emoji: "🚜",
      image: mahindra,
      route: "/tractors",
      desc: "High-performance tractor for heavy field work.",
    },
    {
      title: "John Deere Tractor",
      emoji: "🌾",
      image: johndere,
      route: "/tractors",
      desc: "Efficient and powerful tractor for modern farms.",
    },
    {
      title: "Farmtrac Tractor",
      emoji: "⚙️",
      image: farmtack,
      route: "/tractors",
      desc: "Designed for durability and smooth operations.",
    },
    {
      title: "Messay Tractor",
      emoji: "🧱",
      image: messay,
      route: "/tractors",
      desc: "Trusted tractor for medium-size farming tasks.",
    },
    {
      title: "Trali Trailer",
      emoji: "🧩",
      image: trali,
      route: "/tractors",
      desc: "Perfect for carrying heavy loads with stability.",
    },
  ];

  return (
    <section className="px-4 md:px-16 py-10 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
         Explore Our Vehicles
      </h2>

      {/*  Mobile Swiper */}
      <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1.3}
          centeredSlides={true}
        >
          {categories.map((cat, i) => (
            <SwiperSlide key={i}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(cat.route)}
                className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-40 w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 text-2xl p-2 rounded-full shadow">
                    {cat.emoji}
                  </span>
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-base font-semibold">{cat.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/*  Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(cat.route)}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300"
          >
            <div className="relative">
              <img
                src={cat.image}
                alt={cat.title}
                className="h-44 w-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-white/90 text-2xl p-2 rounded-full shadow">
                {cat.emoji}
              </span>
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base font-semibold text-gray-700">
                {cat.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
