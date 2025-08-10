import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { SellerSignupSchema } from "./SellerValidation";
import { useState } from "react";

const SellerSignup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      ownerName: "",
      shopName: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: SellerSignupSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const res = await axios.post("/api/api/signup", values);
        localStorage.setItem("sellerToken", res.data.token);
        alert("Seller account created!");
        navigate("/seller/portal/login");
      } catch (err) {
        console.error(err);
        alert("Signup failed. " + (err.response?.data?.message || "Please try again."));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br mt-16 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-purple-700 tracking-tight drop-shadow">
          Seller Signup
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/** Owner Name */}
          <div>
            <label htmlFor="ownerName" className="block text-gray-700 mb-2 font-medium">Owner Name</label>
            <input
              id="ownerName"
              name="ownerName"
              value={formik.values.ownerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter owner name"
              className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-purple-50 focus:ring-2 focus:ring-purple-400"
            />
            {formik.touched.ownerName && formik.errors.ownerName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.ownerName}</p>
            )}
          </div>

          {/** Shop Name */}
          <div>
            <label htmlFor="shopName" className="block text-gray-700 mb-2 font-medium">Shop Name</label>
            <input
              id="shopName"
              name="shopName"
              value={formik.values.shopName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter shop name"
              className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-purple-50 focus:ring-2 focus:ring-purple-400"
            />
            {formik.touched.shopName && formik.errors.shopName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.shopName}</p>
            )}
          </div>

          {/** Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email"
              className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-purple-50 focus:ring-2 focus:ring-purple-400"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/** Phone */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">Phone</label>
            <input
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-purple-50 focus:ring-2 focus:ring-purple-400"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/** Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-purple-50 focus:ring-2 focus:ring-purple-400"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/** Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200
              ${isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:from-purple-700 hover:to-purple-500"}`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/seller/portal/login")}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;
