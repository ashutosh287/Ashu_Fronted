import React from "react";
import { useNavigate } from "react-router-dom";

const WhySell = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">
          Grow Your Shop. Serve Your Community.
        </h1>
        <p className="text-lg text-gray-600">
          Sell directly to hundreds of local families, students, and professionals around you — without worrying about delivery or marketing.
        </p>
        <blockquote className="italic text-purple-500 mt-4">
          “What was once limited to your shop walls can now reach every doorstep around you.”
        </blockquote>
      </div>

      {/* Why Sell Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Why Join as a Seller?</h2>
        <ul className="space-y-3 text-gray-700 text-base">
          <li>✅ Reach over 3000+ verified nearby customers</li>
          <li>a ✅ No delivery headaches — customers order from home and pick up directly</li>
          <li>✅ No tech knowledge needed — we guide you step-by-step</li>
          <li>✅ Serve your own neighborhood with ease and pride</li>
          <li>✅ Simple, honest platform — no hidden commissions</li>
        </ul>
      </div>

      {/* Motivation Quote Block */}
      <div className="bg-purple-50 rounded-xl p-6 mt-10 max-w-3xl text-center shadow-md">
        <h3 className="text-xl font-semibold text-purple-700">
          Be the reason someone gets quality service today.
        </h3>
        <p className="mt-2 text-gray-600">
          “Every small business carries a big dream — and this is where that dream begins.”
        </p>
      </div>

      {/* Trust Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-10 w-full max-w-4xl space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Built for Trust and Simplicity</h2>
        <ul className="text-gray-700 list-disc list-inside space-y-2">
          <li>Only verified nearby users can place orders</li>
          <li>Order tracking  support provided</li>
          <li>You're in full control of your products and prices</li>
          <li>We offer personal onboarding and support</li>
        </ul>
      </div>

      {/* Final CTA */}
      <div className="text-center mt-12 px-4">
        <p className="text-lg font-semibold text-gray-700">
          Ready to serve your community and grow your shop?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <button
            onClick={() => navigate("/add-shop")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-lg font-bold hover:bg-purple-800 transition flex flex-col items-center"
          >
            Start Selling Now
            <span className="text-xs font-normal">First time here? Register your shop</span>
          </button>

          <button
            onClick={() => navigate("/seller/portal/login")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-lg font-bold hover:bg-purple-800 transition flex flex-col items-center"
          >
            Seller Login
            <span className="text-xs font-normal">Already selling? Login to your account</span>
          </button>
        </div>
      </div>


    </div>
  );
};

export default WhySell;
