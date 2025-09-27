import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {
  const { axios, currency } = useAppContext()

  const [images, setImages] = useState([])
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    categories: [],
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    locationLine1: '',
    locationLine2: '',
    pincode: '',
    count: 1,
    description: '',
    whatsapp: '',
    email: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const onImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 4) {
      toast.error("You can upload up to 4 images only")
      return
    }
    setImages([...images, ...files])
  }

  const onCategoryChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value)
    setCar({ ...car, categories: options })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return null
    setIsLoading(true)

    try {
      const locationString = `${car.locationLine1 || ''}, ${car.locationLine2 || ''}, ${car.pincode || ''}`

      const carDataToSend = {
        ...car,
        location: locationString,
      }

      const formData = new FormData()

      if (images.length > 0) {
        images.forEach((img) => formData.append('images', img))
      }

      formData.append(
        'carData',
        JSON.stringify({
          ...carDataToSend,
          categories: car.categories || []
        })
      )

      const { data } = await axios.post('/api/owner/add-car', formData)

      if (data.success) {
        toast.success(data.message)
        setImages([])
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          categories: [],
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          locationLine1: '',
          locationLine2: '',
          pincode: '',
          count: 1,
          description: '',
          whatsapp: '',
          email: '',
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Vehicle"
        subTitle="Fill in details to list a new vehicle for booking, including pricing, availability, and vehicle specifications."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Vehicle Images (Optional) */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="car-images">Upload Vehicle Images (optional, up to 4)</label>
          <input
            type="file"
            id="car-images"
            accept="image/*"
            multiple
            onChange={onImageChange}
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="h-16 w-16 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <input
              type="text"
              placeholder="e.g. BMW, Mahindra"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g. X5, Bolero"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Year, Price, Count, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="2025"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder="100"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Count (Available Vehicles)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 5"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.count}
              onChange={(e) => setCar({ ...car, count: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Categories (optional)</label>
            <select
              multiple
              onChange={onCategoryChange}
              value={car.categories}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none h-28"
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Tractor">Tractor</option>
              <option value="Agriculture Machinery">Agriculture Machinery</option>
            </select>
          </div>
        </div>

        {/* Transmission, Fuel, Seats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Transmission</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.transmission}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Fuel Type</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 5"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
            />
          </div>
        </div>

        {/* Address Line 1 & 2 (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Address Line 1 (optional)</label>
            <input
              type="text"
              placeholder="e.g. Near Bus Stand"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.locationLine1}
              onChange={(e) => setCar({ ...car, locationLine1: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Address Line 2 (optional)</label>
            <input
              type="text"
              placeholder="e.g. Opposite Petrol Pump"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.locationLine2}
              onChange={(e) => setCar({ ...car, locationLine2: e.target.value })}
            />
          </div>
        </div>

        {/* Pincode (Optional) */}
        <div className="flex flex-col w-full">
          <label>Pincode (optional)</label>
          <input
            type="text"
            placeholder="e.g. 123456"
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.pincode}
            onChange={(e) => setCar({ ...car, pincode: e.target.value })}
          />
        </div>

        {/* WhatsApp & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>WhatsApp Number</label>
            <input
              type="text"
              placeholder="e.g. +91 9876543210"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.whatsapp}
              onChange={(e) => setCar({ ...car, whatsapp: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Email (optional)</label>
            <input
              type="email"
              placeholder="e.g. owner@gmail.com"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.email}
              onChange={(e) => setCar({ ...car, email: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            rows="4"
            placeholder="Add some details about the vehicle"
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer">
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Vehicle'}
        </button>
      </form>
    </div>
  )
}

export default AddCar
