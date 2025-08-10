import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { showSuccessToast, showErrorToast } from '../../ToastifyNotification/Notification';
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("email");

  const formik = useFormik({
    initialValues: {
      userEmail: userEmail || "", 
      fullName: "",
      email: "",
      mobile: "",
      message: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
        .min(3, "Full name must be at least 3 characters")
        .required("Full name is required"),
      email: Yup.string()
        .matches(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid email format"
        )
        .required("Email is required"),
      mobile: Yup.string()
        .matches(
          /^[6-9]\d{9}$/,
          "Mobile number must be 10 digits and start with 6, 7, 8, or 9"
        )
        .required("Mobile number is required"),
      message: Yup.string()
        .min(10, "Message must be at least 10 characters")
        .required("Message is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      // Check if user is logged in
      const token = localStorage.getItem("token");

      if (!token) {
        showErrorToast("Please login to send a message.");
        setSubmitting(false);
        return;
      }

      try {
        const response = await axios.post(`/api/ContactUs`, values);

        if (response.status === 201) {
          showSuccessToast('Submitted! Stay tuned.');
          resetForm();
          navigate('/');
        } else {
          showErrorToast('Something went wrong. Please try again later');
        }
      } catch (error) {
        alert("Error submitting form: " + error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Get in Touch</h2>
          <p className="mt-3 text-gray-600 text-lg">
            We’re here to help! Fill out the form and our team will get back to you soon.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Info */}
          <div className="space-y-8 bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <FaMapMarkerAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Our Office</h4>
                <p className="text-gray-600">Madhuban Karnal, India</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <FaPhoneAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Phone</h4>
                <p className="text-gray-600">+91 9876543210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <FaEnvelope className="text-purple-600 text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Email</h4>
                <p className="text-gray-600">support@ishop.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="Enter your name"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  formik.touched.fullName && formik.errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                name="mobile"
                type="tel"
                maxLength={10}
                placeholder="Enter your mobile number"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  formik.touched.mobile && formik.errors.mobile
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                }`}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
                  formik.setFieldValue("mobile", onlyDigits);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.mobile}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                rows="5"
                placeholder="How can we help you?"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  formik.touched.message && formik.errors.message
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
              />
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
