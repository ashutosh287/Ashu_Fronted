import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const api = import.meta.env.VITE_BASE_URL;


const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/api/user/logout`, {}, {
        withCredentials: true,
      });

      toast.success("Logged out successfully ✅");

      localStorage.removeItem("orderSummary");
      navigate("/UserLogin");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed ❌");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-100 to-indigo-100 px-4">
      <div className="bg-white shadow-xl p-8 sm:p-10 rounded-2xl max-w-md w-full text-center space-y-6 border border-purple-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">🔒 Logout Confirmation</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
