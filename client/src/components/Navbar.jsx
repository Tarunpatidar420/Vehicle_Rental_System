import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner, token } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      if (!user && !token) {
        toast.error("Please login first");
        setShowLogin(true);
        return;
      }

      const { data } = await axios.post('/api/owner/change-role', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
        navigate('/owner');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}
    >
      {/* Logo */}
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-8"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>{link.name}</Link>
        ))}
        <div className="flex items-center gap-6">
          <button
            onClick={() => isOwner ? navigate('/owner') : changeRole()}
            className="cursor-pointer"
          >
            {isOwner ? 'Dashboard' : 'List cars'}
          </button>
          <button
            onClick={() => { user ? logout() : setShowLogin(true) }}
            className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden cursor-pointer z-50"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>

      {/* Mobile Sidebar with AnimatePresence */}
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full bg-white z-50 shadow-xl w-4/5 max-w-xs flex flex-col p-6 gap-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <img src={assets.logo} alt="Logo" className="h-10" />
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-black">✕</button>
              </div>

              {/* Links with stagger effect */}
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="flex flex-col gap-4 mt-4"
              >
                {menuLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    variants={{ hidden: { x: -20, opacity: 0 }, show: { x: 0, opacity: 1 } }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className="block text-lg font-medium hover:text-primary transition"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Buttons */}
                <motion.div
                  variants={{ hidden: { x: -20, opacity: 0 }, show: { x: 0, opacity: 1 } }}
                  className="flex flex-col gap-3 mt-4"
                >
                  <button
                    onClick={() => {
                      setOpen(false);
                      isOwner ? navigate('/owner') : changeRole();
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-left"
                  >
                    {isOwner ? 'Dashboard' : 'List cars'}
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      user ? logout() : setShowLogin(true);
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg transition"
                  >
                    {user ? 'Logout' : 'Login'}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
