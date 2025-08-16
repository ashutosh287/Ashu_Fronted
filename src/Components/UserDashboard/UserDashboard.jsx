import { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaClipboardList, FaSignOutAlt, FaBars, FaEnvelope } from 'react-icons/fa';
import { MdApi, MdDelete } from "react-icons/md";
import { showSuccessToast } from '../ToastifyNotification/Notification'

import MyOrders from '../Fronted/Orders/UserOrders';
import Profile from '../UserDashboard/UserProfile';
import ChangePassword from '../UserRegisteration/ChangePassword';
import DeleteAccount from '../UserRegisteration/DeleteAccount';
import axios from 'axios';
const api = import.meta.env.VITE_BASE_URL;


const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Prevent background scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
  }, [sidebarOpen]);

  // Function to add active class
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 bg-white w-64 shadow-md p-6 transition-transform duration-300 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:relative sm:transform-none`}
      >
        <h2 className="text-xl font-bold mb-8 text-purple-700">👤 User</h2>
        <nav className="space-y-4">
          <Link
            to="/user-dashboard"
            onClick={() => window.innerWidth < 640 && setSidebarOpen(false)}
            className={`flex items-center gap-3 hover:text-purple-600 ${isActive('/user-dashboard') ? 'text-purple-700 font-semibold' : 'text-gray-700'}`}
          >
            <FaUser /> My Profile
          </Link>
          <Link
            to="/user-dashboard/MyOrders"
            onClick={() => window.innerWidth < 640 && setSidebarOpen(false)}
            className={`flex items-center gap-3 hover:text-purple-600 ${isActive('/user-dashboard/MyOrders') ? 'text-purple-700 font-semibold' : 'text-gray-700'}`}
          >
            <FaClipboardList /> My Orders
          </Link>
          <Link
            to="/user-dashboard/change-password"
            onClick={() => window.innerWidth < 640 && setSidebarOpen(false)}
            className={`flex items-center gap-3 hover:text-purple-600 ${isActive('/user-dashboard/change-password') ? 'text-purple-700 font-semibold' : 'text-gray-700'}`}
          >
            <FaLock /> Change Password
          </Link>
          
          <Link
            to="/user-dashboard/DeleteAccount"
            onClick={() => window.innerWidth < 640 && setSidebarOpen(false)}
            className={`flex items-center gap-3 hover:text-purple-600 ${isActive('/user-dashboard/DeleteAccount') ? 'text-purple-700 font-semibold' : 'text-gray-700'}`}
          >
            <MdDelete className="text-2xl" /> Delete Account
          </Link>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 text-red-600 hover:text-red-800 mt-8"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 sm:ml-64">
        {/* Top Navbar */}
        <div className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button className="sm:hidden text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-purple-700">
            Welcome, {localStorage.getItem('name') || 'User'} 👋
          </h1>
        </div>

        {/* Routes */}
        <div className="p-6">
          <Routes>
            <Route index element={<Profile />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="MyOrders" element={<MyOrders />} />
            <Route path="DeleteAccount" element={<DeleteAccount />} />
          </Routes>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.post(`${api}/api/user/logout`, {}, { withCredentials: true }); // ✅ clear cookie on backend

                    localStorage.removeItem("userId");
                    localStorage.removeItem("email");
                    localStorage.removeItem("name");

                    showSuccessToast("Logged out successfully");
                    navigate("/"); // ✅ go to login page
                  } catch (error) {
                    console.error("Logout failed:", error);
                    showSuccessToast("Logout failed");
                  } finally {
                    setShowLogoutModal(false); // hide modal
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
