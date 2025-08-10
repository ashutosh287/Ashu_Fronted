import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import {
  showSuccessToast,
  showErrorToast,
} from "../ToastifyNotification/Notification";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [emailForOTP, setEmailForOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1️⃣ Handle sending OTP
  const handleSendOtp = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/request-password-reset", {
        email: values.email,
      });
      setEmailForOTP(values.email);
      showSuccessToast("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      showErrorToast(err?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Handle OTP verification
  const handleVerifyOtp = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/forgot-password/verify-otp", {
        email: emailForOTP,
        otp: values.otp,
      });
      showSuccessToast("OTP verified successfully.");
      setStep(3);
    } catch (err) {
      showErrorToast(err?.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Handle password reset
  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/forgot-password/reset-password", {
        email: emailForOTP,
        newPassword: values.password,
      });
      showSuccessToast("Password reset successfully.");
      navigate("/UserLogin");
    } catch (err) {
      showErrorToast(err?.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-md border border-purple-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 text-center mb-6">
          🔐 Forgot Password
        </h2>

        {step === 1 && (
          <EmailStep onSubmit={handleSendOtp} loading={loading} />
        )}
        {step === 2 && (
          <OtpStep onSubmit={handleVerifyOtp} loading={loading} />
        )}
        {step === 3 && (
          <PasswordStep onSubmit={handleResetPassword} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

// Step 1️⃣ Email Step
const EmailStep = ({ onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    }),
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Enter your Email
      </label>
      <input
        type="email"
        name="email"
        placeholder="example@gmail.com"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        disabled={loading}
      />
      {formik.touched.email && formik.errors.email && (
        <p className="text-sm text-red-600">{formik.errors.email}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium transition ${
          loading
            ? "bg-purple-400 text-white cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};

// Step 2️⃣ OTP Step
const OtpStep = ({ onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^\d{4}$/, "OTP must be 4 digits")
        .required("OTP is required"),
    }),
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
      <input
        type="text"
        name="otp"
        placeholder="Enter 4-digit OTP"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.otp}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        disabled={loading}
      />
      {formik.touched.otp && formik.errors.otp && (
        <p className="text-sm text-red-600">{formik.errors.otp}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium transition ${
          loading
            ? "bg-purple-400 text-white cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};

// Step 3️⃣ Password Step
const PasswordStep = ({ onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .matches(/[A-Z]/, "At least one uppercase")
        .matches(/[a-z]/, "At least one lowercase")
        .matches(/\d/, "At least one number")
        .matches(/[@$!%*?&]/, "At least one special character")
        .required("Password is required"),
    }),
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        New Password
      </label>
      <input
        type="password"
        name="password"
        placeholder="Enter strong password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        disabled={loading}
      />
      {formik.touched.password && formik.errors.password && (
        <p className="text-sm text-red-600">{formik.errors.password}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium transition ${
          loading
            ? "bg-purple-400 text-white cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};
