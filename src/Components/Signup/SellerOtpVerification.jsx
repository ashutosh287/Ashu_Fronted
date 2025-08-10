// ✅ SellerOTPVerification.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../ToastifyNotification/Notification";
import { useNavigate } from "react-router-dom";

const SellerOTPVerification = ({ email }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!canResend && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleChange = (input, index) => {
    const newCode = [...code];
    newCode[index] = input.value;
    setCode(newCode);
    if (input.value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = code.join("");
    if (enteredOtp.length !== 4) return showErrorToast("Enter complete 4-digit OTP");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/seller/verify-otp", {
        email,
        otp: enteredOtp,
      });
      showSuccessToast(res.data.msg);
      navigate("/SellerLogin");
    } catch (err) {
      showErrorToast(err.response?.data?.msg || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("/api/seller/request-otp", { email });
      showSuccessToast("OTP resent successfully");
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      showErrorToast("Failed to resend OTP");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h2 className="font-semibold text-3xl">Email Verification</h2>
            <p className="text-sm font-medium text-gray-500">
              We have sent a 4-digit code to your email: <span className="font-bold text-black">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-16">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                {code.map((digit, index) => (
                  <div key={index} className="w-16 h-16">
                    <input
                      id={`otp-input-${index}`}
                      className="w-full h-full text-center text-lg border border-gray-200 rounded-xl outline-none focus:ring-1 ring-blue-700"
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-700 text-white py-4 rounded-xl text-sm font-semibold hover:bg-purple-800 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify Account"}
                </button>

                <div className="text-center text-sm font-medium text-gray-600">
                  Didn’t receive code? {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-purple-600 underline ml-1"
                    >
                      Resend
                    </button>
                  ) : (
                    <span>Resend in {timeLeft}s</span>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerOTPVerification;
