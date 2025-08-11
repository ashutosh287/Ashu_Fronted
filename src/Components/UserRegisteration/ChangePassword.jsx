import axios from "axios";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showErrorToast, showSuccessToast } from "../ToastifyNotification/Notification";
const api = import.meta.env.VITE_BASE_URL;


const ChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Yup validation schema
  const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Current password is required")
      .min(6, "Must be at least 6 characters"),

    newPassword: Yup.string()
      .required("New password is required")
      .notOneOf([Yup.ref("currentPassword")], "New password must be different from current password")
      .matches(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Must be 8+ chars with uppercase, lowercase, number, and special character"
      ),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting, setStatus }) => {
    try {
      const res = await axios.post(
        `${api}/User/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          withCredentials: true, // ✅ send cookies with request
        }
      );

      if (res.status === 200) {
        setStatus({ success: "Password changed successfully!" });
        showSuccessToast("Password changed successfully!");
        resetForm();
      }
    } catch (err) {
      console.error("❌ Error changing password:", err);
      setStatus({ error: "Something went wrong" });
      showErrorToast("Failed to change password. Please try again.");
    }

    setSubmitting(false);
  };


  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg mt-20 mb-24 space-y-6 border border-purple-200">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
          🔐 Change Password
        </h2>        <p className="text-gray-500 text-sm">Update your password regularly for better security.</p>
      </div>

      <Formik
        initialValues={{ currentPassword: "", newPassword: "" }}
        validationSchema={ChangePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <Field
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <ErrorMessage
                name="currentPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <Field
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg transition duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>

            {/* ✅ Show Form Status Messages */}
            {status?.success && (
              <div className="text-green-600 font-medium text-center">{status.success}</div>
            )}
            {status?.error && (
              <div className="text-red-600 font-medium text-center">{status.error}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
