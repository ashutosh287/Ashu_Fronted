import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrderSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const savedSummary = JSON.parse(localStorage.getItem("orderSummary"));
    if (savedSummary) {
      setSummary(savedSummary);
      localStorage.removeItem("orderSummary"); // Optional: clear after showing once
    }
  }, []);

  if (!summary) return <div className="p-6">No Order Summary Found.</div>;

  return (
    <div className="p-6 mb-12 max-w-xl mx-auto bg-white shadow-lg rounded-2xl mt-10 border border-green-200">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-green-700 mb-4 flex items-center gap-2">
        ✅ Order Confirmed!
      </h2>

      <p className="text-gray-700 text-base sm:text-lg mb-4">
        Thank you for your order! We've received your request and are getting everything ready for you.
      </p>

      <div className="space-y-2 text-sm sm:text-base text-gray-800">
        <p><strong>Name:</strong> {summary.fullName}</p>
        <p><strong>Phone:</strong> {summary.phone}</p>
        <p><strong>Order Type:</strong> {summary.orderType}</p>
        <p><strong>Payment Method:</strong> {summary.paymentMethod}</p>
        <p><strong>Total Amount:</strong> ₹{summary.totalAmount}</p>
        <p>
          <strong>Pickup Code:</strong>{" "}
          <span className="text-blue-700  font-semibold tracking-wider text-lg">{summary.pickupCode}</span>
        </p>
      </div>

      <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200 text-green-800 text-sm sm:text-base">
        🚚 You can check your order status anytime on the website. Please keep your phone accessible. This is a pickup order, kindly provide the pickup code at the counter.
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
