import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io"; // ✅ import icon
const api = import.meta.env.VITE_BASE_URL;


const ShopSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchShops();
      } else {
        setShops([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/api/search/search/shops?search=${searchTerm}`);
      setShops(res?.data?.shops || []);
    } catch (error) {
      console.error("Search error", error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (id) => navigate(`/shop/${id}`);

  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, "i");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-purple-300 font-semibold rounded px-1">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  
  return (
   <div className=" relative w-[900px] max-w-xl mx-auto z-50">
  {/* ✅ Search Input with icon */}
  <div className="flex items-center border border-gray-300 shadow-sm rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition">
    <IoIosSearch className="text-gray-400 mr-3 text-2xl" />
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for a shop by name..."
      className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
    />
  </div>

  {/* 🔽 Dropdown */}
  {searchTerm.trim() !== "" && (
    <ul className="absolute w-full bg-white mt-2 rounded-xl shadow-xl border border-gray-200 max-h-72 overflow-y-auto animate-fade transition-all duration-200">
      {loading && (
        <li className="px-5 py-3 text-gray-500 italic">🔍 Searching...</li>
      )}
      {!loading && shops.length === 0 && (
        <li className="px-5 py-3 text-gray-400 italic">❌ No shops found</li>
      )}
      {!loading &&
        shops.map((shop) => (
          <li
            key={shop._id}
            className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 transition"
            onClick={() => handleShopClick(shop._id)}
          >
            <div>
              {highlightMatch(shop.shopName, searchTerm)}
              {shop.ownerName && (
                <span className="ml-2 text-xs text-gray-500">
                  (Owner: {shop.ownerName})
                </span>
              )}
            </div>
          </li>
        ))}
    </ul>
  )}
</div>

  );
};

export default ShopSearch;
