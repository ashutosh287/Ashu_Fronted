import React, { useState } from "react";
import axios from "axios";
import { IoIosSearch } from "react-icons/io"; // ✅ import icon


const SearchBar = ({ shopId, onProductSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) return setResults([]);

    try {
      console.log("✅ Shop ID from props:", shopId); // 👈 log this
      const res = await axios.get(`/api/search/live-search/${shopId}?query=${value}`);
      console.log("✅ Live search results:", res.data); // 👈 log this
      setResults(res.data.products || []);
    } catch (err) {
      console.error("❌ Live search error:", err.message);
      setResults([]);
    }
  };

  const handleSelect = (productId) => {
    if (onProductSelect) onProductSelect(productId);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />  

      {query && ( 
        <ul className="absolute bg-white text-black shadow-lg z-50 w-full max-h-64 overflow-y-auto border border-gray-200 mt-2 rounded-lg">
          {results.length > 0 ? (
            results.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSelect(item._id)}
                className="px-4 py-2 hover:bg-purple-100 transition cursor-pointer"
              >
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-500">{item.description?.slice(0, 50)}...</div>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 italic">No product found</li>
          )}
        </ul>
      )}
    </div>

  );
};

export default SearchBar;
