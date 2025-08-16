import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaStore } from "react-icons/fa";

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data } = await axios.get(`${api}/api/seller/seller/profile`, {
          withCredentials: true, // ✅ send cookies automatically
        });
        setSeller(data);
      } catch (err) {
        console.error("❌ Failed to fetch seller:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, []);


  if (loading) return <p className="text-center mt-6">Loading seller profile...</p>;

  if (!seller) return <p className="text-center mt-6 text-red-600">Failed to load seller profile.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-16 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <FaUser className="text-white" /> My Seller Profile
          </h2>
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
            <div className="flex items-center gap-3">
              <FaUser className="text-purple-600 text-lg" />
              <div>
                <p className="text-sm text-gray-500">Owner Name</p>
                <p className="font-semibold">{seller.ownerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaStore className="text-purple-600 text-lg" />
              <div>
                <p className="text-sm text-gray-500">Shop Name</p>
                <p className="font-semibold">{seller.shopName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-purple-600 text-lg" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold break-all">{seller.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaPhone className="text-purple-600 text-lg" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{seller.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
