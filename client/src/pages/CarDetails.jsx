import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BookNowModal from "../components/BookNowModal";

const CarDetails = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

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

  const today = new Date().toISOString().split("T")[0];

  const handleBookNow = () => {
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates first!");
      return;
    }

    //  Extra validation
    if (new Date(returnDate) <= new Date(pickupDate)) {
      alert("Return date must be after pickup date");
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
         Car details not available!
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

        {/*  Pickup Date FIX */}
        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={pickupDate}
          min={today}   //  past disable
          onChange={(e) => {
            setPickupDate(e.target.value);

            // reset return date if invalid
            if (returnDate && e.target.value >= returnDate) {
              setReturnDate("");
            }
          }}
        />

        <label className="block mb-2 font-medium">Return Date</label>

        {/*  Return Date FIX */}
        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={returnDate}
          min={pickupDate || today}  //  MAIN FIX
          onChange={(e) => setReturnDate(e.target.value)}
        />

        {/*  Button disable */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:bg-gray-400"
          onClick={handleBookNow}
          disabled={!pickupDate || !returnDate}
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