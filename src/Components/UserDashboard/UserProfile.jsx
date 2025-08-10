import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          withCredentials: true, // ✅ So that cookie goes with request
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
      }
    };

    fetchUser();
  }, []);
  ;

  if (!user) {
    return <div className="text-center py-10 text-gray-600">Loading user profile...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-6 px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <h2 className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sm:p-6 text-white flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold">
          <FaUser className="text-white text-2xl sm:text-3xl" />
          My Profile
        </h2>

        <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-base sm:text-lg">
            <FaUser className="text-purple-600" />
            <span className="font-medium">Name:</span> {user.name}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-base sm:text-lg">
            <FaEnvelope className="text-purple-600" />
            <span className="font-medium">Email:</span> {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-base sm:text-lg">
              <FaPhone className="text-purple-600" />
              <span className="font-medium">Phone:</span> {user.phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
