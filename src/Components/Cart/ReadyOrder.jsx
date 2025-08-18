import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const api = import.meta.env.VITE_BASE_URL;


const PlaceOrderWithType = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [ispreferredPackedTime, setIspreferredPackedTime] = useState(false);
  const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);
  const [error, setError] = useState("");

  // 📌 Load cart data
  useEffect(() => {
    axios
      .get(`${api}/api/cart/${shopId}`, { withCredentials: true })
      .then((res) => {
        setCartItems(res.data);
        const total = res.data.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotalAmount(total);
        const anyOutOfStock = res.data.some((item) => item.isOutOfStock);
        setHasOutOfStockItems(anyOutOfStock);
      })
      .catch((err) => {
        console.error("Cart load failed", err);
        setError("Failed to load cart");
      });
  }, [shopId]);

  // 📌 Delivery slots
  const getAvailableSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const slots = [];

    for (let hour = 8; hour < 22; hour++) {
      const start = hour;
      const end = hour + 1;
      const label = `${formatHour(start)} - ${formatHour(end)}`;
      const value = `${start}-${end}`;
      const disabled =
        currentHour > end || (currentHour === end && currentMinutes > 0);

      slots.push({ label, value, disabled });
    }

    return slots;
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };

  // 📌 Yup Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .min(3, "Full name must be at least 3 characters"),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number starting with 6-9")
      .required("Phone number is required"),
    preferredPackedTime: Yup.string().when("ispreferredPackedTime", {
      is: false,
      then: (schema) => schema.required("Please select a delivery time slot"),
    }),
    paymentMethod: Yup.string().required("Payment method is required"),
    orderNotes: Yup.string().max(200, "Order notes can't be longer than 200 characters"),
    orderType: Yup.string().required("Order type is required"),
  });

  // 📌 Submit Order
  const handleOrderSubmit = async (values) => {
    try {
      const deliveryTime = ispreferredPackedTime ? "immediate" : values.preferredPackedTime;

      const formattedItems = cartItems.map((item) => ({
        productId: item.productId || item._id, // ensure productId exists
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const res = await axios.post(
        `${api}/api/Rorder`,
        {
          shopId,
          fullName: values.fullName,
          phone: values.phone,
          preferredPackedTime: deliveryTime,
          paymentMethod: values.paymentMethod,
          orderNotes: values.orderNotes,
          orderType: values.orderType,
          totalAmount,
          items: formattedItems,
        },
        { withCredentials: true }
      );

      localStorage.setItem(
        "orderSummary",
        JSON.stringify({
          fullName: values.fullName,
          phone: values.phone,
          totalAmount,
          pickupCode: res.data.pickupCode,
          orderType: values.orderType,
          paymentMethod: values.paymentMethod,
        })
      );

      navigate("/ReadyOrderSummary");
    } catch (error) {
      if (error.response) {
        console.error("❌ Order failed:", error.response.data);
        setError(error.response.data.message || "Failed to place order.");
      } else {
        console.error("❌ Order failed:", error.message);
        setError("Failed to place order. Server not reachable.");
      }
    }
  };


  return (
    <section className="bg-gray-50 min-h-screen px-3 py-6 sm:px-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Confirm Your Order
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {hasOutOfStockItems && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-md border border-yellow-300 mb-6 text-sm sm:text-base font-medium">
                ⚠️ Some items are <span className="font-semibold">out of stock</span>. Please remove them to continue.
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-5 mb-6">
              <h2 className="text-lg font-semibold text-gray-700">🛒 Review Your Items</h2>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg shadow-sm"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium text-sm sm:text-base">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.price}</p>
                      {item.isOutOfStock && (
                        <p className="text-red-600 font-semibold text-sm">Out of Stock</p>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-sm sm:text-base">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-gray-800">💰 Total: ₹{totalAmount}</h2>
            </div>

            {/* Formik Form */}
            <Formik
              initialValues={{
                fullName: "",
                phone: "",
                preferredPackedTime: "",
                paymentMethod: "cod",
                orderNotes: "",
                orderType: "ready",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                if (hasOutOfStockItems) {
                  alert("⚠️ Out of stock items present. Please remove them.");
                  return;
                }
                handleOrderSubmit(values);
              }}
            >
              {({ setFieldValue, values }) => (
                <Form className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Field
                      type="text"
                      name="fullName"
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage name="fullName" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Field
                      type="text"
                      name="phone"
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Enter 10-digit number"
                    />
                    <ErrorMessage name="phone" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Delivery Slot */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Preferred Packed Slot</label>
                    <Field
                      as="select"
                      name="preferredPackedTime"
                      disabled={ispreferredPackedTime}
                      className="w-full sm:w-1/2 border px-3 py-2 rounded-lg mt-1"
                    >
                      <option value="">Select Packed slot</option>
                      {getAvailableSlots().map((slot, idx) => (
                        <option key={idx} value={slot.value} disabled={slot.disabled}>
                          {slot.label} {slot.disabled ? "(Unavailable)" : ""}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="preferredPackedTime" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Get Now Checkbox */}
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={ispreferredPackedTime}
                        onChange={(e) => {
                          setIspreferredPackedTime(e.target.checked);
                          if (e.target.checked) {
                            setFieldValue("preferredPackedTime", "");
                          }
                        }}
                        className="mr-2"
                      />
                      <span className={`text-sm ${ispreferredPackedTime ? "text-purple-700 font-semibold" : ""}`}>
                        Get packed Now (Within a min)
                      </span>
                    </label>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <Field
                      as="select"
                      name="paymentMethod"
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="cod">Cash on Delivery</option>
                    </Field>
                    <ErrorMessage name="paymentMethod" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                    <Field
                      as="textarea"
                      name="orderNotes"
                      className="w-full border px-3 py-2 rounded-lg"
                      placeholder="Any notes for your order..."
                      rows={2}
                    />
                    <ErrorMessage name="orderNotes" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Order Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Order Type</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <Field type="radio" name="orderType" value="ready" />
                        <span>Ready My Order</span>
                      </label>
                    </div>
                    <ErrorMessage name="orderType" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Error */}
                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={hasOutOfStockItems}
                    className={`mt-4 w-full py-3 rounded-lg font-semibold text-white text-lg transition ${hasOutOfStockItems
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                      }`}
                  >
                    Confirm Order
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </section>
  );
};

export default PlaceOrderWithType;
