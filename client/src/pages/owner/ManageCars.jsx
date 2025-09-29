import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState({});

  // ✅ Owner के सभी cars लाना
  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Availability toggle
  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Car delete
  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this car?");
      if (!confirm) return;

      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Edit open
  const openEdit = (car) => {
    setEditingCar(car);
    setForm(car); // initial values
  };

  // ✅ Form value change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Car update (frontend → backend call)
  const updateCar = async () => {
    try {
      const formData = new FormData();
      formData.append("carData", JSON.stringify(form));

      const { data } = await axios.put(
        `/api/owner/update-car/${editingCar._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setEditingCar(null);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                {/* Car Info */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.images?.[0] || assets.default_car}
                    alt={car.model}
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className="p-3 max-md:hidden">
                  {car.categories?.[0] || "N/A"}
                </td>

                {/* Price */}
                <td className="p-3">
                  {currency}
                  {car.pricePerDay}/day
                </td>

                {/* Availability */}
                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailable
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                {/* Actions */}
                <td className="flex items-center p-3 gap-3">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                    alt="toggle"
                    className="cursor-pointer w-5 h-5"
                  />

                  {/* ✅ Edit Button */}
                  <button
                    onClick={() => openEdit(car)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded text-xs"
                  >
                    Edit
                  </button>

                  <img
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt="delete"
                    className="cursor-pointer w-5 h-5"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Car</h2>

            {/* Brand */}
            <input
              type="text"
              name="brand"
              value={form.brand || ""}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Model */}
            <input
              type="text"
              name="model"
              value={form.model || ""}
              onChange={handleChange}
              placeholder="Model"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Year */}
            <input
              type="number"
              name="year"
              value={form.year || ""}
              onChange={handleChange}
              placeholder="Year"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Price */}
            <input
              type="number"
              name="pricePerDay"
              value={form.pricePerDay || ""}
              onChange={handleChange}
              placeholder="Price Per Day"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="Contact Email"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Whatsapp */}
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp || ""}
              onChange={handleChange}
              placeholder="Whatsapp Number"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Transmission */}
            <input
              type="text"
              name="transmission"
              value={form.transmission || ""}
              onChange={handleChange}
              placeholder="Transmission (Manual/Automatic)"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Seating */}
            <input
              type="number"
              name="seating_capacity"
              value={form.seating_capacity || ""}
              onChange={handleChange}
              placeholder="Seating Capacity"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Description */}
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Description"
              className="w-full mb-3 border p-2 rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingCar(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateCar}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
