// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import BookNowModal from "../components/BookNowModal";

// const CarDetails = () => {
//   const { id } = useParams(); 
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [pickupDate, setPickupDate] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchCar = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/vehicles/${id}`); // ✅ Correct route
//         setCar(res.data.car); // ✅ `car` object backend se aa raha hai
//       } catch (err) {
//         console.error("Error fetching car:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCar();
//   }, [id]);

//   const handleBookNow = () => {
//     if (!pickupDate || !returnDate) {
//       alert("Please select pickup and return dates first!");
//       return;
//     }
//     setIsModalOpen(true);
//   };

//   if (loading) {
//     return <div className="p-6 text-center">⏳ Loading car details...</div>;
//   }

//   if (!car) {
//     return (
//       <div className="p-6 text-center text-red-600 font-bold">
//         ⚠️ Car details not available!
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         {car.brand} {car.model}
//       </h1>
//       <p className="mt-2 text-gray-700">{car.description}</p>

//       {/* Date Inputs */}
//       <div className="mt-4">
//         <label className="block mb-2 font-medium">Pickup Date</label>
//         <input
//           type="date"
//           className="border p-2 w-full mb-4"
//           value={pickupDate}
//           onChange={(e) => setPickupDate(e.target.value)}
//           required
//         />

//         <label className="block mb-2 font-medium">Return Date</label>
//         <input
//           type="date"
//           className="border p-2 w-full mb-4"
//           value={returnDate}
//           onChange={(e) => setReturnDate(e.target.value)}
//           required
//         />

//         <button
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
//           onClick={handleBookNow}
//         >
//           Book Now
//         </button>
//       </div>

//       {/* Booking Modal */}
//       <BookNowModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         car={car}
//         pickupDate={pickupDate}
//         returnDate={returnDate}
//       />
//     </div>
//   );
// };

// export default CarDetails;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BookNowModal from "../components/BookNowModal";

const CarDetails = () => {
  const { id } = useParams();
  const { axios } = useAppContext(); // ✅ context axios
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`/api/vehicles/${id}`);
        setCar(data.car);
      } catch (err) {
        console.error("Error fetching car:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, axios]);

  const handleBookNow = () => {
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates first!");
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-6 text-center">⏳ Loading car details...</div>;
  }

  if (!car) {
    return (
      <div className="p-6 text-center text-red-600 font-bold">
        ⚠️ Car details not available!
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        {car.brand} {car.model}
      </h1>

      <p className="mt-2 text-gray-700">{car.description}</p>

      <div className="mt-4">
        <label className="block mb-2 font-medium">Pickup Date</label>
        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
        />

        <label className="block mb-2 font-medium">Return Date</label>
        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          onClick={handleBookNow}
        >
          Book Now
        </button>
      </div>

      <BookNowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        car={car}
        pickupDate={pickupDate}
        returnDate={returnDate}
      />
    </div>
  );
};

export default CarDetails;
