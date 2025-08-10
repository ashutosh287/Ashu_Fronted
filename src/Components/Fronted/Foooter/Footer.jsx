import React from "react";
import { FaInstagram } from "react-icons/fa";
import { TbBrandYoutube } from "react-icons/tb";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { showInfoToast } from "../../ToastifyNotification/Notification";






export default function Footer() {

  const handleLanguageClick = (e) => {
    e.preventDefault();
    showInfoToast("Only English is supported.", {

    });
  };
  return (
    <footer className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-2  px-2">
      <div className="mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Newsletter Section */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-xl text-start text-white">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-500 hover:text-green-500">
              IShop – Your Online Marketplace
            </h2>
            <p className="mt-2 text-gray-300 text-sm sm:text-base">
              "Bridging the gap between local shops and the online world — supporting local sellers and connecting them with modern customers."            </p>

            <h3 className="mt-4 font-medium text-purple-400 text-sm sm:text-base">
              <span className="hover:text-green-500">📦 Easy Shopping </span>|<span className="hover:text-green-500"> 🥳 Better experience  </span>|
            </h3>

            <h4 className="mt-3 text-md font-medium text-sm sm:text-base">
              📧 <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact Us</Link> for support!
            </h4>
          </div>

          {/* Creator Section */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl">
            <h3 className="text-base sm:text-lg font-semibold flex items-center text-white">
              <span className="hover:text-green-500 text-purple-500"> For customer </span>
              <span className="ml-2 bg-red-500 text-xs px-2 py-1 rounded-full blink animate-bounce">
                NEW
              </span>
            </h3>

            <p className="mt-3 text-gray-300 animate-fade-in text-sm sm:text-base">
              "Why step out, when your local market is now online? Trusted by families, loved by locals — built for your comfort, powered by your community."           </p>

            <div className="mt-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-purple-900 hover:shadow-lg text-sm sm:text-base">
                <Link to="/our-story"> know more</Link>
              </button>
            </div>
          </div>
          {/* Links Section */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-xl">
            <h3 className="text-base sm:text-lg font-semibold hover:text-green-500 text-purple-500">
              Explore More – Don't Miss Out
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-4 text-gray-400">
              {/* Column 1: Company */}
              <div>
                <h4 className="text-white font-medium hover:text-green-500 text-sm sm:text-base">Company</h4>
                <ul className="mt-2 space-y-1">
                  <li><Link to="/our-story" className="hover:text-white transition text-sm sm:text-base">Our Story</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition text-sm sm:text-base">Contact Us</Link></li>
                  <li><Link to="/about" className="hover:text-white transition text-sm sm:text-base">About Us</Link></li>
                </ul>
              </div>

              {/* Column 2: Help */}
              <div>
                <h4 className="text-white font-medium hover:text-green-500 text-sm sm:text-base">Let us help you</h4>
                <ul className="mt-2 space-y-1">
                  <li><Link to="/help" className="hover:text-white transition text-sm sm:text-base">Help Center</Link></li>
                  <li><Link to="/become-a-seller" className="hover:text-white transition text-sm sm:text-base">Become a Seller</Link></li>
                  <li><Link to="#" onClick={handleLanguageClick} className="hover:text-white transition text-sm sm:text-base">Language</Link></li>
                </ul>
              </div>

              {/* Row 2: Legal (full width) */}
              <div className="col-span-2">
                <h4 className="text-white font-medium hover:text-green-500 text-sm sm:text-base">Legal</h4>
                <ul className="mt-2 space-y-1">
                  <li><Link to="/privacy-policy" className="hover:text-white transition text-sm sm:text-base">Privacy Policy</Link></li>
                  <li><Link to="/community-rules" className="hover:text-white transition text-sm sm:text-base">Community Rules</Link></li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Social Icons */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap justify-center space-x-2 sm:space-x-3">
          <h4 className=" text-lg sm:text-2xl  font-bold text-transparent bg-clip-text 
               bg-gradient-to-r from-green-400 to-purple-500 
               animate-pulse tracking-wide shadow-lg">
          </h4>
          <Link to="/ " target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 p-2 sm:p-4 rounded-xl transition duration-300 hover:bg-pink-500">
            <span className="text-white text-lg sm:text-xl"><FaInstagram /></span>
          </Link>

          <Link to="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 p-2 sm:p-4 rounded-xl transition duration-300 hover:bg-red-500">
            <span className="text-white text-lg sm:text-xl"><TbBrandYoutube /></span>
          </Link>

          <Link to="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 p-2 sm:p-4 rounded-xl transition duration-300 hover:bg-blue-600">
            <span className="text-white text-lg sm:text-xl"><FaFacebookF /></span>
          </Link>

          <Link to="https://x.com/" target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 p-2 sm:p-4 rounded-xl transition duration-300 hover:bg-blue-400">
            <span className="text-white text-lg sm:text-xl"><FaTwitter /></span>
          </Link>

          <Link to="https://www.threads.net/login" target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 p-2 sm:p-4 rounded-xl transition duration-300 hover:bg-black">
            <span className="text-white text-lg sm:text-xl"><FaThreads /></span>
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-4 text-center">
        <p className="text-gray-400 text-xs sm:text-sm">
          © {new Date().getFullYear()} IShop. All rights reserved.
        </p>

        <p className="text-gray-500 text-xs mt-2">
          By using this site, you agree to our <Link to="#" className="text-blue-400 hover:underline">Terms of Service</Link>
          and <Link to="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
        </p>


        <div className="mt-4">
          <Link
            to="#"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-green-400 text-xs sm:text-sm font-medium hover:underline"
          >
            ↑ Back to Top
          </Link>
        </div>
      </div>
    </footer>
  );
}
