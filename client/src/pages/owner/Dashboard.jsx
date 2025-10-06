import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* ✅ Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* ✅ Recent Bookings Section */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500 mb-2">Latest customer bookings</p>

          {!data.recentBookings || data.recentBookings.length === 0 ? (
            <p className="text-gray-400 mt-4">No bookings found</p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {data.recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="mt-3 flex items-center justify-between border-b border-gray-100 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <img src={assets.listIconColored} alt="" className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 text-sm sm:text-base">
                        {booking.car?.brand || "Unknown"} {booking.car?.model || ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.createdAt?.split("T")[0] || "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-medium text-xs sm:text-sm">
                    <p className="text-gray-500">
                      {currency}
                      {booking.price || booking.totalPrice || 0}
                    </p>
                    <p
                      className={`px-3 py-0.5 border rounded-full text-xs capitalize ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {booking.status || "pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Monthly Revenue Section */}
        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data.monthlyRevenue || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
