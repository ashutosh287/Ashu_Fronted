import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
const api = import.meta.env.VITE_BASE_URL;


const MobileShopSearch = () => {
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
      const res = await axios.get(`${api}/search/search/shops?search=${searchTerm}`);
      setShops(res?.data?.shops || []);
    } catch (error) {
      console.error("Search error", error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (id) => {
    setSearchTerm("");
    setShops([]);
    navigate(`/shop/${id}`);
  };

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
    <div className="relative w-full z-50">
      {/* 🔍 Search input */}
      <div className="flex items-center bg-white rounded-r-[10px] rounded-l-[10px] px-4 py-2   shadow-md">
        <IoIosSearch className="text-gray-400 text-[22px] mr-2" />
        <input
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-black placeholder-gray-400 placeholder:text-base outline-none"
        />
      </div>


      {/* 🔽 Dropdown */}
      {searchTerm.trim() !== "" && (
        <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-72 overflow-y-auto">
          {loading && (
            <li className="px-4 py-3 text-gray-500 italic">🔍 Searching...</li>
          )}
          {!loading && shops.length === 0 && (
            <li className="px-4 py-3 text-gray-400 italic">❌ No shops found</li>
          )}
          {!loading &&
            shops.map((shop) => (
              <li
                key={shop._id}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                onClick={() => handleShopClick(shop._id)}
              >
                <div>
                  {highlightMatch(shop.shopName, searchTerm)}
                  {shop.ownerName && (
                    <span className="ml-1 text-xs text-gray-500">
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

export default MobileShopSearch;
