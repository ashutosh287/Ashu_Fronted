// src/validations/AddShopSchema.js
import * as Yup from "yup";

export const AddShopSchema = Yup.object().shape({
  shopName: Yup.string()
    .required("Shop name is required")
    .min(2, "Shop name must be at least 2 characters"),

  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .required("Owner name is required"),

  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid Indian phone number")
    .required("Phone is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  address: Yup.string().required("Address is required"),

  landmark: Yup.string().required("Landmark is required"),

  pincode: Yup.string()
    .matches(/^\d{6}$/, "Invalid pincode")
    .required("Pincode is required"),

  openingTime: Yup.string().required("Opening time is required"),

  closingTime: Yup.string().required("Closing time is required"),

  productTypes: Yup.array().min(1, "Select at least one product type"),

  shopCategory: Yup.string().required("Shop category is required"),
});
