import React, { useState } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../ToastifyNotification/Notification";
import { useNavigate } from "react-router-dom";

const SellerForgotPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOTP] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/seller/request-otp", { email });
            showSuccessToast("OTP sent to your email.");
            setStep(2);
        } catch (err) {
            showErrorToast(err?.response?.data?.msg || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/seller/verify-otp", { email, otp });
            showSuccessToast("OTP verified. Please reset your password.");
            setStep(3);
        } catch (err) {
            showErrorToast(err?.response?.data?.msg || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            showErrorToast("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/seller/reset-password", {
                email,
                otp, // ✅ include this
                newPassword: password, // ✅ backend expects 'newPassword'
            });
            showSuccessToast("Password reset successfully.");
            navigate("/Login");
        } catch (err) {
            showErrorToast(err?.response?.data?.msg || "Reset failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-xl space-y-6 max-w-md w-full transition-all duration-300">
                <h2 className="text-2xl font-bold text-purple-700 text-center">
                    {step === 1 && "Forgot Password"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "Reset Password"}
                </h2>

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            placeholder="Enter your registered email"
                            className="w-full border px-4 py-2 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-md text-white font-medium transition ${loading
                                    ? "bg-purple-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                        >
                            {loading ? "Submitting..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOTPSubmit} className="space-y-4">
                        <input
                            type="text"
                            required
                            placeholder=" 🔒 Enter 4-digit OTP"
                            className="w-full border px-4 py-2 rounded-md"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-md text-white font-medium transition ${loading
                                    ? "bg-purple-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-purple-500 underline mt-2"
                        >
                            Go Back
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <input
                            type="password"
                            required
                            placeholder="New Password"
                            className="w-full border px-4 py-2 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            placeholder="Confirm Password"
                            className="w-full border px-4 py-2 rounded-md"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-md text-white font-medium transition ${loading
                                    ? "bg-purple-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SellerForgotPassword;




