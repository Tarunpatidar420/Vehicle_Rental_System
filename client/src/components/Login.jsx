import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// ✅ ONLY for UI condition (security backend pe hai)
const OWNER_EMAIL = "tarunpatidarrupariya@gmail.com";

const Login = () => {
  const {
    setShowLogin,
    axios,
    setToken,
    navigate,
    setIsOwner,
  } = useAppContext();

  const [state, setState] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dashboardKey, setDashboardKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔄 clear form when modal opens
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setDashboardKey("");
    setShowPassword(false);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const payload =
        state === "login"
          ? { email, password }
          : { name, email, password };

      // ✅ dashboardKey ONLY if owner email
      if (state === "login" && email === OWNER_EMAIL) {
        payload.dashboardKey = dashboardKey;
      }

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      // 🔐 Save token
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // 👑 OWNER → backend decides
      if (data.isOwner) {
        setIsOwner(true);
        navigate("/owner");
      } else {
        setIsOwner(false);
        navigate("/");
      }

      setShowLogin(false);
      toast.success(
        state === "login" ? "Login successful" : "Account created"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
        className="m-auto w-80 bg-white rounded-lg shadow-xl p-8 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          {state === "login" ? "Login" : "Create Account"}
        </h2>

        {/* Name (register only) */}
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
            placeholder="Eg: Tarun@123"
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

        {/* 🔑 Dashboard key → ONLY owner email */}
        {state === "login" && email === OWNER_EMAIL && (
          <input
            placeholder="Dashboard key (owner only)"
            value={dashboardKey}
            onChange={(e) => setDashboardKey(e.target.value)}
            className="border p-2 rounded"
            required
          />
        )}

        {/* 🔹 FORGOT PASSWORD LINK (NEW) */}
        {state === "login" && (
          <p
            onClick={() => {
              setShowLogin(false);
              navigate("/forgot-password");
            }}
            className="text-sm text-right text-primary cursor-pointer"
          >
            Forgot password?
          </p>
        )}

        {/* Toggle login/register */}
        <p className="text-sm text-center">
          {state === "login" ? "Create account?" : "Already have account?"}{" "}
          <span
            onClick={() =>
              setState(state === "login" ? "register" : "login")
            }
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
