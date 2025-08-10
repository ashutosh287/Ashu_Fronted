import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const RequestSubmitted = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="flex flex-col items-center text-center max-w-md">
                <FaCheckCircle className="text-green-500 text-6xl mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    Your request has been successfully submitted!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for reaching out. Our team has received your request and will contact you shortly.
                    We appreciate your patience and look forward to assisting you!
                </p>
                <Link
                    to="/"
                    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>

    );
};

export default RequestSubmitted;
