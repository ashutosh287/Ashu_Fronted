import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaBox, FaPlus, FaUserEdit, FaSignOutAlt, FaChartLine, FaBars, FaUser
} from 'react-icons/fa';
import { GiPowerButton } from "react-icons/gi";
import { showSuccessToast, showErrorToast } from '../ToastifyNotification/Notification';
import SellerProfile from './SellerProfile';
import Revenue from './Revenue';
const api = import.meta.env.VITE_BASE_URL;



const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [seller, setSeller] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // ✅ Remember last active tab using localStorage
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('seller-active-tab') || 'products';
  });

  // ✅ Remember dark mode preference

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isOpen, setIsOpen] = useState(null);
  const [shopStatusLoading, setShopStatusLoading] = useState(false);
  const { shopId } = useParams();


  const navigate = useNavigate();

  // ✅ Save activeTab whenever it changes
  useEffect(() => {
    localStorage.setItem('seller-active-tab', activeTab);
  }, [activeTab]);


  const fetchSeller = async () => {
    try {
      const res = await axios.get(`${api}/api/seller/dashboard`, {
        withCredentials: true, // ✅ Send cookies with request
      });

      const sellerData = res.data.seller;
      setSeller(sellerData);

      // ✅ Debugging logs
      console.log("✅ Seller Data:", sellerData);
      console.log("✅ Shop Info:", sellerData.shop);

      // ✅ Check if shop.open is valid
      if (sellerData?.shop && typeof sellerData.shop.open === "boolean") {
        setIsOpen(sellerData.shop.open);
      } else {
        console.warn("⚠️ Shop open status missing or invalid");
        setIsOpen(null); // fallback if data is invalid
      }
    } catch (err) {
      console.error("❌ Failed to fetch seller:", err);
    }
  };



  // const fetchOrders = async () => {
  //   try {
  //     const res = await axios.get('/api/seller/api/seller/api/seller/orders', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setOrders(res.data);
  //   } catch (err) {
  //     console.error('Failed to fetch orders:', err);
  //   }
  // };

  const fetchReadyOrders = async () => {
    try {
      const res = await axios.get(`${api}/api/seller/readyOrder/${shopId}`, {
        withCredentials: true, // ✅ send cookies with request
      });
      setReadyOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching ready orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${api}/api/seller/products`, {
        withCredentials: true, // ✅ cookie send automatically
      });
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    }
  };


  const handleAddOrUpdate = async () => {
    try {
      setIsSubmitting(true); // Start loading

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("mrp", form.mrp);
      formData.append("price", form.price);

      // ✅ Append image only if it's a new File (not an existing URL)
      if (form.image && typeof form.image !== "string") {
        formData.append("image", form.image);
      }

      const config = {
        withCredentials: true, // ✅ send cookies
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(`${api}/api/seller/product/${editId}`, formData, config);
      } else {
        await axios.post(`${api}/api/seller/product`, formData, config);
      }

      // ✅ Reset form after success
      setForm({
        name: "",
        description: "",
        mrp: "",
        price: "",
        image: "", // Reset to empty
      });
      setEditId(null);
      showSuccessToast(
        editId ? "Product updated successfully!" : "Product added successfully!"
      );

      fetchProducts();
    } catch (err) {
      console.error("❌ Failed to add/update product:", err);
      alert(err?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };


  // const fetchShopStatus = async () => {
  //   try {
  //     const res = await axios.get(`/api/seller/api/seller/shops/${shopId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setIsOpen(res.data.data.open);
  //   } catch (err) {
  //     console.error('❌ Error fetching shop status:', err);
  //   }
  // };

  const handleShopToggle = async () => {
    try {
      const nextStatus = !isOpen;

      const confirmMsg = nextStatus
        ? "Are you sure you want to open the shop?"
        : "Are you sure you want to close the shop?";

      if (!window.confirm(confirmMsg)) return;

      setShopStatusLoading(true);

      const res = await axios.patch(
        `${api}/api/seller/shops/status`,
        { open: nextStatus },
        { withCredentials: true } // ✅ cookie send automatically
      );

      // ✅ Update local shop status
      setIsOpen(res.data.data.open);

      // ✅ Refresh seller info after status change
      await fetchSeller();

    } catch (err) {
      console.error("❌ Failed to update shop status:", err);
      alert("Status update failed.");
    } finally {
      setShopStatusLoading(false);
    }
  };


  const handleTogglePublish = async (id) => {
    try {
      await axios.patch(
        `${api}/api/seller/product/${id}/toggle-publish`,
        {},
        { withCredentials: true } // ✅ Token from cookie
      );
      fetchProducts(); // 🔄 Refresh product list
    } catch (err) {
      console.error(`❌ Failed to toggle publish for product ${id}:`, err);
      alert("Failed to update publish status.");
    }
  };



  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, image: p.image });
    setEditId(p._id);
    setActiveTab('add');
  };



  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${api}/api/seller/product/${id}`, { withCredentials: true }); // ✅ cookie-based auth
      fetchProducts(); // 🔄 Refresh product list
      showSuccessToast("Product deleted successfully!");
    } catch (err) {
      console.error(`❌ Failed to delete product ${id}:`, err);
      showErrorToast("Failed to delete product.");
    }
  };


  const confirmLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;

    try {
      // ✅ Backend call to clear auth cookie
      await axios.post(`${api}/api/seller/logout`, {}, { withCredentials: true });

      // ✅ Clear local UI states
      ["sellerData", "seller-active-tab", "activeTab", "darkMode"].forEach(key =>
        localStorage.removeItem(key)
      );

      showSuccessToast("Logged out successfully.");
      navigate("/", { replace: true }); // replace so back button won't go to dashboard
    } catch (err) {
      console.error("❌ Logout failed:", err);
      showErrorToast("Logout failed. Please try again.");
    }
  };

  const handleToggleStock = async (productId, inStockValue) => {
    try {
      // Send request with cookies
      await axios.put(
        `${api}/api/seller/product/stock/${productId}`,
        { inStock: inStockValue },
        {
          withCredentials: true, // ✅ Important for cookies
        }
      );

      // ✅ Update product list instantly
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p._id === productId ? { ...p, inStock: inStockValue } : p
        )
      );

      showSuccessToast(
        inStockValue
          ? "Product marked as In Stock"
          : "Product marked as Out of Stock"
      );
    } catch (err) {
      console.error("❌ Failed to update stock", err);
      showErrorToast("Could not update stock status. Please try again.");
    }
  };




  useEffect(() => {
    fetchSeller();
    fetchProducts();
    // fetchOrders();
    fetchReadyOrders();
  }, []);


  return (
    <div className="flex min-h-screen bg-white-900 text-black font-sans">
      <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="md:hidden absolute top-4 left-4 z-20">
        <FaBars className="text-2xl" />
      </button>


      {/* Backdrop for mobile */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-white shadow-lg z-20 p-6 space-y-6 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:z-auto`}
      >
        <h2 className="text-2xl font-extrabold text-purple-600 dark:text-black mb-4 border-b pb-2">
          Seller Panel
        </h2>

        <nav className="space-y-3 text-sm font-medium">
          <button
            onClick={() => {
              setActiveTab('SellerProfile');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            <FaUser className="text-purple-600" /> Seller Profile
          </button>
          <button
            onClick={() => {
              setActiveTab('products');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            <FaBox className="text-purple-600" /> My Products
          </button>

          <button
            onClick={() => {
              setActiveTab('add');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            <FaPlus className="text-green-600" /> {editId ? 'Edit Product' : 'Add Product'}
          </button>

          {/* <button
            onClick={() => {
              setActiveTab('orders');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            🧾 Orders
          </button> */}

          <button
            onClick={() => {
              setActiveTab('ReadyOrders');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            📦 Ready Orders
          </button>

          {/* <button
            onClick={() => {
              setActiveTab('profile');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            <FaUserEdit className="text-yellow-600" /> Update Profile
          </button> */}

          <button
            onClick={() => {
              setActiveTab('revenue');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            <FaChartLine className="text-blue-600" /> Revenue
          </button>

          <button
            onClick={() => {
              setActiveTab('ShopStatus');
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition"
          >
            <GiPowerButton className="text-red-600" /> Shop Status
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-3 p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-800 transition"
          >
            <FaSignOutAlt /> Logout
          </button>

          {/* 🔒 Confirmation Modal */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  Confirm Logout
                </h2>
                <p className="text-gray-600 dark:text-gray-300  text-sm sm:text-base mb-4 sm:mb-6 text-center sm:text-left">
                  Are you sure you want to logout?
                </p>

                <div className="flex flex-col sm:flex-row justify-end sm:justify-between gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded border border-gray-300 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )
          }
        </nav >
      </aside >


      <main className="flex-1 mb-5  md:ml-64">
        {/* Product Tab */}
        {activeTab === 'SellerProfile' && (
          <section>
            <SellerProfile seller={seller} fetchSeller={fetchSeller} />
          </section>
        )}
        {activeTab === 'products' && (
          <section>
            <h1 className="text-3xl font-extrabold text-purple-700 mt-12 text-center">Your Products</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map(p => (
                <div
                  key={p._id}
                  className={`relative rounded-xl shadow-md p-4 transition-all ${!p.inStock ? "opacity-50" : ""} bg-white`}
                >
                  <img src={p.image} alt={p.name} className=" h-[100px] w-full object-cover rounded mb-3" />
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="text-sm">{p.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-semibold line-through text-gray-500">₹{p.mrp}</p>
                    <p className="text-lg font-semibold text-green-700">₹{p.price}</p>
                  </div>

                  {!p.inStock && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4 text-sm">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 font-semibold">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 font-semibold">
                      Delete
                    </button>
                    <button
                      onClick={() => handleTogglePublish(p._id)}
                      className={`font-semibold ${p.isPublished ? 'text-yellow-600' : 'text-green-600'}`}
                    >
                      {p.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleToggleStock(p._id, !p.inStock)}
                      className={`font-semibold ${p.inStock ? 'text-gray-500' : 'text-green-700'}`}
                    >
                      {p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


        {/* Add Product Tab */}
        {activeTab === 'add' && (
          <section className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-extrabold text-purple-700 mb-8 text-center">
              {editId ? 'Edit Product' : 'Add New Product'}
            </h1>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={e => {
                e.preventDefault();
                handleAddOrUpdate();
              }}
            >
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Product Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter product name"
                  className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description"
                  className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">MRP</label>
                <input
                  type="number"
                  value={form.mrp}
                  onChange={e => setForm({ ...form, mrp: e.target.value })}
                  placeholder="Maximum Retail Price"
                  className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                  min={0}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Selling Price</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="Selling Price"
                  className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                  min={0}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-semibold text-gray-700">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setForm({ ...form, image: e.target.files[0] })}
                  className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {/* Show preview if editing and image is a string (URL) */}
                {form.image && typeof form.image === 'string' && (
                  <img
                    src={form.image}
                    alt="Product Preview"
                    className="mt-2 h-32 w-auto rounded shadow border"
                  />
                )}
              </div>
              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (editId ? "Updating..." : "Adding...") : (editId ? "Update Product" : "Add Product")}
                </button>

              </div>
            </form>
          </section>
        )}

        {/* {activeTab === 'profile' && seller && (
          <section>
            <h1 className="text-3xl font-bold mb-6">Update Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input value={seller.ownerName} onChange={e => setSeller({ ...seller, ownerName: e.target.value })} placeholder="Owner Name" className="p-3 border rounded-lg" />
              <input value={seller.shopName} onChange={e => setSeller({ ...seller, shopName: e.target.value })} placeholder="Shop Name" className="p-3 border rounded-lg" />
              <input value={seller.phone} onChange={e => setSeller({ ...seller, phone: e.target.value })} placeholder="Phone" className="p-3 border rounded-lg" />
            </div>
            <button
              onClick={async () => {
                await axios.put('/api/seller/api/seller/api/seller/profile', seller, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                alert('Profile updated');
              }}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
          </section>
        )} */}


        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <section className="px-4 sm:px-6 mt-10">
            <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">📅 Monthly Revenue Overview</h1>

            <Revenue />
          </section>
        )}

        {/* Orders Tab */}
        {/* {activeTab === 'orders' && (
            <section>
              <h1 className="text-3xl font-bold mb-6">📦 My Orders</h1>

              <ul className="space-y-4">
                {orders.map(order => (
                  <li key={order._id} className="p-5 bg-white  rounded shadow space-y-3">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="font-bold text-lg">{order.buyerName}</div>
                      <div className="text-sm text-black">Placed: {new Date(order.placedAt).toLocaleString()}</div>
                    </div>

                    <div className="text-sm text-black">
                      <p><strong>📍 Address:</strong> {order.address}</p>
                      <p><strong>📞 Phone:</strong> {order.phone}</p>
                      <p><strong>🕒 Delivery Slot:</strong> {order.preferredDeliveryTime}</p>
                      <p><strong>💰 Payment:</strong> {order.paymentMethod}</p>
                      {order.orderNotes && <p><strong>📝 Notes:</strong> {order.orderNotes}</p>}
                    </div>

                    <div className="mt-2">
                      <strong>🛒 Items:</strong>
                      <ul className="ml-4 list-disc">
                        {order.items.map((item, i) => (
                          <li key={i} className="text-sm text-black dark:text-black">
                            {item.name} — ₹{item.price} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4">
                      <div className="text-xl font-semibold text-green-700">
                        Total: ₹{order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Status:</label>

                        {['Delivered', 'Cancelled'].includes(order.status) ? (
                          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            {order.status}
                          </span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                await axios.put(
                                  `/api/seller/api/seller/api/seller/order-status/${order._id}`,
                                  {
                                    status: newStatus,
                                    context: 'delivery'
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`
                                    }
                                  }
                                );
                                fetchReadyOrders(); 
                              } catch (err) {
                                console.error("❌ Failed to update status:", err);
                                alert("Status update failed.");
                              }
                            }}
                            className="p-2 border rounded bg-white text-black"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>

                    </div>

                  </li>
                ))}
              </ul>
            </section>

          )} */}

        {activeTab === 'ReadyOrders' && (
          <section className="mt-10 px-4 sm:px-6">
            <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-8">📦 Instant Orders</h1>

            <div className="flex flex-col items-center">
              {Object.entries(
                readyOrders.reduce((acc, order) => {
                  const date = new Date(order.placedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(order);
                  return acc;
                }, {})
              ).map(([date, orders]) => (
                <div key={date} className="w-full max-w-7xl mb-10">
                  {/* 🗓️ Date Heading */}
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-600 border-b border-purple-300 pb-2 mb-4">
                    🗓️ {date}
                  </h2>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                      <li key={order._id} className="p-6 bg-white rounded-xl shadow space-y-3 w-full">
                        {/* 🧍 Name & Placed Time */}
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div className="font-bold text-lg">{order.fullName}</div>
                          <div className="text-sm text-gray-600">
                            Placed: {new Date(order.placedAt).toLocaleTimeString()}
                          </div>
                        </div>

                        {/* 🧾 Details */}
                        <div className="text-sm text-black space-y-1">
                          <p><strong>🔖 ID:</strong> {order._id}</p>
                          <p><strong>📞 Phone:</strong> {order.phone}</p>
                          <p><strong>💰 Payment:</strong> {order.paymentMethod}</p>
                          <p><strong>📦 Type:</strong> {order.orderType === 'ready' ? 'Ready to pickup' : 'Packed delivery'}</p>
                          {order.orderNotes && (
                            <p><strong>📝 Notes:</strong> {order.orderNotes}</p>
                          )}
                          <p>
                            <strong>📦 Pickup Code:</strong>{' '}
                            <span className="bg-blue-600 text-white px-2 py-1 rounded font-bold">
                              {order.pickupCode}
                            </span>
                          </p>
                        </div>

                        {/* 📦 Items */}
                        <div className="mt-2">
                          <strong>🛒 Items:</strong>
                          <ul className="ml-4 list-disc text-sm">
                            {order.items.map((item, i) => (
                              <li key={i}>
                                {item.name} — ₹{item.price} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 💰 Total & Status */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4">
                          <div className="text-xl font-semibold text-green-700">
                            Total: ₹{order.totalAmount}
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Status:</label>
                            {['Picked', 'Cancelled'].includes(order.status) ? (
                              <span
                                className={`text-sm font-semibold px-2 py-1 rounded ${order.status === 'Picked'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                                  }`}
                              >
                                {order.status}
                              </span>
                            ) : (
                              <select
                                value={order.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  try {
                                    await axios.put(
                                      `${api}/api/seller/readyOrder/${order._id}`,
                                      {
                                        status: newStatus,
                                        context: 'ready',
                                      },
                                      {
                                        withCredentials: true, // ✅ Send cookies
                                      }
                                    );

                                    fetchReadyOrders();
                                  } catch (err) {
                                    console.error("❌ Failed to update status:", err);
                                    alert("Status update failed.");
                                  }

                                }}
                                className="p-2 border rounded bg-white text-black"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Ready">Ready</option>
                                <option value="Picked">Picked</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}


        {activeTab === 'ShopStatus' && (
          <section className="p-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center sm:text-left">
              🏪 Shop Status
            </h1>

            <div className="p-4 sm:p-6 bg-white dark:bg-white rounded-xl shadow-md space-y-4">

              {/* Status and Button Row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                {/* ✅ Status */}
                <div className="text-lg sm:text-xl font-semibold text-purple-700 flex items-center gap-2">
                  Current Status:
                  {isOpen === null ? (
                    <span className="text-gray-500 font-normal">Checking...</span>
                  ) : (
                    <span
                      className={`px-3 py-1 text-sm font-bold rounded-full shadow-inner ${isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  )}
                </div>

                {/* ✅ Toggle Button */}
                <button
                  disabled={shopStatusLoading || isOpen === null}
                  onClick={handleShopToggle}
                  className={`px-5 py-2 sm:py-2.5 sm:px-6 rounded-full text-sm sm:text-base font-semibold tracking-wide transition duration-300 shadow ${isOpen
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                    } ${shopStatusLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {shopStatusLoading
                    ? "Please wait..."
                    : isOpen
                      ? "🔴 Close Shop"
                      : "🟢 Open Shop"}
                </button>
              </div>
            </div>
          </section>
        )}

      </main>
    </div >
  );
};

export default SellerDashboard;