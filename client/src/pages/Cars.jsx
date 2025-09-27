import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

// Swiper import
// Swiper import
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'   // ✅ correct for v12
import 'swiper/css'
import 'swiper/css/navigation'

// Swiper import
const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const { cars, axios } = useAppContext()

  const [input, setInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  const categories = [
    { name: "All", img: "/images/all.png" },
    { name: "Car", img: "/images/car.png" },
    { name: "Tractor", img: "/images/tractor.png" },
    { name: "Bike", img: "/images/bike.png" },
    { name: "Agriculture Machinery", img: "/images/agriculture.png" },
  ]

  const applyFilter = () => {
    let filtered = cars

    if (selectedCategory !== "All") {
      filtered = filtered.filter(car =>
        car.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    if (input !== '') {
      filtered = filtered.filter((car) => {
        return car.brand.toLowerCase().includes(input.toLowerCase())
          || car.model.toLowerCase().includes(input.toLowerCase())
          || car.category.toLowerCase().includes(input.toLowerCase())
          || car.transmission.toLowerCase().includes(input.toLowerCase())
      })
    }

    setFilteredCars(filtered)
  }

  const searchCarAvailablity = async () => {
    const { data } = await axios.post('/api/bookings/check-availability', { location: pickupLocation, pickupDate, returnDate })
    if (data.success) {
      setFilteredCars(data.availableCars)
      if (data.availableCars.length === 0) {
        toast('No cars available')
      }
    }
  }

  useEffect(() => {
    isSearchData && searchCarAvailablity()
  }, [])

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter()
  }, [input, cars, selectedCategory])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex flex-col items-center py-20 bg-light max-md:px-4'
      >
        <Title
          title='Available Vehicles'
          subTitle='Browse our selection of premium vehicles available for your next adventure'
        />

        {/* Impressive Slider with Navigation */}
        <div className="w-full max-w-4xl mt-6 px-6">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={3}
            navigation
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {categories.map((cat, index) => (
              
              <SwiperSlide key={index}>
  <motion.div
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.08 }}
    onClick={() => setSelectedCategory(cat.name)}
    className={`flex flex-col items-center p-4 rounded-xl text-center cursor-pointer transition-all duration-300 ease-in-out 
      ${
        selectedCategory === cat.name
          ? "bg-yellow-200 text-yellow-900 shadow-xl ring-2 ring-yellow-400"
          : "bg-white shadow-md hover:shadow-lg"
      }`}
  >
    <motion.img
      src={cat.img}
      alt={cat.name}
      initial={{ opacity: 0.7 }}
      animate={{
        opacity: 1,
        rotate: selectedCategory === cat.name ? [0, 5, -5, 0] : 0,
      }}
      transition={{ duration: 0.5 }}
      className={`h-16 w-16 object-contain ${
        selectedCategory === cat.name ? "brightness-90" : ""
      }`}
    />
    <p
      className={`mt-2 font-medium transition ${
        selectedCategory === cat.name ? "text-yellow-800 font-semibold" : ""
      }`}
    >
      {cat.name}
    </p>
  </motion.div>
</SwiperSlide>



            ))}
          </Swiper>
        </div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'
        >
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
        </motion.div>
      </motion.div>

      {/* Cars Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'
      >
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>
          Showing {filteredCars.length} {selectedCategory === "All" ? "Vehicles" : selectedCategory}
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Cars
