import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../ToastifyNotification/Notification'

const PlaceOrder = () => {
  const { shopId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isImmediateDelivery, setIsImmediateDelivery] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    contactNumber: '',
    preferredDeliveryTime: '',
    paymentMethod: 'Cash on Delivery',
    orderNotes: '',
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5005/cart/${shopId}`)
      .then((res) => {
        setCartItems(res.data);
        const totalAmount = res.data.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotal(totalAmount);
      })
      .catch((err) => {
        console.error('Failed to load cart:', err);
        setError('Unable to load cart.');
      });
  }, [shopId]);

  const getAvailableSlots = () => {
    const now = new Date();
    const currentHour = now.getHours(); // 0 - 23
    const currentMinutes = now.getMinutes();

    const slots = [];

    for (let hour = 8; hour < 22; hour++) {
      const start = hour;
      const end = hour + 1;

      const label = `${formatHour(start)} - ${formatHour(end)}`;
      const value = `${start}-${end}`;

      // Disable if current time is already past the end of this slot
      const disabled = currentHour > end || (currentHour === end && currentMinutes > 0);

      slots.push({ label, value, disabled });
    }

    return slots;
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.address || !form.contactNumber) {
      return setError('Please fill all required fields.');
    }

    try {
      const token = localStorage.getItem("token"); // ✅ JWT token

      const res = await axios.post(
        'http://localhost:5005/orders',
        {
          shopId,
          items: cartItems,
          buyerName: form.fullName,
          address: form.address,
          phone: form.contactNumber,
          preferredDeliveryTime: isImmediateDelivery
            ? 'Immediate'
            : form.preferredDeliveryTime,
          paymentMethod: form.paymentMethod,
          orderNotes: form.orderNotes,
          totalAmount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = res.data.order; // ✅ get full order returned from backend

      // ✅ Navigate to OrderSummary and pass the order object
      showSuccessToast('Order Placed')
      navigate('/OrderSummary', {
        state: { order },
      });

    } catch (err) {
      console.error('❌ Order failed:', err);
      showErrorToast('Failed to place order.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-6 mb-12">
      <h2 className="text-2xl font-bold mb-4">🧾 Place Your Order</h2>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Full Name */}
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleInputChange}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            placeholder="Enter your address"
            className="w-full p-2 border rounded-lg"
            rows={2}
            value={form.address}
            onChange={handleInputChange}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter 10-digit number"
          />
        </div>

        {/* Preferred Delivery Slot */}
        <div>
          <label className="block font-medium mb-1">
            Preferred Delivery Slot
          </label>
          <select
            name="preferredDeliveryTime"
            value={form.preferredDeliveryTime}
            onChange={(e) => {
              setForm({ ...form, preferredDeliveryTime: e.target.value });
              setIsImmediateDelivery(false);
            }}
            className="p-2 border rounded w-full sm:w-1/2 mt-2"
            disabled={isImmediateDelivery}
          >
            <option value="">Select Delivery Time Slot</option>
            {getAvailableSlots().map((slot, idx) => (
              <option key={idx} value={slot.value} disabled={slot.disabled}>
                {slot.label} {slot.disabled ? '(Unavailable)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Immediate Delivery Checkbox */}
        <div className="mt-4">
          <label className="inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isImmediateDelivery}
              onChange={(e) => {
                setIsImmediateDelivery(e.target.checked);
                if (e.target.checked)
                  setForm({ ...form, preferredDeliveryTime: '' });
              }}
              className="mr-2"
            />
            <span
              className={`${isImmediateDelivery ? 'text-purple-700 font-semibold' : ''
                }`}
            >
              Get Order Now (Within 10 min)
            </span>
          </label>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block font-medium">Select Payment Method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Online UPI">Online UPI</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>

        {/* Order Notes */}
        <div>
          <label className="block font-medium">Order Notes (Optional)</label>
          <textarea
            name="orderNotes"
            placeholder="Add any special instructions or notes here..."
            className="w-full p-2 border rounded-lg"
            value={form.orderNotes}
            onChange={handleInputChange}
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Cart Summary */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">🛒 Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="border p-3 rounded mb-2">
              <div className="font-semibold">{item.name}</div>
              <div>Qty: {item.quantity}</div>
              <div>Price: ₹{item.price}</div>
            </div>
          ))}
          <div className="font-bold text-lg mt-4">Total: ₹{total}</div>
        </div>

        {/* Submit */}
        <button
          onClick={handlePlaceOrder}
          className="mt-6 bg-green-600 text-white w-full py-3 rounded-lg font-bold hover:bg-green-700"
        >
          ✅ Confirm Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
