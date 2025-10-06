import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

// ✅ Local Imports
import harvester from "../assets/harvester.png";
import seedreel from "../assets/seedreel.png";
import cultivator from "../assets/cultivator.png";
import spraypump from "../assets/spraypump.png";
import rotorvator from "../assets/rotorvator.png";
import puni from "../assets/puni-machine.png";
import miniharvester from "../assets/miniharvester.png";

const Banner = () => {
  const navigate = useNavigate();

  const agriculture = [
    {
      name: "Harvester",
      img: harvester,
      desc: "Powerful harvester for high-yield harvesting.",
    },
    {
      name: "Seed Drill",
      img: seedreel,
      desc: "Modern seed drills for perfect planting.",
    },
    {
      name: "Cultivator",
      img: cultivator,
      desc: "Durable cultivators for soil tilling.",
    },
    {
      name: "Spray Pump",
      img: spraypump,
      desc: "Portable pumps for efficient field irrigation.",
    },
    {
      name: "Rotorvator",
      img: rotorvator,
      desc: "Ideal for deep soil preparation and ploughing.",
    },
    {
      name: "Puni Machine",
      img: puni,
      desc: "Efficient machine for leveling and soil preparation.",
    },
    {
      name: "Mini Harvester",
      img: miniharvester,
      desc: "Compact harvester for small-scale farming.",
    },
  ];

  return (
    <section className="px-4 md:px-16 py-10 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        🌾 Agriculture Machinery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {agriculture.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <img
              src={v.img}
              alt={v.name}
              className="w-full h-36 object-contain bg-gray-50"
            />
            <div className="p-3 text-center">
              <h3 className="text-sm font-semibold text-gray-800">{v.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{v.desc}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/agriculture")}
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-all"
              >
                Explore {v.name}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Banner;
