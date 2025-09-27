import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import BookNowModal from '../components/BookNowModal'   // ✅ नया modal import करो

const CarDetails = () => {
  const { id } = useParams()
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [showModal, setShowModal] = useState(false)   // ✅ modal state
  const currency = import.meta.env.VITE_CURRENCY
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

  // 🛠 Car load (state se ya backend se)
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`/api/vehicles/${id}`)
        if (data.success) {
          setCar(data.vehicle)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error("Failed to fetch vehicle details")
      }
    }

    const found = cars.find(c => c._id === id)
    if (found) {
      setCar(found)
    } else {
      fetchCar()
    }
  }, [cars, id, axios])

  // 🛠 Image URL fix
  const getImageUrl = (image) => {
    if (!image) return assets.car_icon
    return image.startsWith("http") ? image : `${backendUrl}/${image}`
  }

  // ✅ Modal submit
  const handleBooking = async (formData) => {
    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
        ...formData
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setShowModal(false)
    }
  }

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      {/* 🔙 Back Button */}
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
        Back to all vehicles
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image & Details */}
        <motion.div className='lg:col-span-2'>
          <motion.img
            src={getImageUrl(car.images?.[0])}
            alt={car.brand}
            className='w-full h-auto object-cover rounded-xl mb-6 shadow-md'
          />
          {/* Car Info */}
          <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
          <p className='text-gray-500'>{car.description}</p>
        </motion.div>

        {/* Right: Booking Section */}
        <motion.div className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{car.pricePerDay}
            <span className='text-base text-gray-400 font-normal'>per day</span>
          </p>

          <hr className='border-borderColor my-6' />

          {/* Dates */}
          <div className='flex flex-col gap-2'>
            <label>Pickup Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              className='border border-borderColor px-3 py-2 rounded-lg'
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label>Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              className='border border-borderColor px-3 py-2 rounded-lg'
              required
            />
          </div>

          {/* ✅ Book Now → Modal Open */}
          <button
            onClick={() => setShowModal(true)}
            className='w-full bg-primary hover:bg-primary-dull py-3 text-white rounded-xl'
          >
            Book Now
          </button>
        </motion.div>
      </div>

      {/* ✅ Modal */}
      {showModal && <BookNowModal car={car} onClose={() => setShowModal(false)} onSubmit={handleBooking} />}
    </div>
  ) : <Loader />
}

export default CarDetails
