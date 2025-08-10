import { useEffect, useState } from 'react';
import axios from 'axios';

const SellerShopView = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');

    const fetch = async () => {
      try {
        const resShop = await axios.get('http://localhost:5005/seller/my-shop', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShop(resShop.data);

        const resProducts = await axios.get('http://localhost:5005/orderss', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(resProducts.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-6">
      {shop && (
        <div className="mb-6 bg-white rounded shadow p-4">
          <h2 className="text-2xl font-bold">{shop.shopName}</h2>
          <p>Owner: {shop.ownerName}</p>
          <p>Status: {shop.open ? 'Open' : 'Closed'}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 shadow rounded">
            <img src={p.image} className="w-full h-40 object-cover rounded mb-2" alt={p.name} />
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p>{p.description}</p>
            <p className="text-green-600 font-bold">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerShopView;
