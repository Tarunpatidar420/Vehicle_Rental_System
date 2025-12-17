// import React from "react";
// import { useAppContext } from "../context/AppContext";
// import toast from "react-hot-toast";

// const OWNER_EMAIL = "tarunpatidarrupariya@gmail.com";

// const Login = () => {
//   const { setShowLogin, axios, setToken, navigate } = useAppContext();

//   const [state, setState] = React.useState("login");
//   const [name, setName] = React.useState("");
//   const [email, setEmail] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [dashboardKey, setDashboardKey] = React.useState("");

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     // -------------------------
//     // 🔐 PASSWORD VALIDATION
//     // -------------------------
//     if (state === "register") {
//       // Length: 6 to 12
//       if (password.length < 6 || password.length > 12) {
//         toast.error("Password must be between 6 and 12 characters");
//         return;
//       }

//       // First letter capital
//       if (!/^[A-Z]/.test(password)) {
//         toast.error("Password must start with a capital letter");
//         return;
//       }

//       // At least 1 special char
//       if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password)) {
//         toast.error("Password must contain at least one special character");
//         return;
//       }
//     }

//     try {
//       const payload =
//         state === "login"
//           ? { email, password }
//           : { name, email, password };

//       // Owner login dashboard key
//       if (email === OWNER_EMAIL && state === "login") {
//         if (!dashboardKey) {
//           toast.error("Dashboard Key is required for owner login");
//           return;
//         }
//         payload.dashboardKey = dashboardKey;
//       }

//       const { data } = await axios.post(`/api/user/${state}`, payload);

//       if (!data.success) {
//         toast.error(data.message || "Something went wrong");
//         return;
//       }

//       if (data.token) {
//         localStorage.setItem("token", data.token);
//         setToken(data.token);
//       }

//       localStorage.setItem("userEmail", email);

//       if (email === OWNER_EMAIL && dashboardKey) {
//         localStorage.setItem("dashboardKey", dashboardKey);
//       }

//       toast.success(`${state === "login" ? "Login" : "Signup"} successful`);
//       setShowLogin(false);

//       if (email === OWNER_EMAIL) {
//         navigate("/owner");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div
//       onClick={() => setShowLogin(false)}
//       className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
//     >
//       <form
//         onSubmit={onSubmitHandler}
//         onClick={(e) => e.stopPropagation()}
//         className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
//       >
//         <p className="text-2xl font-medium m-auto">
//           <span className="text-primary">
//             {email === OWNER_EMAIL ? "Owner" : "User"}
//           </span>{" "}
//           {state === "login" ? "Login" : "Sign Up"}
//         </p>

//         {/* Name for register */}
//         {state === "register" && (
//           <div className="w-full">
//             <p>Name</p>
//             <input
//               onChange={(e) => setName(e.target.value)}
//               value={name}
//               placeholder="Tarun Patidar"
//               className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
//               type="text"
//               required
//             />
//           </div>
//         )}

//         {/* Email */}
//         <div className="w-full">
//           <p>Email</p>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             placeholder="tarunpatidar@gmail.com"
//             className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
//             type="email"
//             required
//           />
//         </div>

//         {/* Password */}
//         <div className="w-full">
//           <p>Password</p>
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             placeholder="Tarun@2805"
//             className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
//             type="password"
//             required
//           />
//         </div>

//         {/* Owner Dashboard Key */}
//         {state === "login" && email === OWNER_EMAIL && (
//           <div className="w-full">
//             <p>Dashboard Access Key</p>
//             <input
//               onChange={(e) => setDashboardKey(e.target.value)}
//               value={dashboardKey}
//               placeholder="Enter dashboard key"
//               className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
//               type="text"
//               required
//             />
//           </div>
//         )}

//         {/* Toggle Login/Register */}
//         {state === "register" ? (
//           <p>
//             Already have an account?{" "}
//             <span
//               onClick={() => setState("login")}
//               className="text-primary cursor-pointer"
//             >
//               click here
//             </span>
//           </p>
//         ) : (
//           <p>
//             Create an account?{" "}
//             <span
//               onClick={() => setState("register")}
//               className="text-primary cursor-pointer"
//             >
//               click here
//             </span>
//           </p>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer"
//         >
//           {state === "register" ? "Create Account" : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const OWNER_EMAIL = "tarunpatidarrupariya@gmail.com";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dashboardKey, setDashboardKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ✅ CLEAR AUTO-FILLED DATA WHEN MODAL OPENS */
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setDashboardKey("");
    setShowPassword(false);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    /* 📧 EMAIL VALIDATION */
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }

    /* 🔐 PASSWORD VALIDATION (REGISTER ONLY) */
    if (state === "register") {
      if (password.length < 8 || password.length > 16) {
        toast.error("Password must be 8–16 characters long");
        return;
      }
      if (!/^[A-Z]/.test(password)) {
        toast.error("Password must start with a capital letter");
        return;
      }
      if (!/[@#$]/.test(password)) {
        toast.error("Password must include @, # or $");
        return;
      }
    }

    try {
      const payload =
        state === "login"
          ? { email, password }
          : { name, email, password };

      if (state === "login" && email === OWNER_EMAIL) {
        if (!dashboardKey) {
          toast.error("Dashboard key required for owner login");
          return;
        }
        payload.dashboardKey = dashboardKey;
      }

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (!data.success) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      toast.success(state === "login" ? "Login successful" : "Account created");
      setShowLogin(false);
      navigate(email === OWNER_EMAIL ? "/owner" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex items-center bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        autoComplete="off"
        className="m-auto w-80 sm:w-[360px] bg-white rounded-lg shadow-xl p-8 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          {state === "login" ? "Login" : "Create Account"}
        </h2>

        {/* Name */}
        {state === "register" && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          autoComplete="off"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder="Eg: Tarun@1234"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {state === "register" && (
          <p className="text-xs text-gray-500">
            8–16 chars, first letter capital, one special (@ # $)
          </p>
        )}

        {/* Owner Key */}
        {state === "login" && email === OWNER_EMAIL && (
          <input
            placeholder="Dashboard Access Key"
            value={dashboardKey}
            onChange={(e) => setDashboardKey(e.target.value)}
            className="border p-2 rounded"
            required
          />
        )}

        {state === "login" && (
          <p
            onClick={() => {
              setShowLogin(false);
              navigate("/forgot-password");
            }}
            className="text-primary text-sm text-right cursor-pointer"
          >
            Forgot password?
          </p>
        )}

        <p className="text-sm text-center">
          {state === "login" ? "Create an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setState(state === "login" ? "register" : "login")}
            className="text-primary cursor-pointer"
          >
            click here
          </span>
        </p>

        <button className="bg-primary text-white py-2 rounded">
          {state === "login" ? "Login" : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Login;
