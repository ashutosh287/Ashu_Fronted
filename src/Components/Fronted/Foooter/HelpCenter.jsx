import React from "react";
import { Link } from "react-router-dom";
import { FaQuestionCircle, FaPhoneAlt, FaEnvelope, FaSearch } from "react-icons/fa";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-700 mb-3">Help Center</h1>
          <p className="text-gray-600 text-lg">
            Need assistance? We’re here to guide you.
          </p>
        </div>

        {/* Search */}
        {/* <div className="flex items-center max-w-2xl mx-auto bg-white shadow rounded-lg px-4 py-2 mb-10">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search questions, issues, or topics..."
            className="flex-grow outline-none text-sm"
          />
        </div> */}

        {/* FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-purple-600 text-lg mb-3">
              How do I register my shop?
            </h2>
            <p className="text-gray-600 text-sm">
              Go to the “Add Shop” page from your dashboard and fill out all required details.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-purple-600 text-lg mb-3">
              Can I place an order online?
            </h2>
            <p className="text-gray-600 text-sm">
              Yes! Browse shops, add items to your cart, and checkout easily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-purple-600 text-lg mb-3">
              What if I forget my password?
            </h2>
            <p className="text-gray-600 text-sm">
              Use the “Forgot Password” link on the login page to reset it instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-purple-600 text-lg mb-3">
              How can I track my order?
            </h2>
            <p className="text-gray-600 text-sm">
              After placing an order, go to “My Orders” in your account to see updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-purple-600 text-lg mb-3">
              Is delivery available everywhere?
            </h2>
            <p className="text-gray-600 text-sm">
              Currently we operate locally. Expansion is coming soon!
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-purple-600 text-lg mb-3">
              How do I contact support?
            </h2>
            <p className="text-gray-600 text-sm">
              See contact options below or fill the contact form via <Link to="/contact" className="text-purple-600 underline">Contact Us</Link>.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">Contact Our Support Team</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <FaPhoneAlt className="text-purple-600" /> +91 9876543210
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FaEnvelope className="text-purple-600" /> support@ishop.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
