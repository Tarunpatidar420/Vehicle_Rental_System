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
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ✅ Set Bearer token for axios
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
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

  // ✅ Fetch public cars
  // ✅ Fetch only available cars
// ✅ Fetch public cars
// ✅ Fetch public cars (sirf available filter karo)
// ✅ Fetch available cars from backend
const fetchCars = async () => {
  try {
    const { data } = await axios.get("/api/vehicles/available");  // ✅ new endpoint
    if (data?.success) {
      setCars(data.cars);  // already backend se sirf available cars aa rahi hain
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
    setToken(null);
    setUser(null);
    setIsOwner(false);
    setAuthToken(null);
    toast.success("You have been logged out");
    navigate("/");
  };

  // ✅ Init on mount or token change
  useEffect(() => {
    setAuthToken(token);
    fetchUser();
    fetchCars();
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
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
