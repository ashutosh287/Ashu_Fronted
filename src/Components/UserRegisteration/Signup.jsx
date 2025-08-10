import { TextField } from '@mui/material';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { SignUpSchema } from './SignUpValidation';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../ToastifyNotification/Notification';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const API_BASE = "/api";

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const response = await axios.post(`${API_BASE}/User/createUser`, values, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200 || response.status === 201) {
          sessionStorage.setItem("UserMailId", response.data.email);
          showSuccessToast("OTP Sent to Mail");
          navigate(`/verify-otp/${response.data.id}`);
        }
      } catch (error) {
        const responseData = error.response?.data || {};
        const userStatus = responseData.data || {};

        if (userStatus.isVerify === true) {
          showSuccessToast(' Account already exists. Please log in.');
          navigate('/login');
        } else {
          showErrorToast(responseData.msg || "❌ An error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }
  });

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } = formik;

  return (


    <section className="section py-4 mb-8 min-h-screen flex items-center bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4  text-white px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md text-sm hover:bg-purple-700 transition"
      >
         Back
      </button>
      <div className="container px-2 sm:px-4">
        <div className="card bg-white shadow-md w-full max-w-sm sm:max-w-lg mx-auto rounded-b-md p-4 sm:p-8">
          <h3 className="text-center text-black font-serif mb-4 text-base sm:text-xl">
            New here? Sign up!
          </h3>

          <form className="w-full" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group font-serif mb-3">
              <TextField
                type="text"
                id="name"
                name="name"
                label="Name *"
                variant="standard"
                className="w-full"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                InputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                autoComplete="off"
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-xs mt-1">{errors.name}</div>
              )}
            </div>

            {/* Email */}
            <div className="form-group font-serif mb-3">
              <TextField
                type="email"
                id="email"
                name="email"
                label="Email Id *"
                variant="standard"
                className="w-full"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                InputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                autoComplete="off"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-xs mt-1">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group font-serif mb-3 relative">
              <TextField
                id="password"
                name="password"
                label="Password *"
                variant="standard"
                className="w-full"
                type={isShowPassword ? "text" : "password"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                InputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                autoComplete="off"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-xs mt-1">{errors.password}</div>
              )}
              <Button
                type="button"
                className="!absolute w-8 !text-xl top-2 right-1 z-50 !min-w-0 !rounded-full !text-black"
                onClick={() => setIsShowPassword(!isShowPassword)}
                tabIndex={-1}
                aria-label={isShowPassword ? "Hide password" : "Show password"}
              >
                {isShowPassword ? <IoEyeOff /> : <IoEye />}
              </Button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className={`w-full gap-2 !border-2 !text-white bg-gradient-to-r from-purple-500 to-blue-500 !mt-2 rounded-2xl text-sm sm:text-lg ${isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-blue-700 text-white"
                }`}
              disabled={isLoading}
              style={{ minHeight: 40 }}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>

            {/* Login Redirect */}
            <div className="gap-2 items-center mt-3 flex  sm:flex-row justify-center text-xs sm:text-sm">
              <span className="font-serif">Already have an account?</span>
              <Link to="/login" className="font-serif text-purple-500 underline">
                Login
              </Link>
            </div>

            {/* Google Signup (Placeholder) */}
            {/* <Button className="w-full !border-2 !text-white !bg-purple-600 !mt-3 gap-2 rounded-2xl text-sm sm:text-lg flex items-center justify-center"
              style={{ minHeight: 40 }}>
              <span className="text-xl sm:text-2xl">
                <FcGoogle />
              </span>
              <span className="inline">Google</span>
            </Button> */}
          </form>
        </div>
      </div>
    </section>
  );
}
