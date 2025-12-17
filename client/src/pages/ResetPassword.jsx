import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { token } = useParams();
  const { resetPassword } = useContext(AppContext);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(token, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-primary"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg transition-all"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
