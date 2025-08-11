import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { AddShopSchema } from "./AddShopValidation";
import { showSuccessToast, showErrorToast } from "../ToastifyNotification/Notification";
import imageCompression from "browser-image-compression"; // ✅ Compression lib added
const api = import.meta.env.VITE_BASE_URL;


const AddShop = () => {
  const navigate = useNavigate();
  const [shopImage, setShopImage] = useState(null);
  const [shopkeeperImage, setShopkeeperImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      shopName: "",
      ownerName: "",
      phone: "",
      email: "",
      address: "",
      landmark: "",
      pincode: "",
      openingTime: "",
      closingTime: "",
      productTypes: [],
      shopCategory: "",
    },
    validationSchema: AddShopSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let shopImageUrl = "";
        let shopkeeperImageUrl = "";

        if (shopImage) shopImageUrl = await uploadToCloudinary(shopImage);
        if (shopkeeperImage) shopkeeperImageUrl = await uploadToCloudinary(shopkeeperImage);

        const finalData = {
          ...values,
          shopImage: shopImageUrl,
          shopkeeperImage: shopkeeperImageUrl,
        };

        await axios.post(`${api}/api/add-shop`, finalData);
        showSuccessToast("Shop registered successfully!");
        navigate("/thanks");
      } catch (error) {
        if (error.response?.data?.message === "Your request is already submitted.") {
          navigate("/thanks");
        } else {
          showErrorToast("Failed to register shop");
        }
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // ✅ Compress + upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.3,             // Max 300KB
        maxWidthOrHeight: 1000,     // Optional resize
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "AshuManna18_URL");
      formData.append("cloud_name", "djd50rrlr");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djd50rrlr/image/upload",
        formData
      );

      return res.data.secure_url;
    } catch (error) {
      console.error("❌ Image compression/upload error:", error);
      showErrorToast("Image upload failed");
      throw error;
    }
  };

  // ✅ Store raw file to state
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "shopImage") setShopImage(files[0]);
    if (name === "shopkeeperImage") setShopkeeperImage(files[0]);
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    formik.setFieldValue("productTypes", selected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center py-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-2xl mx-auto p-10 bg-white rounded-3xl shadow-2xl border border-purple-100 space-y-8"
      >
        <h2 className="text-3xl font-extrabold text-purple-700 text-center mb-6 tracking-tight drop-shadow">
          Register Your Shop
        </h2>

        <div className="text-sm text-red-600 font-medium">
          कृपया सभी जानकारी सही-सही भरें, वरना आपकी दुकान रिजेक्ट की जा सकती है। <br />
          <span className="text-gray-700">
            Please fill all information carefully and truthfully. Incorrect details may lead to shop rejection.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "shopName", label: "Shop Name" },
            { name: "ownerName", label: "Owner Name" },
            { name: "phone", label: "Phone" },
            { name: "email", label: "Email" },
            { name: "address", label: "Address" },
            { name: "landmark", label: "Landmark" },
            { name: "pincode", label: "Pincode" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-purple-800 font-semibold mb-1">{label}</label>
              <input
                name={name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                className="input border border-purple-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-400"
              />
              {formik.touched[name] && formik.errors[name] && (
                <p className="text-sm text-red-500">{formik.errors[name]}</p>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-purple-800 font-semibold mb-1">Opening Time</label>
              <input
                type="time"
                name="openingTime"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.openingTime}
                className="input border border-purple-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-400"
              />
              {formik.touched.openingTime && formik.errors.openingTime && (
                <p className="text-sm text-red-500">{formik.errors.openingTime}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-purple-800 font-semibold mb-1">Closing Time</label>
              <input
                type="time"
                name="closingTime"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.closingTime}
                className="input border border-purple-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-400"
              />
              {formik.touched.closingTime && formik.errors.closingTime && (
                <p className="text-sm text-red-500">{formik.errors.closingTime}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-purple-800 font-semibold mb-1">Shop Category</label>
            <select
              name="shopCategory"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.shopCategory}
              className="input border border-purple-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="grocery">Grocery</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.shopCategory && formik.errors.shopCategory && (
              <p className="text-sm text-red-500">{formik.errors.shopCategory}</p>
            )}
          </div>

          <div>
            <label className="block text-purple-800 font-semibold mb-1">Product Types</label>
            <select
              name="productTypes"
              multiple
              onChange={handleMultiSelect}
              onBlur={formik.handleBlur}
              className="input border border-purple-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-400"
            >
              <option value="vegetables">Vegetables & Fruits</option>
              <option value="grocery">Grocery</option>
              <option value="veg">Veg Food</option>
              <option value="nonveg">Non-Veg Food</option>
              <option value="both">Veg & Non-Veg</option>
              <option value="fastfood">Fast Food</option>
              <option value="snacks">Snacks</option>
            </select>
            {formik.touched.productTypes && formik.errors.productTypes && (
              <p className="text-sm text-red-500">{formik.errors.productTypes}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-purple-800 font-semibold mb-2">Upload Shop Image</label>
            <input
              type="file"
              name="shopImage"
              accept="image/*"
              onChange={handleFileChange}
              className="input border border-purple-200 rounded-lg px-4 py-2 w-full bg-purple-50"
            />
          </div>
          <div>
            <label className="block text-purple-800 font-semibold mb-2">Upload Shopkeeper Image</label>
            <input
              type="file"
              name="shopkeeperImage"
              accept="image/*"
              onChange={handleFileChange}
              className="input border border-purple-200 rounded-lg px-4 py-2 w-full bg-purple-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:from-purple-700 hover:to-purple-500"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Shop"}
        </button>
      </form>
    </div>
  );
};

export default AddShop;
