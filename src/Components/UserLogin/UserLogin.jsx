import { TextField } from '@mui/material';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { LoginSchema } from './LoginValidation';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import { showSuccessToast, showErrorToast } from '../ToastifyNotification/Notification'

const api = import.meta.env.VITE_BASE_URL;

export default function Login({ setIsLogin }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { values, handleSubmit, handleChange, handleBlur, errors, touched } = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                const response = await axios.post(
                    `${api}/api/user/login`,
                    values,
                    { withCredentials: true } // ✅ Send and receive secure HTTP-only cookie
                );

                if (response.status === 200 || response.status === 201) {
                    showSuccessToast("Successfully Logged In");

                    // ✅ Only store non-sensitive user info
                    localStorage.setItem("userId", response.data.user.id);
                    localStorage.setItem("email", response.data.user.email);
                    localStorage.setItem("name", response.data.user.name);

                    // ❌ NO NEED to store token in localStorage anymore
                    // localStorage.setItem("token", response.data.token); ⛔ remove this

                    navigate('/');
                }
            } catch (error) {
                const message = error.response?.data?.msg;

                if (message === 'No account found') {
                    showErrorToast(message);
                    navigate('/signup');

                } else if (message === 'Wrong Password') {
                    showErrorToast(message);

                } else if (message?.toLowerCase()?.includes('locked')) {
                    // ✅ Account is locked (after 3 wrong attempts)
                    showErrorToast(message); // shows: Account locked due to multiple failed attempts...

                } else if (error.response?.data?.data?.isVerify) {
                    const userId = error.response?.data?.data?.UserId;
                    if (userId) {
                        navigate(`${api}/verify-otp/${userId}`);
                    } else {
                        showErrorToast("User ID missing for OTP verification");
                    }

                } else {
                    showErrorToast(message || "Invalid Credentials");
                }

            } finally {
                setIsLoading(false);
            }
        },

    });


    return (
        <section className='section py-32 sm:py-40'>
            <button
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition"
            >
                Back
            </button>
            <div className='container px-2 sm:px-0'>
                <div className='card bg-white shadow-md w-full max-w-[95vw] sm:max-w-[500px] mx-auto rounded-b-md p-4 sm:p-5 sm:px-10'>
                    <h3 className='text-center Link text-lg sm:text-xl text-black font-serif mb-4'>
                        Login to your account
                    </h3>

                    <form className='w-full' onSubmit={handleSubmit}>
                        <div className='form-group font-serif mb-4'>
                            <TextField
                                type='email'
                                id='email'
                                label='Email Id *'
                                variant='standard'
                                className='w-full'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                size='small'
                                InputProps={{ style: { fontSize: 15 } }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                            />
                            {errors.email && touched.email ? (
                                <div className='text-red-500 text-xs mt-1'>{errors.email}</div>
                            ) : null}
                        </div>

                        <div className='form-group font-serif mb-4 relative'>
                            <TextField
                                id='password'
                                label='Password *'
                                variant='standard'
                                className='w-full'
                                type={isShowPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                size='small'
                                InputProps={{ style: { fontSize: 15 } }}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                            />
                            {errors.password && touched.password ? (
                                <div className='text-red-500 text-xs mt-1'>{errors.password}</div>
                            ) : null}
                            <Button
                                className='!absolute w-[32px] !text-xl top-2 right-1 z-50 !min-w-[32px] !rounded-full !text-black'
                                onClick={() => setisShowPassword(!isShowPassword)}
                                tabIndex={-1}
                                type="button"
                            >
                                {isShowPassword ? <IoEyeOff /> : <IoEye />}
                            </Button>
                        </div>

                        <div className='flex justify-end mb-3'>
                            <Link to="/forgetPassword" className='Link font-serif text-xs sm:text-sm'>
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type='submit'
                            className={`w-full gap-2 Link !border-2 !text-white bg-gradient-to-r from-purple-500 to-blue-500 !mt-1 rounded-2xl text-base sm:text-lg py-2 ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging In..." : "Login"}
                        </Button>

                        <div className='gap-2 items-center mt-3 flex  sm:flex-row justify-center'>
                            <span className='font-serif text-sm sm:text-base'>New here?</span>
                            <Link to="/signup" className='Link items-center font-serif text-purple-500 underline text-sm sm:text-base'>
                                Create an account.
                            </Link>
                        </div>

                        {/* <Button className='w-full Link !border-2 !text-white !bg-purple-600 !mt-3 gap-2 rounded-2xl text-base sm:text-lg py-2'>
                            <span className='text-2xl'>
                                <FcGoogle />
                            </span>
                            <span className='text-sm sm:text-base'>Login With Google</span>
                        </Button> */}
                    </form>
                </div>
            </div>
        </section>
    );
}
