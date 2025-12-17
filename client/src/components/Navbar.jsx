import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* =========================
     🎯 Primary Button Action
     (SINGLE SOURCE OF TRUTH)
  ========================= */
  const handlePrimaryAction = () => {
    // 🔒 not logged in
    if (!user) {
      setShowLogin(true);
      return;
    }

    // 👑 owner
    if (isOwner) {
      navigate("/owner");
      return;
    }

    // 👤 normal user
    navigate("/cars");
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor ${
        location.pathname === "/" ? "bg-light" : ""
      }`}
    >
      {/* ================= Logo ================= */}
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-8"
        />
      </Link>

      {/* ================= Desktop Menu ================= */}
      <div className="hidden sm:flex items-center gap-8">
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        <div className="flex items-center gap-6">
          <button
            onClick={handlePrimaryAction}
            className="cursor-pointer font-medium"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          <button
            onClick={() => (user ? logout() : setShowLogin(true))}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* ================= Mobile Menu Button ================= */}
      <button
        className="sm:hidden z-50"
        onClick={() => setOpen(!open)}
        aria-label="menu"
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>

      {/* ================= Mobile Sidebar ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4 }}
              className="fixed top-0 left-0 h-full bg-white z-50 shadow-xl w-4/5 max-w-xs p-6"
            >
              <div className="flex justify-between items-center">
                <img src={assets.logo} alt="Logo" className="h-10" />
                <button onClick={() => setOpen(false)}>✕</button>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                {menuLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <button
                  onClick={() => {
                    setOpen(false);
                    handlePrimaryAction();
                  }}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  {isOwner ? "Dashboard" : "List cars"}
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    user ? logout() : setShowLogin(true);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  {user ? "Logout" : "Login"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
