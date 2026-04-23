import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// ==============================
// Change Role To Owner
// ==============================
export const changeRoleToOwner = async (
  req,
  res
) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, {
      role: "owner",
    });

    res.json({
      success: true,
      message:
        "Now you can list cars",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
//  Add Car
// ==============================
export const addCar = async (
  req,
  res
) => {
  try {
    const { _id } = req.user;

    const carData = JSON.parse(
      req.body.carData
    );

    const imageFiles =
      req.files || [];

    let imageUrls = [];

    for (const file of imageFiles) {
      const fileBuffer =
        fs.readFileSync(
          file.path
        );

      const uploaded =
        await imagekit.upload({
          file: fileBuffer,
          fileName:
            file.originalname,
          folder: "/cars",
        });

      const optimizedUrl =
        imagekit.url({
          path: uploaded.filePath,
          transformation: [
            {
              width: "1280",
            },
            {
              quality:
                "auto",
            },
            {
              format:
                "webp",
            },
          ],
        });

      imageUrls.push(
        optimizedUrl
      );
    }

    const newCar =
      await Car.create({
        ...carData,
        owner: _id,
        whatsapp:
          carData.whatsapp ||
          "",
        email:
          carData.email ||
          "",
        categories:
          carData.categories ||
          [],
        location:
          carData.location ||
          {},
        images: imageUrls,
        isAvailable: true,
      });

    res.json({
      success: true,
      message: "Car Added",
      car: newCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
//  Get Owner Cars
// ==============================
export const getOwnerCars = async (
  req,
  res
) => {
  try {
    const { _id } = req.user;

    const cars =
      await Car.find({
        owner: _id,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      cars,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
//  Toggle Car Availability
// ==============================
export const toggleCarAvailability =
  async (req, res) => {
    try {
      const { _id } =
        req.user;

      const { carId } =
        req.body;

      const car =
        await Car.findById(
          carId
        );

      if (!car) {
        return res.json({
          success: false,
          message:
            "Car not found",
        });
      }

      if (
        car.owner.toString() !==
        _id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      car.isAvailable =
        !car.isAvailable;

      await car.save();

      res.json({
        success: true,
        message:
          "Availability updated",
      });
    } catch (error) {
      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==============================
//  Delete Car
// ==============================
export const deleteCar = async (
  req,
  res
) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car =
      await Car.findById(
        carId
      );

    if (!car) {
      return res.json({
        success: false,
        message:
          "Car not found",
      });
    }

    if (
      car.owner.toString() !==
      _id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    const activeBooking =
      await Booking.findOne({
        car: carId,
        status: {
          $in: [
            "pending",
            "confirmed",
          ],
        },
      });

    if (activeBooking) {
      return res.json({
        success: false,
        message:
          "Cannot delete booked car",
      });
    }

    await Car.findByIdAndDelete(
      carId
    );

    res.json({
      success: true,
      message:
        "Car deleted permanently",
    });
  } catch (error) {
    res.json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==============================
//  Dashboard Data
// ==============================
export const getDashboardData =
  async (req, res) => {
    try {
      const {
        _id,
        role,
      } = req.user;

      if (
        role !== "owner"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      const [cars, bookings] =
        await Promise.all([
          Car.find({
            owner: _id,
          }),
          Booking.find({
            owner: _id,
          })
            .populate("car")
            .populate("user")
            .sort({
              createdAt: -1,
            }),
        ]);

      const pending =
        bookings.filter(
          (item) =>
            item.status ===
            "pending"
        );

      const confirmed =
        bookings.filter(
          (item) =>
            item.status ===
            "confirmed"
        );

      const monthlyRevenue =
        confirmed.reduce(
          (sum, item) =>
            sum +
            (item.price ||
              0),
          0
        );

      res.json({
        success: true,
        dashboardData: {
          totalCars:
            cars.length,
          totalBookings:
            bookings.length,
          pendingBookings:
            pending.length,
          completedBookings:
            confirmed.length,
          recentBookings:
            bookings,
          monthlyRevenue,
        },
      });
    } catch (error) {
      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==============================
//  Update Car
// ==============================
export const updateCar = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const { _id } =
      req.user;

    let updateData =
      JSON.parse(
        req.body.carData ||
          "{}"
      );

    if (
      req.files &&
      req.files.length > 0
    ) {
      let imageUrls = [];

      for (const file of req.files) {
        const fileBuffer =
          fs.readFileSync(
            file.path
          );

        const uploaded =
          await imagekit.upload(
            {
              file: fileBuffer,
              fileName:
                file.originalname,
              folder:
                "/cars",
            }
          );

        const optimizedUrl =
          imagekit.url({
            path: uploaded.filePath,
            transformation: [
              {
                width:
                  "1280",
              },
              {
                quality:
                  "auto",
              },
              {
                format:
                  "webp",
              },
            ],
          });

        imageUrls.push(
          optimizedUrl
        );
      }

      updateData.images =
        imageUrls;
    }

    const car =
      await Car.findById(
        id
      );

    if (!car) {
      return res.status(404).json({
        success: false,
        message:
          "Car not found",
      });
    }

    if (
      car.owner.toString() !==
      _id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    Object.assign(
      car,
      updateData
    );

    const updatedCar =
      await car.save();

    res.json({
      success: true,
      message:
        "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==============================
//  Update User Image
// ==============================
export const updateUserImage =
  async (req, res) => {
    try {
      const { _id } =
        req.user;

      const imageFile =
        req.file;

      if (!imageFile) {
        return res.json({
          success: false,
          message:
            "No image uploaded",
        });
      }

      const fileBuffer =
        fs.readFileSync(
          imageFile.path
        );

      const uploaded =
        await imagekit.upload({
          file: fileBuffer,
          fileName:
            imageFile.originalname,
          folder: "/users",
        });

      const imageUrl =
        imagekit.url({
          path: uploaded.filePath,
          transformation: [
            {
              width:
                "400",
            },
            {
              quality:
                "auto",
            },
            {
              format:
                "webp",
            },
          ],
        });

      await User.findByIdAndUpdate(
        _id,
        {
          image: imageUrl,
        }
      );

      res.json({
        success: true,
        message:
          "Image updated",
      });
    } catch (error) {
      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };