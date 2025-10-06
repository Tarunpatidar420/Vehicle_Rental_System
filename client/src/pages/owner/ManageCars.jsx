import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);
  const [viewCar, setViewCar] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState({});

  // ✅ Fetch owner's cars
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

  // ✅ Toggle availability
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

  // ✅ Delete car
  const deleteCar = async (carId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this car?")) return;

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

  // ✅ Open edit modal
  const openEdit = (car) => {
    setEditingCar(car);
    setForm(car);
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update car info
  const updateCar = async () => {
    try {
      const formData = new FormData();
      formData.append("carData", JSON.stringify(form));

      if (form.newImages) {
        Array.from(form.newImages).forEach((img) =>
          formData.append("images", img)
        );
      }

      const { data } = await axios.put(
        `/api/owner/update-car/${editingCar._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
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

      {/* ✅ Table */}
      <div className="max-w-5xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-[700px]">
            <thead className="text-gray-500 bg-gray-50">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium max-md:hidden">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-400">
                    No cars found
                  </td>
                </tr>
              ) : (
                cars.map((car, index) => (
                  <tr
                    key={index}
                    className="border-t border-borderColor hover:bg-gray-50 transition"
                  >
                    {/* ✅ Car Info */}
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

                    <td className="p-3 max-md:hidden">
                      {car.categories?.join(", ") || "N/A"}
                    </td>

                    <td className="p-3 font-medium">
                      {currency}
                      {car.pricePerDay}/day
                    </td>

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

                    {/* ✅ Actions (Mobile Responsive like ManageBookings.jsx) */}
                    <td className="p-3">
                      <div className="flex flex-wrap items-center justify-start gap-2 md:gap-3">
                        <button
                          onClick={() => toggleAvailability(car._id)}
                          className="flex items-center justify-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs sm:text-sm transition w-full sm:w-auto"
                        >
                          <img
                            src={
                              car.isAvailable
                                ? assets.eye_close_icon
                                : assets.eye_icon
                            }
                            alt="toggle"
                            className="w-4 h-4 mr-1"
                          />
                          {car.isAvailable ? "Hide" : "Show"}
                        </button>

                        <button
                          onClick={() => setViewCar(car)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600 transition w-full sm:w-auto"
                        >
                          View
                        </button>

                        <button
                          onClick={() => openEdit(car)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded text-xs sm:text-sm hover:bg-yellow-500 transition w-full sm:w-auto"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteCar(car._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600 transition w-full sm:w-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ View Modal */}
      {viewCar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {viewCar.brand} {viewCar.model}
            </h2>

            {/* Images */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {viewCar.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="car"
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>

            <p><b>Year:</b> {viewCar.year}</p>
            <p><b>Category:</b> {viewCar.categories?.join(", ")}</p>
            <p><b>Seating:</b> {viewCar.seating_capacity}</p>
            <p><b>Fuel:</b> {viewCar.fuel_type}</p>
            <p><b>Transmission:</b> {viewCar.transmission}</p>
            <p><b>Discount:</b> {viewCar.discount}%</p>
            <p><b>Available Count:</b> {viewCar.availableCount}</p>
            <p><b>Price:</b> {currency}{viewCar.pricePerDay}/day</p>
            <p><b>Description:</b> {viewCar.description}</p>
            <p>
              <b>Location:</b> {viewCar.location?.line1}, {viewCar.location?.line2},{" "}
              {viewCar.location?.city}, {viewCar.location?.state} -{" "}
              {viewCar.location?.pincode}
            </p>
            <p><b>Email:</b> {viewCar.email}</p>
            <p><b>Whatsapp:</b> {viewCar.whatsapp}</p>
            <p><b>Added On:</b> {viewCar.createdAt?.split("T")[0]}</p>
            <p><b>Last Updated:</b> {viewCar.updatedAt?.split("T")[0]}</p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewCar(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Car</h2>

            {[
              "brand",
              "model",
              "year",
              "seating_capacity",
              "availableCount",
              "discount",
              "pricePerDay",
              "fuel_type",
              "transmission",
            ].map((field) => (
              <input
                key={field}
                type={
                  field.includes("price") || field.includes("count")
                    ? "number"
                    : "text"
                }
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                className="w-full mb-3 border p-2 rounded"
              />
            ))}

            <input
              type="text"
              name="categories"
              value={form.categories?.join(", ") || ""}
              onChange={(e) =>
                setForm({ ...form, categories: e.target.value.split(",") })
              }
              placeholder="Categories (comma separated)"
              className="w-full mb-3 border p-2 rounded"
            />

            {/* Location */}
            {["line1", "line2", "city", "state", "pincode"].map((loc) => (
              <input
                key={loc}
                type="text"
                name={loc}
                value={form.location?.[loc] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: { ...form.location, [loc]: e.target.value },
                  })
                }
                placeholder={`Address ${loc}`}
                className="w-full mb-3 border p-2 rounded"
              />
            ))}

            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="Contact Email"
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp || ""}
              onChange={handleChange}
              placeholder="Whatsapp Number"
              className="w-full mb-3 border p-2 rounded"
            />

            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Description"
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="file"
              multiple
              onChange={(e) =>
                setForm({ ...form, newImages: e.target.files })
              }
              className="w-full mb-3 border p-2 rounded"
            />

            <p className="text-sm text-gray-500 mt-2">
              Added On: {form.createdAt?.split("T")[0]} | Last Updated:{" "}
              {form.updatedAt?.split("T")[0]}
            </p>

            <div className="flex justify-end gap-3 mt-4">
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
