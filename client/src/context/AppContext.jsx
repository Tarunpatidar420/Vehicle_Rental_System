
// import { createContext, useContext, useEffect, useState } from "react";
// import axiosLib from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const axios = axiosLib.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL, // ✅ Fix: BASE_URL → BACKEND_URL
// });

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const currency = import.meta.env.VITE_CURRENCY;

//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [dashboardKey, setDashboardKey] = useState(localStorage.getItem("dashboardKey") || null);
//   const [user, setUser] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [pickupDate, setPickupDate] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [cars, setCars] = useState([]);

//   // ✅ Add interceptor to attach token + dashboardKey automatically
  

//   // ✅ Fetch user data
//   const fetchUser = async () => {
//     if (!token) return;
//     try {
//       const { data } = await axios.get("/api/user/data");
//       if (data?.success && data?.user) {
//         setUser(data.user);
//         setIsOwner(data.user.role === "owner");
//       } else {
//         setUser(null);
//         setIsOwner(false);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//       setUser(null);
//       setIsOwner(false);
//     }
//   };

//   // ✅ Fetch only available cars
//   const fetchCars = async () => {
//     try {
//       const { data } = await axios.get("/api/vehicles/available");
//       if (data?.success) {
//         setCars(data.cars);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   // ✅ Logout
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("dashboardKey");
//     setToken(null);
//     setDashboardKey(null);
//     setUser(null);
//     setIsOwner(false);
//     toast.success("You have been logged out");
//     navigate("/");
//   };

//   // ✅ Init on mount
//   useEffect(() => {
//   const interceptor = axios.interceptors.request.use((config) => {
//     const t = localStorage.getItem("token");
//     const dk = localStorage.getItem("dashboardKey");

//     if (t) config.headers.Authorization = `Bearer ${t}`;
//     if (dk) config.headers["x-dashboard-key"] = dk;

//     return config;
//   });

//   // cleanup – VERY IMPORTANT
//   return () => {
//     axios.interceptors.request.eject(interceptor);
//   };
// }, []);
// // ✅ Fetch data when token / dashboardKey changes
// useEffect(() => {
//   fetchUser();
//   fetchCars();
// }, [token, dashboardKey]);


//   const value = {
//     navigate,
//     currency,
//     axios,
//     user,
//     setUser,
//     token,
//     setToken,
//     dashboardKey,
//     setDashboardKey,
//     isOwner,
//     setIsOwner,
//     fetchUser,
//     showLogin,
//     setShowLogin,
//     logout,
//     fetchCars,
//     cars,
//     setCars,
//     pickupDate,
//     setPickupDate,
//     returnDate,
//     setReturnDate,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => useContext(AppContext);


import { createContext, useContext, useEffect, useState } from "react";
import axiosLib from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ✅ Axios instance
const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [dashboardKey, setDashboardKey] = useState(
    localStorage.getItem("dashboardKey") || null
  );
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ================================
  // 🔐 Axios Interceptor (Token + DashboardKey)
  // ================================
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const t = localStorage.getItem("token");
      const dk = localStorage.getItem("dashboardKey");

      if (t) config.headers.Authorization = `Bearer ${t}`;
      if (dk) config.headers["x-dashboard-key"] = dk;

      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // ================================
  // 👤 Fetch Logged-in User
  // ================================
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

  // ================================
  // 🚗 Fetch Available Cars
  // ================================
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

  // ================================
  // 🔓 Logout
  // ================================
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

  // ================================
  // 🔑 Forgot Password
  // ================================
  const forgotPassword = async (email) => {
    try {
      const { data } = await axios.post("/api/auth/forgot-password", { email });
      toast.success(data.message || "Reset link sent to email");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // ================================
  // 🔁 Reset Password
  // ================================
  const resetPassword = async (token, password) => {
    try {
      const { data } = await axios.post(
        `/api/auth/reset-password/${token}`,
        { password }
      );
      toast.success(data.message || "Password reset successfully");
      navigate("/"); // back to login
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // ================================
  // 🔄 Auto Fetch on Token Change
  // ================================
  useEffect(() => {
    fetchUser();
    fetchCars();
  }, [token, dashboardKey]);

  // ================================
  // 🌍 Context Value
  // ================================
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
    forgotPassword,   // ✅ NEW
    resetPassword,    // ✅ NEW
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

