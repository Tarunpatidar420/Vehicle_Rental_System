import { createContext, useContext, useEffect, useState } from "react";
import axiosLib from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [dashboardKey, setDashboardKey] = useState(localStorage.getItem("dashboardKey") || null); // ✅ added
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ✅ Set Bearer token + dashboardKey for axios
  const setAuthHeaders = (token, dashboardKey) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    if (dashboardKey) {
      axios.defaults.headers.common["x-dashboard-key"] = dashboardKey;
    } else {
      delete axios.defaults.headers.common["x-dashboard-key"];
    }
  };

  // ✅ Fetch user data
  const fetchUser = async () => {
    if (!token) return; // token missing -> skip fetch
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
    localStorage.removeItem("dashboardKey"); // ✅ remove key
    setToken(null);
    setDashboardKey(null);
    setUser(null);
    setIsOwner(false);
    setAuthHeaders(null, null);
    toast.success("You have been logged out");
    navigate("/");
  };

  // ✅ Init on mount or token/dashboardKey change
  useEffect(() => {
    setAuthHeaders(token, dashboardKey);
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
    setDashboardKey, // ✅ expose setter
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
