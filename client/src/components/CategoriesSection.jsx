import React from "react";
import { motion } from "framer-motion";

const CategoriesSection = () => {
  const categories = [
    {
      title: "Cars",
      image:
        "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    },
    {
      title: "Bikes",
      image:
        "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg",
    },
    {
      title: "Tractors",
      image:
        "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg",
    },
    {
      title: "Agriculture Machinery",
      image:
        "https://images.pexels.com/photos/235925/pexels-photo-235925.jpeg",
    },
  ];

  return (
    <section className="px-6 md:px-20 py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Explore Our Vehicle Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl cursor-pointer"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{cat.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
