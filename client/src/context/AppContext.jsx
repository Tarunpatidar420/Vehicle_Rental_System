import { createContext, useContext, useEffect, useState } from "react";
import axiosLib from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


   // Axios Instance

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // 🔥 backend decides
  const [showLogin, setShowLogin] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  
     //Axios Interceptor

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const t = localStorage.getItem("token");
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  /* =========================
      Fetch Logged-in User
      OWNER comes from backend
========================= */
  const fetchUser = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/api/user/data");

      if (data?.success && data?.user) {
        setUser(data.user);
        setIsOwner(Boolean(data.user.isOwner)); //  ONLY HERE
      } else {
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      setUser(null);
      setIsOwner(false);
    }
  };

  /* =========================
      Fetch vehicles
========================= */
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/vehicles/available");
      if (data?.success) {
        setCars(data.cars);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  /* =========================
      Logout
========================= */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  /* =========================
      Auto Fetch
========================= */
  useEffect(() => {
    fetchUser();
    fetchCars();
  }, [token]);

  /* =========================
      Context Value
========================= */
  const value = {
    navigate,
    currency,
    axios,
    user,
    token,
    setToken,
    isOwner,
    setIsOwner, //  normally only Login.jsx uses this
    showLogin,
    setShowLogin,
    logout,
    cars,
    fetchCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
