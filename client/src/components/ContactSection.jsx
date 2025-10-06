import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import toast from "react-hot-toast";  // ✅ Toast import

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    profession: "",
    otherProfession: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/contact", form);
      if (res.data.success) {
        toast.success("✅ Message sent successfully! 🚀", {
          style: { background: "#4ade80", color: "#fff" }, // green toast
        });
        setForm({
          name: "",
          email: "",
          whatsapp: "",
          profession: "",
          otherProfession: "",
          description: "",
        });
      } else {
        toast.error("❌ Failed to send message");
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast.error("❌ Server error. Please try again!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 md:px-16 py-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-3xl">
      
      {/* Left - Owner Info */}
      <div className="flex flex-col items-center text-center bg-white shadow-md rounded-xl p-5 sm:p-6">
        <img
          src="/images/tarun.jpg"
          alt="Owner"
          className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full border-4 border-primary shadow-md object-cover mb-4"
        />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tarun Patidar</h2>
        <p className="text-gray-500 text-sm sm:text-base">Founder & Developer</p>

        <div className="mt-4 text-left text-sm sm:text-base space-y-1 sm:space-y-2 w-full sm:w-auto">
          <p><b>Email:</b> tarunpatidarrupariya@gmail.com</p>
          <p><b>WhatsApp:</b> 9589544306</p>
          <p><b>Contact:</b> 8223911258</p>
          <p><b>LinkedIn:</b> <a href="#" className="text-blue-600 underline">linkedin.com/in/tarun</a></p>
          <p><b>Instagram:</b> <a href="#" className="text-pink-600 underline">@tarun_insta</a></p>
          <p><b>Facebook:</b> <a href="#" className="text-blue-700 underline">fb.com/tarun</a></p>
        </div>
      </div>

      {/* Right - Contact Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-xl p-5 sm:p-8 flex flex-col gap-4 sm:gap-5"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Contact Us</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none w-full"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none w-full"
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none w-full"
        />

        {/* Profession */}
        <select
          name="profession"
          value={form.profession}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none w-full"
          required
        >
          <option value="">Select Profession</option>
          <option value="Farmer">Farmer</option>
          <option value="Businessman">Businessman</option>
          <option value="Student">Student</option>
          <option value="Engineer">Engineer</option>
          <option value="Other">Other</option>
        </select>

        {form.profession === "Other" && (
          <input
            type="text"
            name="otherProfession"
            placeholder="Enter Profession"
            value={form.otherProfession}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none w-full"
          />
        )}

        <textarea
          name="description"
          placeholder="Your Message"
          value={form.description}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none h-28 sm:h-32 w-full"
        />

        {/* Stylish Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
        >
          Send Message 🚀
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ContactSection;
