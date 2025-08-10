// ✅ PrivacyPolicy.jsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-6 text-center">Privacy Policy</h1>
      <p className="text-gray-700 mb-4 text-justify">
        We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your data.
      </p>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4 pl-5">
        <li>Your name, email, phone number, and address.</li>
        <li>Details you provide when registering or placing orders.</li>
        <li>Usage data, preferences, and feedback.</li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="text-gray-700 mb-4 text-justify">
        We use your information to process your requests, personalize your experience, and improve our platform. Your data is never sold to third parties.
      </p>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">3. Data Security</h2>
      <p className="text-gray-700 mb-4 text-justify">
        We implement secure protocols and encrypted storage to protect your data. Access is restricted to authorized personnel only.
      </p>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">4. Your Choices</h2>
      <p className="text-gray-700 mb-4 text-justify">
        You may update your personal information or request its deletion at any time by contacting our support team.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
