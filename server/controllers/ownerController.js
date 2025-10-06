import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

/* =========================================================================
   ✅ Change User Role to Owner
   ========================================================================= */
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.error("changeRoleToOwner Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================================
   ✅ Add Car (with optional multiple images)
   ========================================================================= */
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFiles = req.files;
    let optimizedImageUrls = [];

    // ✅ Upload images to ImageKit
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const fileBuffer = fs.readFileSync(file.path);
        const uploadRes = await imagekit.upload({
          file: fileBuffer,
          fileName: file.originalname,
          folder: "/cars",
        });

        const optimizedUrl = imagekit.url({
          path: uploadRes.filePath,
          transformation: [
            { width: "1280" },
            { quality: "auto" },
            { format: "webp" },
          ],
        });

        optimizedImageUrls.push(optimizedUrl);
      }
    }

    const newCar = await Car.create({
      ...car,
      whatsapp: car.whatsapp || "",
      email: car.email || "",
      categories: car.categories || [],
      location: car.location || {},
      owner: _id,
      images: optimizedImageUrls,
      isAvailable: true,
    });

    res.json({ success: true, message: "Car Added", car: newCar });
  } catch (error) {
    console.error("Add Car Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================================
   ✅ Get Owner's Cars
   ========================================================================= */
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.error("Get Owner Cars Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================================
   ✅ Toggle Car Availability
   ========================================================================= */
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });
    if (car.owner.toString() !== _id.toString())
      return res.json({ success: false, message: "Unauthorized" });

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.error("Toggle Availability Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================================
   ✅ Delete Car (Hard Delete)
   ========================================================================= */
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });
    if (car.owner.toString() !== _id.toString())
      return res.json({ success: false, message: "Unauthorized" });

    await Car.findByIdAndDelete(carId);
    res.json({ success: true, message: "Car Deleted Permanently" });
  } catch (error) {
    console.error("Delete Car Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================================
   ✅ Owner Dashboard Data (All bookings visible + performance safe)
   ========================================================================= */
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // ✅ Fetch data
    const [cars, bookings] = await Promise.all([
      Car.find({ owner: _id }),
      Booking.find({ owner: _id }).populate("car").sort({ createdAt: -1 }),
    ]);

    // ✅ Status wise split
    const pendingBookings = bookings.filter(b => b.status === "pending");
    const completedBookings = bookings.filter(b => b.status === "confirmed");

    // ✅ Monthly revenue
    const monthlyRevenue = completedBookings.reduce(
      (acc, b) => acc + (b.totalPrice || b.price || 0),
      0
    );

    // ✅ Logs for debugging
    console.log("📊 Total Cars:", cars.length);
    console.log("📊 Total Bookings:", bookings.length);

    res.json({
      success: true,
      dashboardData: {
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completedBookings: completedBookings.length,
        recentBookings: bookings, // ✅ ALL BOOKINGS, no limit
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Data Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================================
   ✅ Update Car Info (Full Update)
   ========================================================================= */
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    let updateData = JSON.parse(req.body.carData || "{}");

    // ✅ Handle new images
    if (req.files && req.files.length > 0) {
      let optimizedImageUrls = [];

      for (const file of req.files) {
        const fileBuffer = fs.readFileSync(file.path);
        const uploadRes = await imagekit.upload({
          file: fileBuffer,
          fileName: file.originalname,
          folder: "/cars",
        });

        const optimizedUrl = imagekit.url({
          path: uploadRes.filePath,
          transformation: [
            { width: "1280" },
            { quality: "auto" },
            { format: "webp" },
          ],
        });

        optimizedImageUrls.push(optimizedUrl);
      }
      updateData.images = optimizedImageUrls;
    }

    // ✅ Verify ownership
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });
    if (car.owner.toString() !== _id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    Object.assign(car, updateData);
    const updatedCar = await car.save();

    res.json({
      success: true,
      message: "Car Updated Successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Update Car Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================================
   ✅ Update Owner Profile Image
   ========================================================================= */
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;
    if (!imageFile) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const uploadRes = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      path: uploadRes.filePath,
      transformation: [{ width: "400" }, { quality: "auto" }, { format: "webp" }],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });
    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.error("Update User Image Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
