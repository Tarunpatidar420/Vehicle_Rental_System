import React from "react";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed"; //  Correct import
import { assets } from "../assets/assets"; //  Correct path

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-sky-100 to-sky-300 pt-10 pb-6 shadow-inner border-t border-sky-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* 🔹 Left Section - Logo and Description */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center md:items-start text-center md:text-left"
        >
          <img
            src={assets.logo}
            alt="Logo"
            className="h-28 w-auto mb-4 drop-shadow-2xl animate-pulse"
          />
          <p className="text-gray-700 text-base max-w-md leading-relaxed font-medium">
            Premium Vehical rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>
          <div className="flex gap-6 mt-5 text-gray-600 text-2xl">
            <i className="fab fa-facebook hover:text-blue-600 cursor-pointer transition-transform hover:scale-125"></i>
            <i className="fab fa-instagram hover:text-pink-600 cursor-pointer transition-transform hover:scale-125"></i>
            <i className="fab fa-twitter hover:text-sky-500 cursor-pointer transition-transform hover:scale-125"></i>
            <i className="fas fa-envelope hover:text-red-500 cursor-pointer transition-transform hover:scale-125"></i>
          </div>
        </motion.div>

        {/* 🔹 Right Section - Animated Contact Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 
                     p-8 rounded-3xl text-center text-white shadow-2xl hover:shadow-pink-500/40 
                     transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 border-4 border-transparent rounded-3xl 
                          animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-r from-purple-400 to-blue-400 opacity-10"></div>

          <h3 className="text-3xl font-extrabold mb-5 drop-shadow-lg">
           CONTACT US
          </h3>

          {/*  Animated text using ReactTyped */}
          <ReactTyped
            strings={[
              " Thanks for visiting our web app.",
              " Explore all vehicles easily.",
              " How can we help you?",
              " Please fill the contact form above 👆",
            ]}
            typeSpeed={55}
            backSpeed={35}
            loop
            className="text-lg font-semibold text-yellow-100 tracking-wide drop-shadow-md"
          />
        </motion.div>
      </div>

      {/*  Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-700 text-sm mt-10 border-t border-sky-200 pt-4"
      >
        © 2025 <span className="font-semibold text-blue-700">Smart Vehical</span>. All rights reserved.  
        <br /> Designed with  by <span className="text-indigo-700 font-semibold">Tarun Patidar</span>
      </motion.div>
    </footer>
  );
};

export default Footer;
