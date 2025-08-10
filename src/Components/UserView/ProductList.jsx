import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch all published products from backend
  useEffect(() => {
    const fetch = async () => {
const res = await axios.get(`http://localhost:5005/api/shop-products/${shopId}`);
      setProducts(res.data);
    };
    fetch();
  }, []);

  // Handle placing order
  const handleOrder = async (product) => {
    const buyerName = prompt('📝 Enter your name to place the order:');
    if (!buyerName) return;

    try {
      const amount = Number(product.price);
      await axios.post('http://localhost:5005/orders', {
        productId: product._id,
        sellerId: product.sellerId,
        buyerName,
        amount,
      });

      alert('✅ Order placed successfully!');
    } catch (err) {
      console.error('❌ Error placing order:', err);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">🛍️ All Available Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                <p className="text-lg font-semibold text-green-600">₹{p.price}</p>
                <button
                  onClick={() => handleOrder(p)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
