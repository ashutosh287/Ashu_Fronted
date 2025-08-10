import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { showSuccessToast, showErrorToast } from "../ToastifyNotification/Notification";

const SellerLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/api/login", // ✅ correct API path
        form,
        {
          withCredentials: true, // ✅ allow cookies to be sent/received
        }
      );

      // ✅ No need to store token in localStorage for cookie-based auth
      // But we can store seller data if needed
      localStorage.setItem("sellerData", JSON.stringify(res.data.seller));

      showSuccessToast("Logged in successfully!");
      navigate("/sell/manage");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg?.includes("locked")) {
        showErrorToast(msg); // “Account locked. Try again in X minutes.”
      } else if (msg?.includes("Invalid credentials")) {
        showErrorToast("Wrong email or password.");
      } else {
        showErrorToast(msg || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <div className="bg-purple-100 rounded-full p-3 mb-2">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">Seller Login</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Access your seller dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm" htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              onChange={handleChange}
              value={form.email}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm" htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              onChange={handleChange}
              value={form.password}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm transition"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-lg text-gray-600 hover:text-purple-600 transition underline text-sm "
              onClick={() => navigate("/seller/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div>
        </div>

        <div className="text-center  ">
          <span className="text-gray-500 text-xs sm:text-sm">Don't have an account?</span>
          <button
            className="ml-2 text-purple-600 hover:underline text-xs sm:text-sm font-medium"
            onClick={() => navigate("/seller/portal/signup")}
            type="button"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
