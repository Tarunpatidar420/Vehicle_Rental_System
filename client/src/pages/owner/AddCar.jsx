import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
  brand: '',
  model: '',
  year: 0,
  pricePerDay: 0,
  category: '',
  transmission: '',
  fuel_type: '',
  seating_capacity: 0,
  location: {
    country: '',
    state: '',
    district: '',
    tehsil: '',
    city: '',
    village: '',
    whatsapp: '',
    email: ''
  },
  description: '',
})


  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e) => {
  e.preventDefault()
  if (isLoading) return null

  setIsLoading(true)
  try {
    // ✅ Location को string में बदलना
    const locationString = `
Country: ${car.location.country}
State: ${car.location.state}
District: ${car.location.district}
Tehsil: ${car.location.tehsil}
City: ${car.location.city}
Village: ${car.location.village}
WhatsApp: ${car.location.whatsapp}
Email: ${car.location.email}
    `.trim()

    const carDataToSend = {
      ...car,
      location: locationString,  // 👈 अब backend को string जाएगा
    }

    const formData = new FormData()
    formData.append('image', image)
    formData.append('carData', JSON.stringify(carDataToSend))

    const { data } = await axios.post('/api/owner/add-car', formData)

    if (data.success) {
      toast.success(data.message)
      setImage(null)
      setCar({
        brand: '',
        model: '',
        year: 0,
        pricePerDay: 0,
        category: '',
        transmission: '',
        fuel_type: '',
        seating_capacity: 0,
        location: {
          country: '',
          state: '',
          district: '',
          tehsil: '',
          city: '',
          village: '',
          whatsapp: '',
          email: ''
        },
        description: '',
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
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer'/>
            <input type="file" id="car-image" accept="image/*" hidden onChange={e=> setImage(e.target.files[0])}/>
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your car</p>
        </div>

        {/* Car Brand & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder="e.g. BMW, Mercedes, Audi..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e=> setCar({...car, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder="e.g. X5, E-Class, M4..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e=> setCar({...car, model: e.target.value})}/>
          </div>
          
        </div>

        {/* Car Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input type="number" placeholder="2025" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e=> setCar({...car, year: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input type="number" placeholder="100" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
  <label>Category</label>
  <select
    onChange={e => setCar({ ...car, category: e.target.value })}
    value={car.category}
    className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
  >
    <option value="">Select a category</option>
    <option value="Car">Car</option>
    <option value="Tractor">Tractor</option>
    <option value="Bike">Bike</option>
    <option value="Agriculture Machinery">Agriculture Machinery</option>
  </select>
</div>

        </div>

         {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select onChange={e=> setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={e=> setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input type="number" placeholder="4" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </div>

         {/* Car Location */}
         {/* Car Location */}

<div className="w-full p-4 border border-borderColor rounded-md text-base bg-gray-50 whitespace-pre-line overflow-auto max-h-60">

  <label className="text-lg font-semibold">Location & Contact</label>

  {/* Country */}
  <input
    type="text"
    placeholder="Country"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, country: e.target.value }
      })
    }
  />

  {/* State */}
  <input
    type="text"
    placeholder="State"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, state: e.target.value }
      })
    }
  />

  {/* District */}
  <input
    type="text"
    placeholder="District"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, district: e.target.value }
      })
    }
  />

  {/* Tehsil */}
  <input
    type="text"
    placeholder="Tehsil"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, tehsil: e.target.value }
      })
    }
  />

  {/* City */}
  <input
    type="text"
    placeholder="City"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, city: e.target.value }
      })
    }
  />

  {/* Village */}
  <input
    type="text"
    placeholder="Village"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, village: e.target.value }
      })
    }
  />

  {/* WhatsApp */}
  <input
    type="text"
    placeholder="WhatsApp Number"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, whatsapp: e.target.value }
      })
    }
  />

  {/* Email */}
  <input
    type="email"
    placeholder="Email ID"
    className="w-full px-4 py-3 border border-borderColor rounded-md outline-none text-base"
    onChange={e =>
      setCar({
        ...car,
        location: { ...car.location, email: e.target.value }
      })
    }
  />

  {/* Final Location Box */}
  <label className="text-base font-medium mt-2">Final Location</label>
  <div
    style={{
      width: "100%",
      padding: "16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "16px",
      backgroundColor: "#f9f9f9",
      lineHeight: "1.8",
      whiteSpace: "pre-line",
      overflow: "auto",
      maxHeight: "300px"
    }}
  >
    <p><span style={{ color: "red", fontWeight: "bold" }}>Country:</span> {car.location?.country || ""}</p>
    <p><span style={{ color: "blue", fontWeight: "bold" }}>State:</span> {car.location?.state || ""}</p>
    <p><span style={{ color: "green", fontWeight: "bold" }}>District:</span> {car.location?.district || ""}</p>
    <p><span style={{ color: "purple", fontWeight: "bold" }}>Tehsil:</span> {car.location?.tehsil || ""}</p>
    <p><span style={{ color: "orange", fontWeight: "bold" }}>City:</span> {car.location?.city || ""}</p>
    <p><span style={{ color: "deeppink", fontWeight: "bold" }}>Village:</span> {car.location?.village || ""}</p>
    <p><span style={{ color: "teal", fontWeight: "bold" }}>WhatsApp:</span> {car.location?.whatsapp || ""}</p>
    <p><span style={{ color: "black", fontWeight: "bold" }}>Email:</span> {car.location?.email || ""}</p>
  </div>
</div>


        {/* Car Description */}
         <div className='flex flex-col w-full'>
            <label>Description</label>
            <textarea rows={5} placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e=> setCar({...car, description: e.target.value})}></textarea>
          </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>


      </form>

    </div>
  )
}

export default AddCar
