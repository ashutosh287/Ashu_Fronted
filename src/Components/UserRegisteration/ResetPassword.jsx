// src/pages/ResetPassword.jsx

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_BASE_URL;


const ResetPassword = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("resetUserId");

  const initialValues = {
    otp: "",
    newPassword: "",
  };

  const validationSchema = Yup.object({
    otp: Yup.string().required("OTP is required"),
    newPassword: Yup.string().min(6, "Min 6 chars").required("New password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await axios.post(`${api}/api/user/reset-password/${userId}`, values);
      if (res.data.status) {
        localStorage.removeItem("resetUserId");
        navigate("/login"); // Or your desired login path
      }
    } catch (err) {
      setStatus(err.response?.data?.msg || "Something went wrong");
    }
    setSubmitting(false);
  };

  if (!userId) return <p className="text-center text-red-600 mt-10">Invalid request. Try again.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label>OTP:</label>
              <Field type="text" name="otp" className="w-full border p-2 rounded" />
              <ErrorMessage name="otp" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label>New Password:</label>
              <Field type="password" name="newPassword" className="w-full border p-2 rounded" />
              <ErrorMessage name="newPassword" component="div" className="text-red-600 text-sm" />
            </div>

            {status && <div className="text-red-600">{status}</div>}

            <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded">
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
