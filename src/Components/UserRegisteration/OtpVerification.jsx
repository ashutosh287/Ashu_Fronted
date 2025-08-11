import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { showErrorToast, showSuccessToast } from '../ToastifyNotification/Notification';
const api = import.meta.env.VITE_BASE_URL;


const OTPVerification = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const email = sessionStorage.getItem("UserMailId"); // Make sure you save it during registration

  const [code, setCode] = useState(new Array(4).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);


  // Countdown timer for resend
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // OTP input handler
  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d?$/.test(value)) return;

    let newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      setCanResend(false);
      setTimeLeft(30);

      await axios.post(`${api}/User/forgot-password/resend-otp`, { email });
      showSuccessToast("New OTP has been sent to your email.");

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Failed to resend OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userOtp = code.join("");

      const response = await axios.post(`${api}/User/verifyOtp/${id}`, {
        otp: userOtp,
      });

      showSuccessToast("OTP verified");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.response?.data?.msg || "❌ OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h2 className="font-semibold text-3xl">Email Verification</h2>
            <p className="text-sm font-medium text-gray-500">
              We have sent a 4-digit code to your email:{" "}
              <span className="font-bold text-black">{email}</span>
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
                  Didn’t receive code?{" "}
                  {canResend ? (
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

export default OTPVerification;
