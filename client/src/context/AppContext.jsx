import { createContext, useContext, useEffect, useState } from "react";
import axiosLib from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // ✅ Fix: BASE_URL → BACKEND_URL
});

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [dashboardKey, setDashboardKey] = useState(localStorage.getItem("dashboardKey") || null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ✅ Add interceptor to attach token + dashboardKey automatically
  axios.interceptors.request.use((config) => {
    const t = localStorage.getItem("token");
    const dk = localStorage.getItem("dashboardKey");

    if (t) config.headers["Authorization"] = `Bearer ${t}`;
    if (dk) config.headers["x-dashboard-key"] = dk;

    return config;
  });

  // ✅ Fetch user data
  const fetchUser = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/user/data");
      if (data?.success && data?.user) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setUser(null);
      setIsOwner(false);
    }
  };

  // ✅ Fetch only available cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/vehicles/available");
      if (data?.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dashboardKey");
    setToken(null);
    setDashboardKey(null);
    setUser(null);
    setIsOwner(false);
    toast.success("You have been logged out");
    navigate("/");
  };

  // ✅ Init on mount
  useEffect(() => {
    fetchUser();
    fetchCars();
  }, [token, dashboardKey]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    dashboardKey,
    setDashboardKey,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
