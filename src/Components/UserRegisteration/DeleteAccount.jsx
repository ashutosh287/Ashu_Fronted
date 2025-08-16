import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_BASE_URL;


const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? You won't be able to log in again."
    );

    if (!confirm) return;

    try {
      // Step 1: Delete account
      const response = await axios.patch(
        `${api}/api/user/delete-account`,
        {},
        {
          withCredentials: true, // 🟢 Send cookies
        }
      );

      // Step 2: Logout (remove token cookie)
      await axios.post(`${api}/api/user/logout`, {}, { withCredentials: true });

      // Step 3: Clear any localStorage (if used)
      localStorage.clear();

      // Step 4: Redirect
      alert(response.data.message || "Account deleted.");
      navigate("/");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete account. Try again later.");
    }
  };


  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
      <p className="text-gray-700 mb-4">
        Deleting your account will log you out permanently. You will need to sign up again to use the site.
      </p>
      <button
        onClick={handleDeleteAccount}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
      >
        Delete My Account
      </button>
    </div>
  );
};

export default DeleteAccount;
