import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';


import {
  Signup,
  Login,
  Dashboard,
  ShopCards,
  ShopPage,
  AddShop,
  SellerShopView,
  Cart,
  PlaceOrder,
  ReadyOrder,
  UserSignup,
  OtpVerification,
  UserLogin,
  Navbar,
  Footer,
  UserOrders,
  OrderSummary,
  ReadyOrderSummary,
  Logout,
  ResetPassword,
  ForgotPassword,
  ChangePassword,
  UserDashboard,
  UserProfile,
  ShopSearch,
  Revenue,
  ThanksReg,
  ContactUs,
  HelpCenter,
  AboutUs,
  OurStory,
  PrivacyPolicy,
  CommunityRules,
  SellerForgotPassword,
  SellerOTPVerification,
  WhySell


} from './AllComponents';


import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './Components/Scroll/ScrollToTop';

// ✅ Token Check
import SellerProtectedRoutes from './SellerProtectedRoutes';



export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop /> 
      <Routes>
        
        {/* 🔓 Public Routes */}
        <Route path="/shop" element={<ShopCards />} />
        <Route path="/shop/:id" element={<ShopPage />} />
        <Route path="/cart/:shopId" element={<Cart />} />
        <Route path="/order/:shopId" element={<PlaceOrder />} />
        <Route path="/readyOrder/:shopId" element={<ReadyOrder />} />


        {/* 🔐 Auth Routes */}
        <Route path="/seller/portal/signup" element={<Signup />} />
        <Route path="/seller/portal/login" element={<Login />} />
        <Route path="/" element={<Navbar />} />
        <Route path="/user/Order" element={<UserOrders />} />
        <Route path="/OrderSummary" element={<OrderSummary />} />
        <Route path="/ReadyOrderSummary" element={<ReadyOrderSummary />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/community-rules" element={<CommunityRules />} />
        <Route path="/seller/forgot-password" element={<SellerForgotPassword />} />
        <Route path="/seller/otp-verification/:id" element={<SellerOTPVerification />} />

        {/*Usersignup*/}

        <Route path="/signup" element={<UserSignup />} />
        <Route path="/verify-otp/:id" element={<OtpVerification />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/become-a-seller' element={<WhySell />} />

        <Route path="/shop/:shopId" element={<ShopPage />} />


        <Route path="/user-dashboard/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

        {/* 🔐 Protected Seller Routes */}
        <Route path="/sell/manage" element={<SellerProtectedRoutes><Dashboard /></SellerProtectedRoutes>} />
        <Route path="/add-shop" element={<AddShop />} />
        <Route path="/thanks" element={<ThanksReg />} />
        <Route path="/my-shop" element={<SellerProtectedRoutes><SellerShopView /></SellerProtectedRoutes>} />

        {/* ❌ Not found fallback */}
        <Route path="*" element={<div className="p-10 text-center text-red-500 font-bold text-xl">404 | Page Not Found</div>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
} 