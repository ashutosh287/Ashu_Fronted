import React, { useEffect, useState } from 'react';
import axios from 'axios';
const api = import.meta.env.VITE_BASE_URL;


const CombinedOrders = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [userRes, readyRes] = await Promise.all([
          axios.get(`${api}/api/user/orders`, { withCredentials: true }), // all user orders
          axios.get(`${api}/api/user/orders/ready`, { withCredentials: true }), // ready orders
        ]);

        setUserOrders(userRes.data);
        setReadyOrders(readyRes.data);

      } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


 

const formatDateTime = (isoDateStr) => {
  const date = new Date(isoDateStr);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getDateLabel = (iso) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  }); // e.g., 1 Aug
};

const groupOrdersByDate = (orders) => {
  const sorted = [...orders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  const grouped = {};
  sorted.forEach(order => {
    const label = getDateLabel(order.placedAt);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(order);
  });
  return grouped;
};

const userGrouped = groupOrdersByDate(userOrders);
const readyGrouped = groupOrdersByDate(readyOrders);

const renderItems = (items) => (
  <ul className="pl-5 list-disc text-sm text-gray-600 space-y-1 mt-2">
    {items.map((item, idx) => (
      <li key={idx}>{item.name} × {item.quantity} — ₹{item.price}</li>
    ))}
  </ul>
);

const renderOrders = (groupedOrders, type = 'user') =>
  Object.entries(groupedOrders).map(([date, orders]) => (
    <div key={date} className="mb-10">
      <h3 className="text-lg font-bold mb-3 text-purple-700">🗓 {date}</h3>
      <div className="space-y-6">
        {orders.map((order, index) => {
          const totalAmount = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
          return (
            <div key={order._id || index} className="bg-white shadow-sm border rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5 mb-4">
                <div className="text-sm space-y-1">
                  <p>🏪 <strong>{order.shopId?.shopName || "Unknown"}</strong></p>
                  <p>🔖 {order._id}</p>
                  <p>👤 {order.buyerName || order.fullName}</p>
                  <p>📞 {order.phone}</p>
                  {order.address && <p>📍 {order.address}</p>}
                  <p>⏰ {order.preferredPackedTime}</p>
                  {type === 'ready' && (
                    <>
                      <p>📝 {order.orderNotes || "No Notes"}</p>
                      <p>🔐 Pickup Code: <span className="bg-blue-500 text-white px-2 py-0.5 rounded">{order.pickupCode}</span></p>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">🛒 Items Ordered:</h4>
                  {renderItems(order.items)}
                </div>
                <div className="text-right   space-y-2">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full
                      ${order.status === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status || 'Pending'}
                  </span>
                  <p className="text-sm">🛍 {order.items.length} item(s)</p>
                  <p className="text-base font-semibold text-green-700">💰 ₹{totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Placed at: {formatDateTime(order.placedAt)}</p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  ));

return (
  <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
    {loading ? (
      <p className="text-center text-gray-500 text-lg">Loading orders...</p>
    ) : (
      <>
        {/* User Orders */}
        {/* <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">🧾 Your Orders</h2>
            {userOrders.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">No orders placed yet.</p>
            ) : (
              renderOrders(userGrouped, 'user')
            )}
          </section> */}

        {/* Ready Orders */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">🧃 Ready PrePick Orders</h2>
          {readyOrders.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No ready orders yet.</p>
          ) : (
            renderOrders(readyGrouped, 'ready')
          )}
        </section>
      </>
    )}
  </div>
);
};

export default CombinedOrders;
