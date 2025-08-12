import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaOpencart, FaStore } from 'react-icons/fa';
import { showSuccessToast, showErrorToast } from "../ToastifyNotification/Notification";
import Search from './SearchBar';
import '../../index.css';
const api = import.meta.env.VITE_BASE_URL;

const ShopPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showProductImageModal, setShowProductImageModal] = useState(false);
  const [selectedProductImage, setSelectedProductImage] = useState('');
  const navigate = useNavigate();
  const productRefs = useRef({});

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        setLoading(true);
        const shopRes = await axios.get(`${api}api/public-shops`);
        const foundShop = shopRes.data.find((s) => s._id === id);
        setShop(foundShop);

        if (foundShop) {
          if (!foundShop.open) {
            setError("🚫 This shop is currently closed.");
            return;
          }

          const productRes = await axios.get(`${api}/shop-products/${id}`);
          setProducts(productRes.data);
        } else {
          setError('Shop not found');
        }
      } catch (err) {
        console.error('❌ Error loading shop or products:', err);
        setError('Failed to load shop or products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndProducts();
  }, [id]);

  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        `${api}/cart`,
        {
          productId: product._id,
          shopId: shop._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
        {
          withCredentials: true, // ✅ Send HTTP-only cookie to backend
        }
      );

      showSuccessToast("Item added to cart!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showErrorToast("Please login to add items to cart.");
        navigate("/login");
      } else {
        console.error("Add to cart error:", err);
        showErrorToast("Failed to add to cart.");
      }
    }
  };


  const scrollToProduct = (productId) => {
    const element = productRefs.current[productId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("twinkle");

      setTimeout(() => {
        element.classList.remove("twinkle");
      }, 1500);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedProductImage(imageUrl);
    setShowProductImageModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-700 text-lg">Loading shop...</p>
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
    <div className="min-h-screen bg-gray-100 font-sans">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition"
      >
        Back
      </button>

      <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none">
            {shop?.shopkeeperImage ? (
              <button onClick={() => setShowImageModal(true)} className="focus:outline-none">
                <img
                  src={shop.shopkeeperImage}
                  alt={`${shop.shopName} logo`}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              </button>
            ) : (
              <FaStore className="w-10 h-10 p-1 border-2 border-white rounded-full text-white" />
            )}
            <div className="flex justify-between items-center w-full sm:gap-4 sm:block">
              <div className="truncate">
                <h1 className="font-bold text-lg sm:text-xl truncate">{shop?.shopName}</h1>
                <p className="text-xs sm:text-sm opacity-90 truncate">Owner: {shop?.ownerName}</p>
              </div>
              <div className="sm:hidden">
                <Link to={`/cart/${shop._id}`}>
                  <FaOpencart className="text-2xl text-white hover:text-purple-200 transition" />
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full sm:max-w-md md:max-w-lg mx-auto">
            <Search shopId={id} onProductSelect={scrollToProduct} />
          </div>

          <Link to={`/cart/${shop._id}`} className="ml-auto hidden sm:block">
            <FaOpencart className="text-3xl hover:text-purple-200 transition duration-200" />
          </Link>
        </div>
      </nav>

      <header className="bg-white py-10 shadow text-center">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-600">
          Welcome to
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-700 leading-tight">
          {shop?.shopName}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-2">
          Explore our wide range of products. Happy shopping!
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-3 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                ref={(el) => (productRefs.current[product._id] = el)}
                className={`relative bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${!product.inStock ? "opacity-50 pointer-events-none" : ""
                  }`}
              >
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => handleImageClick(product.image)}
                  className="w-full h-24 sm:h-32 md:h-36 object-cover cursor-pointer"
                />

                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="text-[18px] sm:text-base font-bold text-gray-800 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[14px] sm:text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <div className="text-xs sm:text-sm mb-1">
                      <span className="text-gray-400 line-through text-[14px] mr-2">₹{product.mrp}</span>
                      <span className="text-green-600 font-semibold text-[17px]">
                        ₹{product.price}
                      </span>
                    </div>
                    {product.mrp && product.price && (
                      <p className="text-[13px] text-rose-600 mb-2">
                        Save ₹{(Number(product.mrp) - Number(product.price)).toFixed(0)}!
                      </p>
                    )}

                    <button
                      onClick={() => product.inStock && handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-1 text-[13px] sm:text-sm mt-1 rounded-lg transition font-medium ${product.inStock
                        ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white hover:from-purple-800 hover:to-indigo-700"
                        : "bg-gray-300 text-white cursor-not-allowed"
                        }`}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg sm:text-xl mt-10">
            😔 No products available in this shop yet.
          </p>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm opacity-90">
          &copy; {new Date().getFullYear()} {shop?.shopName || 'Shop'}. All rights reserved.
        </div>
      </footer>

      {/* 🧍 Shopkeeper Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl relative max-w-md w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-3 text-3xl text-gray-400 hover:text-red-500 transition"
            >
              &times;
            </button>

            <img
              src={shop.shopkeeperImage}
              alt="Shopkeeper"
              className="w-full h-auto max-h-[70vh] rounded-lg object-contain mb-4"
            />

            <button
              onClick={() => setShowImageModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* 🖼️ Product Image Modal */}
      {showProductImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowProductImageModal(false)}
              className="absolute top-3 right-4 text-4xl text-gray-600 hover:text-red-500 font-bold z-10"
            >
              &times;
            </button>
            <img
              src={selectedProductImage}
              alt="Zoomed Product"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
