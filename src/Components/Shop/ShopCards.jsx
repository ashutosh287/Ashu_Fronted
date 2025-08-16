import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStore, FaClock } from "react-icons/fa";
import { showErrorToast } from "../ToastifyNotification/Notification";

const api = import.meta.env.VITE_BASE_URL;

const ShopCards = () => {
  const [shops, setShops] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get(`${api}/api/public-shops`);
        setShops(res.data.shops || []);
      } catch (err) {
        console.error(err);
        showErrorToast("Failed to fetch shops");
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="p-4">
      {/* Grid of shop cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {shops.map((shop) => (
          <Link
            to={`/shop/${shop._id}`}
            key={shop._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {shop.shopImage ? (
              <img
                src={shop.shopImage}
                alt={shop.shopName}
                onClick={(e) => {
                  e.preventDefault(); // prevent navigating when clicking image
                  setZoomedImage(shop.shopImage);
                }}
                className="h-[100px] sm:h-28 md:h-32 lg:h-36 w-full object-cover cursor-pointer transition-transform hover:scale-105"
              />
            ) : (
              <div className="h-[100px] sm:h-28 md:h-32 lg:h-36 w-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                No Image
              </div>
            )}
            <div className="p-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FaStore className="text-gray-500" />
                {shop.shopName}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FaClock /> {shop.shopTiming}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative p-2 flex flex-col items-center">
            {/* Back Button */}
            <button
              onClick={() => setZoomedImage(null)}
              className="mb-3 px-4 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600 transition"
            >
              Back
            </button>

            {/* Image */}
            <img
              src={zoomedImage}
              alt="Zoomed Shop"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg transition-transform transform scale-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCards;
