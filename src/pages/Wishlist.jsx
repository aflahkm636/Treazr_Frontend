import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CiHeart, CiTrash } from "react-icons/ci";
import Loading from "../common/components/Loading";
import { useAuth } from "../common/context/AuthProvider";
import { GetWishList, ToggleWishList } from "../services/WishlistService";
import { AddToCart } from "../services/CartService"; 
import { useWishlist } from "../common/context/WishlistContext";

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist, setWishlist } = useWishlist();     
  const [loading, setLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const navigate = useNavigate();

  const fetchWishlistProducts = async () => {
    if (!user) {
      setWishlistProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await GetWishList();
      setWishlist(data.data || []);
      setWishlistProducts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      toast.error("Failed to load wishlist items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistProducts();
  }, [user]);

  const handleRemoveFromWishlist = async (productId) => {
    if (!user) {
      toast.warning("Please login to manage wishlist");
      return;
    }

    try {
      setLoading(true);
      await ToggleWishList(productId); 
      const updatedWishlist = wishlistProducts.filter(p => p.productId !== productId);
      setWishlist(updatedWishlist);
      setWishlistProducts(updatedWishlist);
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
      toast.error("Failed to remove from wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await AddToCart({ productId });
    //   await handleRemoveFromWishlist(productId)
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <p className="text-gray-700 mb-4">Please login to view your wishlist</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <Loading name="Wishlist" />;

  if (!wishlistProducts || wishlistProducts.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
          <CiHeart className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="text-xl font-medium text-gray-800 mt-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mt-2">Save items you love to your wishlist</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-600 mt-1 text-sm">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {wishlistProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <img
                  src={product.imageBase64?.[0] || "/default-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => navigate(`/productdetails/${product.productId}`)}
                  onError={(e) => (e.target.src = "/default-product.jpg")}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(product.productId);
                  }}
                  disabled={loading}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow hover:bg-red-100 hover:text-red-600 transition-colors backdrop-blur-sm"
                >
                  <CiTrash className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <h3
                    className="text-sm font-medium text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 line-clamp-2"
                    onClick={() => navigate(`/products/${product.productId}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-xs">{product.category}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.productId);
                    }}
                    disabled={loading || product.stock <= 0}
                    className="w-full mt-2 py-1.5 px-3 text-xs border border-transparent rounded-md shadow-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
