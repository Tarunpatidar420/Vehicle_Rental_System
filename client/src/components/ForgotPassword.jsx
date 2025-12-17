import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const ForgotPassword = () => {
  const { forgotPassword } = useAppContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white shadow-xl rounded-xl p-8"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Registered Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border rounded-lg outline-primary text-base"
            required
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-medium text-lg
                     bg-gradient-to-r from-blue-500 to-indigo-600
                     hover:opacity-90 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
