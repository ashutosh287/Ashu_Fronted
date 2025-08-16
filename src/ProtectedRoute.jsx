import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [checking, setChecking] = useState(true); // ✅ To avoid flicker redirect
  const api = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${api}/api/user/check-auth`, {
          withCredentials: true, // ✅ Required to send cookies
        });

        if (res.data.isLoggedIn) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch (err) {
        setIsLogin(false);
      } finally {
        setChecking(false); // ✅ Done checking
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return <div className="text-center p-10">Loading...</div>; // spinner etc.
  }

  if (!isLogin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
