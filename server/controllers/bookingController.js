import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// ==============================
//  Check Availability
// ==============================
export const checkAvailabilityOfCar = async (
  req,
  res
) => {
  try {
    const cars = await Car.find({
      isAvailable: true,
    });

    const availableCars =
      cars.filter(
        (car) =>
          car.availableCount >
          0
      );

    res.json({
      success: true,
      availableCars,
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
//  Create Booking
// ==============================
export const createBooking = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Login required",
      });
    }

    const {
      car,
      pickupDate,
      returnDate,
      name,
      email,
      whatsapp,
      address,
      pincode,
      vehicleUse,
      otherUse,
      paymentMethod,
    } = req.body;

    const picked =
      new Date(
        pickupDate
      );
    const returned =
      new Date(
        returnDate
      );

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (picked < today) {
      return res.json({
        success: false,
        message:
          "Pickup date cannot be past",
      });
    }

    if (
      returned <= picked
    ) {
      return res.json({
        success: false,
        message:
          "Return date must be after pickup",
      });
    }

    const carData =
      await Car.findOneAndUpdate(
        {
          _id: car,
          availableCount:
            {
              $gt: 0,
            },
        },
        {
          $inc: {
            availableCount:
              -1,
          },
        },
        {
          new: true,
        }
      );

    if (!carData) {
      return res.json({
        success: false,
        message:
          "Vehicle unavailable",
      });
    }

    if (
      carData.availableCount ===
      0
    ) {
      carData.isAvailable =
        false;
      await carData.save();
    }

    const totalDays =
      Math.max(
        1,
        Math.ceil(
          (returned -
            picked) /
            (1000 *
              60 *
              60 *
              24)
        )
      );

    const price =
      carData.pricePerDay *
      totalDays;

    const booking =
      await Booking.create({
        car,
        owner:
          carData.owner,
        user:
          req.user._id,
        pickupDate:
          picked,
        returnDate:
          returned,
        price,
        name,
        email,
        whatsapp,
        address,
        pincode,
        vehicleUse,
        otherUse,
        paymentMethod:
          paymentMethod ||
          "offline",
        status:
          "pending",
      });

    res.json({
      success: true,
      booking,
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
//  Cancel Booking
// ==============================
export const cancelBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      return res.json({
        success: false,
        message:
          "Booking not found",
      });
    }

    if (
      booking.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    if (
      booking.status ===
      "cancelled"
    ) {
      return res.json({
        success: false,
        message:
          "Already cancelled",
      });
    }

    booking.status =
      "cancelled";

    await booking.save();

    const car =
      await Car.findById(
        booking.car
      );

    if (car) {
      car.availableCount +=
        1;
      car.isAvailable =
        true;
      await car.save();
    }

    res.json({
      success: true,
      message:
        "Booking cancelled successfully",
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
//  Exchange Booking
// Price increase/decrease auto
// ==============================
export const exchangeBookingVehicle =
  async (req, res) => {
    try {
      const { newCarId } =
        req.body;

      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.json({
          success: false,
          message:
            "Booking not found",
        });
      }

      if (
        booking.status ===
        "cancelled"
      ) {
        return res.json({
          success: false,
          message:
            "Cancelled booking cannot exchange",
        });
      }

      const oldCar =
        await Car.findById(
          booking.car
        );

      const newCar =
        await Car.findOne({
          _id: newCarId,
          availableCount:
            {
              $gt: 0,
            },
        });

      if (!newCar) {
        return res.json({
          success: false,
          message:
            "New vehicle unavailable",
        });
      }

      // restore old car
      oldCar.availableCount +=
        1;
      oldCar.isAvailable =
        true;
      await oldCar.save();

      // reduce new car
      newCar.availableCount -=
        1;

      if (
        newCar.availableCount ===
        0
      ) {
        newCar.isAvailable =
          false;
      }

      await newCar.save();

      // total days
      const totalDays =
        Math.max(
          1,
          Math.ceil(
            (new Date(
              booking.returnDate
            ) -
              new Date(
                booking.pickupDate
              )) /
              (1000 *
                60 *
                60 *
                24)
          )
        );

      // new price calculate
      const newPrice =
        newCar.pricePerDay *
        totalDays;

      booking.car =
        newCarId;
      booking.price =
        newPrice;

      await booking.save();

      res.json({
        success: true,
        message:
          "Vehicle exchanged successfully",
        booking,
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
//  User Bookings
// ==============================
export const getUserBookings = async (
  req,
  res
) => {
  try {
    const bookings =
      await Booking.find({
        user:
          req.user._id,
      })
        .populate("car")
        .sort({
          createdAt:
            -1,
        });

    res.json({
      success: true,
      bookings,
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
//  Owner Bookings
// ==============================
export const getOwnerBookings =
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          owner:
            req.user._id,
        })
          .populate("car")
          .populate("user")
          .sort({
            createdAt:
              -1,
          });

      res.json({
        success: true,
        bookings,
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
//  Change Status
// ==============================
export const changeBookingStatus =
  async (req, res) => {
    try {
      const {
        bookingId,
        status,
      } = req.body;

      const booking =
        await Booking.findById(
          bookingId
        );

      if (!booking) {
        return res.json({
          success: false,
          message:
            "Booking not found",
        });
      }

      if (
        booking.owner.toString() !==
        req.user._id.toString()
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      booking.status =
        status;

      await booking.save();

      res.json({
        success: true,
        booking,
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
//  Delete Booking
// only cancelled booking
// ==============================
export const deleteBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      return res.json({
        success: false,
        message:
          "Booking not found",
      });
    }

    if (
      booking.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    if (
      booking.status !==
      "cancelled"
    ) {
      return res.json({
        success: false,
        message:
          "Only cancelled booking can delete",
      });
    }

    await Booking.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Booking deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message:
        error.message,
    });
  }
};