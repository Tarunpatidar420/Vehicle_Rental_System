import React from "react";
import { motion } from "motion/react";

const Banner = () => {
  const items = [
    {
      title: "Cars",
      desc: "Comfortable cars for family & business trips.",
      img: "/images/car.jpg",
    },
    {
      title: "Tractors",
      desc: "Powerful tractors for agriculture and farming.",
      img: "/images/tractor.jpg",
    },
    {
      title: "Bikes",
      desc: "Sport & commuter bikes for quick travel.",
      img: "/images/bike.jpg",
    },
    {
      title: "Cultivators",
      desc: "Efficient cultivators for soil preparation.",
      img: "/images/cultivator.jpg",
    },
    {
      title: "Seed Drills",
      desc: "Modern seed drills for efficient sowing.",
      img: "/images/seeddrill.jpg",
    },
    {
      title: "Rotavators",
      desc: "High-performance rotavators for farming.",
      img: "/images/rotavator.jpg",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-12">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          style={{ width: "500px", height: "800px" }} // ✅ inline size (easily change later)
        >
          <img
            src={item.img}
            alt={item.title}
            className="w-full object-cover"
            style={{ height: "400px" }} // ✅ Image height fixed
          />
          <div className="p-6 flex flex-col justify-between h-[400px]">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dull transition-all"
            >
              Explore {item.title}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Banner;
