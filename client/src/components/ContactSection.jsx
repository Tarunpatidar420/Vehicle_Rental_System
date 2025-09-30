import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";

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
        alert("✅ Message sent successfully!");
        setForm({
          name: "",
          email: "",
          whatsapp: "",
          profession: "",
          otherProfession: "",
          description: "",
        });
      } else {
        alert("❌ Failed to send message");
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      alert("❌ Server error");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 md:px-20 py-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-3xl">
      
      {/* Left - Owner Info */}
      <div className="flex flex-col items-center text-center bg-white shadow-lg rounded-2xl p-6">
        <img
          src="/images/tarun.jpg"
          alt="Owner"
          className="w-[200px] h-[200px] rounded-full border-4 border-primary shadow-md object-cover mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800">Tarun Patidar</h2>
        <p className="text-gray-500">Founder & Developer</p>

        <div className="mt-4 text-left space-y-2">
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
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Us</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
        />

        {/* Profession */}
        <select
          name="profession"
          value={form.profession}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
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
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
          />
        )}

        <textarea
          name="description"
          placeholder="Your Message"
          value={form.description}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none h-32"
        />

        {/* Stylish Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
        >
          Send Message 🚀
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ContactSection;
