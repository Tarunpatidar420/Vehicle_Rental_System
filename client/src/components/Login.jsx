import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const OWNER_EMAIL = "tarunpatidarrupariya@gmail.com";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [dashboardKey, setDashboardKey] = React.useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const payload =
        state === "login"
          ? { email, password }
          : { name, email, password };

      // ✅ Agar owner hai to dashboardKey required hai
      if (email === OWNER_EMAIL && state === "login") {
        if (!dashboardKey) {
          toast.error("Dashboard Key is required for owner login");
          return;
        }
        payload.dashboardKey = dashboardKey;
      }

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (data.success && data.token) {
        // ✅ Save token
        localStorage.setItem("token", data.token);
        setToken(data.token);

        // ✅ Save user email
        localStorage.setItem("userEmail", email);

        // ✅ Agar owner hai to dashboard key bhi save
        if (email === OWNER_EMAIL && dashboardKey) {
          localStorage.setItem("dashboardKey", dashboardKey);
        }

        toast.success(`${state === "login" ? "Login" : "Signup"} successful`);
        setShowLogin(false);

        // ✅ Redirect owner -> dashboard | user -> home
        if (email === OWNER_EMAIL) {
          navigate("/owner"); // Owner ko dashboard bhejo
        } else {
          navigate("/"); // Normal user home
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">
            {email === OWNER_EMAIL ? "Owner" : "User"}
          </span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name - only register */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {/* ✅ Owner Dashboard Key (only owner login) */}
        {state === "login" && email === OWNER_EMAIL && (
          <div className="w-full">
            <p>Dashboard Access Key</p>
            <input
              onChange={(e) => setDashboardKey(e.target.value)}
              value={dashboardKey}
              placeholder="Enter dashboard key"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {/* Toggle Login/Register */}
        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
