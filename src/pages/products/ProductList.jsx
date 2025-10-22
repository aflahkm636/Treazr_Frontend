import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../services/Api";
import ProductCard from "../../common/components/cards";
import Loading from "../../common/components/Loading";
import { useSearch } from "./Products"; 
import { useAuth } from "../../common/context/AuthProvider";
import { useCart } from "../../common/context/CartContext";
import { useWishlist } from "../../common/context/WishlistContext";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { searchQuery } = useSearch();
  const { user } = useAuth();
  const { cart, setCart } = useCart();          
  const { wishlist, setWishlist } = useWishlist(); 

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/Product/filter`, {
        params: { filter: searchQuery || "" },
      });
      setProducts(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  if (loading) return <Loading name="All products" />;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery
            ? "No matching products found"
            : "No products available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              // wishlist={wishlist}
              // setWishlist={setWishlist}
              // cart={cart}
              // setCart={setCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
