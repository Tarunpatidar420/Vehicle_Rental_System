import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddVehicle = () => {
  const { axios, currency } = useAppContext()

  const [images, setImages] = useState([])
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    discount: '',
    categories: [],
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: { line1: '', line2: '', pincode: '' },
    availableCount: 1,
    description: '',
    whatsapp: '',
    email: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const onImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 4) {
      toast.error('You can upload up to 4 images only')
      return
    }
    setImages([...images, ...files])
  }

  const onCategoryChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value)
    setCar({ ...car, categories: options })
  }

  // ✅ Offer generator based on discount
  const getOfferText = (discount) => {
    const d = Number(discount)
    if (d >= 90) return "Unbelievable Offer 🎉"
    if (d >= 70) return "Mega Offer 🔥"
    if (d >= 50) return "Big Offer ⭐"
    if (d >= 30) return "Special Offer 💎"
    return ""
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return null
    setIsLoading(true)

    try {
      const formData = new FormData()

      // ✅ Images
      if (images.length > 0) {
        images.forEach((img) => formData.append('images', img))
      }

      // ✅ Brand array
      const brandArray = car.brand
        ? car.brand.split(',').map((b) => b.trim()).filter((b) => b.length > 0)
        : []

      // ✅ Generate offer from discount
      const offerText = getOfferText(car.discount)

      // ✅ Car data as JSON
      formData.append(
        'carData',
        JSON.stringify({
          ...car,
          brand: brandArray,
          categories: car.categories || [],
          offer: offerText,   // 👈 Auto Offer
        })
      )

      // ✅ Axios POST request with correct headers
      const { data } = await axios.post('/api/owner/add-car', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-dashboard-key': localStorage.getItem('dashboardKey') || '',
        },
      })

      if (data.success) {
        toast.success(data.message)
        setImages([])
        setCar({
          brand: '',
          model: '',
          year: '',
          pricePerDay: '',
          discount: '',
          categories: [],
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: { line1: '', line2: '', pincode: '' },
          availableCount: 1,
          description: '',
          whatsapp: '',
          email: '',
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('AddCar Error:', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Vehicle"
        subTitle="Fill in details to list a new vehicle for booking, including pricing, discount & offers."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 text-gray-600 text-sm mt-6 max-w-3xl"
      >
        {/* Vehicle Images */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium">Upload Vehicle Images (up to 4)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImageChange}
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
          />
          <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="h-20 w-20 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium">Brand (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. BMW, Mahindra"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Model</label>
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

        {/* Year, Price, Discount, Count, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex flex-col">
            <label className="font-medium">Year</label>
            <input
              type="number"
              placeholder="2025"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Daily Price ({currency})</label>
            <input
              type="number"
              placeholder="100"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 10"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.discount}
              onChange={(e) => setCar({ ...car, discount: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Available Count</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 5"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.availableCount}
              onChange={(e) => setCar({ ...car, availableCount: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Categories</label>
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
          <div className="flex flex-col">
            <label className="font-medium">Transmission</label>
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
          <div className="flex flex-col">
            <label className="font-medium">Fuel Type</label>
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
          <div className="flex flex-col">
            <label className="font-medium">Seating Capacity</label>
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

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium">Address Line 1</label>
            <input
              type="text"
              placeholder="e.g. Near Bus Stand"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.location.line1}
              onChange={(e) =>
                setCar({ ...car, location: { ...car.location, line1: e.target.value } })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Address Line 2</label>
            <input
              type="text"
              placeholder="e.g. Opposite Petrol Pump"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.location.line2}
              onChange={(e) =>
                setCar({ ...car, location: { ...car.location, line2: e.target.value } })
              }
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Pincode</label>
          <input
            type="text"
            placeholder="e.g. 123456"
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.location.pincode}
            onChange={(e) =>
              setCar({ ...car, location: { ...car.location, pincode: e.target.value } })
            }
          />
        </div>

        {/* WhatsApp & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium">WhatsApp Number</label>
            <input
              type="text"
              placeholder="e.g. +91 9876543210"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.whatsapp}
              onChange={(e) => setCar({ ...car, whatsapp: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Email</label>
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
        <div className="flex flex-col">
          <label className="font-medium">Description</label>
          <textarea
            rows="4"
            placeholder="Add some details about the vehicle"
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-primary text-white rounded-md font-semibold shadow hover:bg-primary/90 transition w-max"
        >
          <img src={assets.tick_icon} alt="" className="h-5 w-5" />
          {isLoading ? 'Listing...' : 'List Your Vehicle'}
        </button>
      </form>
    </div>
  )
}

export default AddVehicle;
