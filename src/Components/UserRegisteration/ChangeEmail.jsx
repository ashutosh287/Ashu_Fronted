// components/ChangeEmail.jsx
import { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { showErrorToast } from '../ToastifyNotification/Notification';
const api = import.meta.env.VITE_BASE_URL;


// ✅ Email validation schema using Yup
const emailSchema = Yup.object().shape({
  newEmail: Yup.string()
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Invalid email format'
    )
    .required('Email is required'),
});

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChangeEmail = async () => {
    try {
      // ✅ First validate email with Yup
      await emailSchema.validate({ newEmail });

      const res = await axios.patch(
        `${api}/api/user/change-email`,
        { newEmail },
        { withCredentials: true } // ✅ use cookies, not headers
      );

      setMessage(res.data.message + ` (Old: ${res.data.oldEmail})`);
      setNewEmail('');
    } catch (err) {
      if (err.name === 'ValidationError') {
        showErrorToast(err.message); // 🔴 Yup validation error
      } else {
        console.error('❌ Email change error:', err);
        showErrorToast(err.response?.data?.message || 'Something went wrong');
      }
    }
  };


  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg mt-20 mb-24 space-y-6 border border-purple-200">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📧 Change Email</h2>
        <p className="text-gray-500 text-sm">
          Enter a new email address to update your account.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Email
          </label>
          <input
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        <button
          onClick={handleChangeEmail}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-lg transition duration-300"
        >
          Change Email
        </button>

        {message && (
          <div className="text-center mt-2">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeEmail;
