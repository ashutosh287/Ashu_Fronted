// src/pages/UserOrderSummary.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const UserOrderSummary = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-600 text-xl font-bold">No order found</h2>
        <Link to="/" className="text-blue-600 underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
        <h2 className="text-green-600 text-xl font-bold mb-4">✅ Order Placed!</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Name:</strong> {order.buyerName}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <div className="mt-3">
          <strong>Items:</strong>
          <ul className="list-disc pl-6">
            {order.items.map((item, i) => (
              <li key={i}>{item.name} - ₹{item.price} × {item.qty}</li>
            ))}
          </ul>
        </div>
        <p className="mt-2"><strong>Total:</strong> ₹{order.totalAmount}</p>

        <Link to="/" className="mt-5 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default UserOrderSummary;
