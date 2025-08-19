import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search'; // Desktop version
import MobileSearch from './MobileSearch'; // Mobile version
import {
  FaGlobe, FaHeadset, FaEnvelope, FaInfoCircle, FaRegUser
} from 'react-icons/fa';
import { BsShop } from 'react-icons/bs';
// import Logo from '../../../assets/Packzo.png';
import Shop from '../../Shop/ShopCards';
import axios from 'axios'; // ✅ import axios
import { showInfoToast } from '../../ToastifyNotification/Notification'
const api = import.meta.env.VITE_BASE_URL;


export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${api}/api/user/check-auth`, {
          withCredentials: true, // ✅ Important for cookies
        });

        if (res.data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleLanguageClick = (e) => {
    e.preventDefault();
    showInfoToast("Only English is supported.", {

    });
  }

  return (
    <nav className="w-full bg-white overflow-hidden z-50 shadow">

      {/* 🔷 MOBILE VIEW ONLY */}
      <div className="sm:hidden">
        {/* Welcome Message */}
        <div className="py-2 bg-gradient-to-r from-purple-700 to-indigo-600 border-t border-b border-gray-300">
          <p className="text-[15px] text-white px-4">
            "Welcome to Packzo — I'm so glad you're here!"
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700 to-indigo-600">
          <Link
            to="/"
            className="flex items-center cursor-pointer select-none hover:scale-105 transform transition duration-300 ease-in-out"
            aria-label="Packzo Home"
          >
            <h1 className="text-2xl font-sans mb-1 tracking-tight relative">
              <span className=" bg-clip-text bg-gradient-to-r text-white">
                Packzo.in
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 w-28 h-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-80 shadow-lg"
              />
            </h1>
          </Link>

          <div className="flex items-center gap-4 text-white ">
            {isLoggedIn ? (
              <Link to="/user-dashboard/" className="flex flex-col items-center hover:text-purple-300">
                <FaRegUser className="text-2xl" />
                <span className="text-sm">Profile</span>
              </Link>

            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signup" className="text-[17px] text-white hover:text-purple-300">Sign Up</Link>
                <span className="text-white text-base font-medium">/</span>
                <Link to="/login" className="text-[17px] text-white hover:text-purple-300">Login</Link>
              </div>
            )}

            <Link to="/user/Order" className="flex flex-col items-center hover:text-purple-300">
              <BsShop className="text-[25px]" />
              <span className="text-sm">Orders</span>
            </Link>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 px-4 pb-3">
          <MobileSearch />
        </div>
      </div>

      {/* 🔷 DESKTOP VIEW ONLY */}
      <div className="hidden sm:block">
        {/* Top Info Strip */}
        <div className="py-2 border-t border-b bg-gradient-to-r from-purple-700 to-indigo-600 border-gray-300">
          <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
            <p className="text-[16px] text-white hover:text-purple-300 font-sans">
              "Welcome to Packzo — I'm so glad you're here!"
            </p>
            <ul className="flex gap-6 text-white text-[15px] font-sans">
              <Link to="#" onClick={handleLanguageClick} className="flex items-center gap-1 hover:text-purple-300"><FaGlobe /> Language</Link>
              <Link to="/contact" className="flex items-center gap-1 hover:text-purple-300"><FaEnvelope /> Contact Us</Link>
              <Link to="/help" className="flex items-center gap-1 hover:text-purple-300"><FaHeadset /> Help Center</Link>
              <Link to="/about" className="flex items-center gap-1 hover:text-purple-300"><FaInfoCircle /> About Us</Link>
            </ul>
          </div>
        </div>

        {/* Main Nav */}
        <div className="mb-3 w-full bg-gradient-to-r from-purple-700 to-indigo-600">
          <div className="flex items-center justify-between gap-6 max-w-screen-xl px-6 mx-auto py-3">
            <Link
              to="/"
              className="flex items-center cursor-pointer select-none hover:scale-105 transform transition duration-300 ease-in-out"
              aria-label="Packzo Home"
            >
              <h1 className="text-4xl font-sans mb-2 tracking-tight relative">
                <span className="text-white bg-clip-text bg-gradient-to-r">
                  Packzo.in
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 w-28 h-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-80 shadow-lg"
                />
              </h1>
            </Link>
            <div className="w-[40%]">
              <Search />
            </div>

            <div className="flex items-center gap-6 text-white">
              {isLoggedIn ? (
                <Link to="/user-dashboard/" className="flex items-center gap-1 hover:text-purple-300">
                  <FaRegUser className='text-2xl' />
                  <span>My Profile</span>
                </Link>
              ) : (
                <div className="flex items-center text-[18px] text-white space-x-2">
                  <Link to="/signup" className="hover:text-purple-300">Sign Up</Link>
                  <span className="text-white text-base font-medium">/</span>
                  <Link to="/login" className="hover:text-purple-300">Login</Link>
                </div>
              )}

              <Link to='/user/Order'>
                <BsShop className='text-[30px] hover:text-purple-300' />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🔷 Shared Shop Section */}
      <div>
        <Shop />
      </div>
    </nav>
  );
}
