import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const SellerProtectedRoutes = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get("/api/check-seller-token", { withCredentials: true })
      .then((res) => {
        setLoggedIn(res.data.loggedIn);
        setLoading(false);
      })
      .catch(() => {
        setLoggedIn(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return loggedIn ? children : <Navigate to="/seller/portal/login" replace />;
};

export default SellerProtectedRoutes;
