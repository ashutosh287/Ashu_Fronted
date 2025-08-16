



import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaStore, FaClock } from 'react-icons/fa';
import { showErrorToast } from '../ToastifyNotification/Notification';

const api = import.meta.env.VITE_BASE_URL;

const ShopCards = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${api}/api/public-shops`);

        // ✅ API response safe handle
        if (Array.isArray(res.data)) {
          setShops(res.data);
        } else if (Array.isArray(res.data.shops)) {
          setShops(res.data.shops);
        } else {
          setShops([]);
        }

      } catch (err) {
        console.error("Error fetching shops:", err);
        setError("Failed to load shops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();

    // Get name from localStorage
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-700 text-lg">Loading shops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 text-red-700 text-lg font-semibold">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-2 sm:px-4 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-lg sm:text-3xl md:text-4xl font-serif text-center text-gray-800 mb-6 sm:mb-10 leading-snug sm:leading-normal">
          Hey {name}, your favorite shop is just a click away...
        </h1>

        {shops.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col
                       text-[11px] sm:text-sm lg:text-base"
              >
                {/* Shop Image */}
                {shop.shopImage ? (
                  <img
                    src={shop.shopImage}
                    alt={shop.shopName}
                    onClick={() => setZoomedImage(shop.shopImage)}
                    className="h-[100px] sm:h-28 md:h-32 lg:h-36 w-full object-cover cursor-pointer transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="h-20 sm:h-28 md:h-32 lg:h-36 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl sm:text-5xl">
                    <FaStore />
                  </div>
                )}

                {zoomedImage && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setZoomedImage(null)} // backdrop click se close
                  >
                    {/* Stop propagation so clicking image doesn't close */}
                    <div
                      className="relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close Button */}
                      <button
                        onClick={() => setZoomedImage(null)}
                        className="absolute -top-4 -right-4 bg-white rounded-full shadow-lg text-black text-2xl w-10 h-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                        aria-label="Close"
                      >
                        &times;
                      </button>

                      {/* Zoomed Image */}
                      <img
                        src={zoomedImage}
                        alt="Zoomed shop"
                        className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-lg border-4 border-white object-contain"
                      />
                    </div>
                  </div>
                )}


                {/* Shop Details */}
                <div className="p-2 sm:p-4 lg:p-5 flex-grow flex flex-col">
                  <h2 className="font-bold text-[15px] text-gray-900 mb-1 truncate">{shop.shopName}</h2>
                  <p className="text-gray-600 mb-1 text-[14px] truncate">
                    Owner: <span className="font-medium text-[13px]">{shop.ownerName}</span>
                  </p>
                  <p className="text-gray-600 flex items-center text-[12px] gap-1 mb-2">
                    <FaClock className={`text-[12px] lg:text-base ${shop.open ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={shop.open ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                      {shop.open ? "Open" : "Closed"}
                    </span>
                  </p>

                  <Link
                    to={shop.open ? `/shop/${shop._id}` : "#"}
                    className={`mt-auto inline-block text-center px-2 py-1 text-[14px] lg:px-4 lg:py-2 rounded text-xs sm:text-sm lg:text-base font-semibold transition duration-200 shadow
                            ${shop.open
                        ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white hover:opacity-90"
                        : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    onClick={(e) => {
                      if (!shop.open) {
                        e.preventDefault();
                        showErrorToast("This shop is currently closed.");
                      }
                    }}
                  >
                    {shop.open ? "Enter Shop" : "Shop Closed"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600 text-lg sm:text-xl">
            <p>No shops available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopCards;
