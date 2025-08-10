// src/validations/SellerSignupSchema.js
import * as Yup from "yup";

export const SellerSignupSchema = Yup.object().shape({
  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')
    .min(2, 'Owner name must be at least 2 characters')
    .max(50, 'Owner name must be less than 50 characters')
    .required('Owner name is required'),

  shopName: Yup.string()
    .min(2, 'Shop name must be at least 2 characters')
    .max(50, 'Shop name must be less than 50 characters')
    .required('Shop name is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
    .required('Phone number is required'),

  password: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character'
    )
    .required('Password is required'),
});
