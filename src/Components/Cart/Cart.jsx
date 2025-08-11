
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { showErrorToast } from "../ToastifyNotification/Notification";
const api = import.meta.env.VITE_BASE_URL;



const Cart = () => {
  const { shopId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const toastShown = useRef(false);

  // ✅ Check if any item is unavailable (out of stock or unpublished)
  const hasUnavailable = cartItems.some(item => item.isOutOfStock || item.isUnpublished);

  // 🔐 Check Auth and Fetch Cart
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        // 🔐 Check if user is authenticated
        await axios.get(`${api}/User/check-auth`, { withCredentials: true });

        // ✅ Fetch cart after auth passes
        const res = await axios.get(`${api}/cart/${shopId}`, {
          withCredentials: true,
        });
        setCartItems(res.data);

      } catch (err) {
        if (!toastShown.current) {
          showErrorToast("Please login to view your cart.");
          toastShown.current = true;
          navigate("/login");
        }
      }
    };

    checkAuthAndFetch();
  }, [shopId, navigate]);

  // ✅ Calculate total amount excluding unavailable products
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      if (!item.isOutOfStock && !item.isUnpublished) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);
    setTotalAmount(total);
  }, [cartItems]);

  const increaseQty = async (itemId) => {
    try {
      await axios.put(`${api}/cart/increase/${itemId}`, {}, {
        withCredentials: true,
      });
      const res = await axios.get(`${api}/cart/${shopId}`, {
        withCredentials: true,
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("❌ Error increasing quantity:", err);
    }
  };

  const decreaseQty = async (itemId, removeDirectly = false) => {
    try {
      const url = removeDirectly
        ? `${api}/cart/decrease/${itemId}?removeDirectly=true`
        : `${api}/cart/decrease/${itemId}`;

      await axios.put(url, {}, {
        withCredentials: true,
      });

      const res = await axios.get(`${api}/cart/${shopId}`, {
        withCredentials: true,
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("❌ Error decreasing quantity:", err.response?.data || err);
    }
  };


  const removeFromCart = (itemId) => {
    const updated = cartItems.filter(item => item._id !== itemId);
    setCartItems(updated);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div
              key={item._id}
              className={`bg-white shadow rounded p-4 mb-4 flex items-center gap-4 ${item.isOutOfStock || item.isUnpublished ? "opacity-60" : ""
                }`}
            >
              <img src={item.image} className="w-24 h-24 object-cover rounded" alt={item.name} />
              <div className="flex-1">
                <h3 className="font-bold text-xl">{item.name}</h3>
                <p className="text-gray-700">₹{item.price} × {item.quantity}</p>

                {item.isOutOfStock && (
                  <p className="text-red-600 font-semibold mt-1">❌ Out of Stock</p>
                )}
                {item.isUnpublished && (
                  <p className="text-orange-600 font-semibold mt-1">🚫 Product Unavailable</p>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    disabled={item.isOutOfStock || item.isUnpublished}
                  >-</button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                    disabled={item.isOutOfStock || item.isUnpublished}
                  >+</button>

                  {(item.isOutOfStock || item.isUnpublished) && (
                    <button
                      onClick={() => decreaseQty(item._id, true)}
                      className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-red-600"
                    >
                      🗑 Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white shadow p-4 rounded mt-6">
            <h2 className="text-2xl font-bold">Total: ₹{totalAmount}</h2>

            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              {hasUnavailable ? (
                <div className="flex-1 bg-gray-400 text-white py-3 rounded-lg text-center font-semibold cursor-not-allowed">
                  Ready My Order
                </div>
              ) : (
                <Link
                  to={`/readyOrder/${shopId}`}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-purple-700"
                >
                  Ready My Order
                </Link>
              )}
            </div>

            {hasUnavailable && (
              <p className="text-red-600 text-sm mt-3 text-center">
                ⚠️ Some items are unavailable. Please remove them to proceed.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
