
// ✅ CommunityRules.jsx
import React from "react";

const CommunityRules = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-6 text-center">Community Rules</h1>

      <p className="text-gray-700 mb-4 text-justify">
        We’re building a respectful, supportive, and vibrant community of local shopkeepers and customers. To maintain a safe and positive space, all members must follow these community rules:
      </p>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">1. Respect Everyone</h2>
      <p className="text-gray-700 mb-4 text-justify">
        Treat all customers, shopkeepers, and team members with respect and kindness. Hate speech, harassment, or discrimination will not be tolerated.
      </p>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">2. Honest Listings</h2>
      <p className="text-gray-700 mb-4 text-justify">
        Shopkeepers must provide accurate information about their products, pricing, and availability.
      </p>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">3. Fair Practices</h2>
      <p className="text-gray-700 mb-4 text-justify">
        Avoid price gouging, misleading promotions, or any form of exploitation.
      </p>

      <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-2">4. Report Misuse</h2>
      <p className="text-gray-700 mb-4 text-justify">
        If you experience or witness any violation of these rules, report it to us immediately. We take all reports seriously.
      </p>
    </div>
  );
};

export default CommunityRules;