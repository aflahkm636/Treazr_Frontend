import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import Loading from "../components/Loading";
import api from "../../services/Api";

const BuyNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // If product data is passed via location state
        if (location.state?.product) {
          setProduct(location.state.product);
          setLoading(false);
          return;
        }

        if (location.state?.productId) {
          const response = await api.get(`/products/${location.state.productId}`);
          setProduct(response.data);
        } else {
          toast.error("No product information found");
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed to load product details");
        console.error("Error fetching product:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [location.state, navigate]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product?.stock && newQuantity > product.stock) return;
    if (newQuantity > 10) return; // Max quantity limit
    setQuantity(newQuantity);
  };

  const proceedToOrderDetails = () => {
    if (!user) {
      toast.error("Please login to proceed with your purchase");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!product) {
      toast.error("Product information is missing");
      return;
    }

    // Check stock
    if (product.stock && quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    navigate("/order", {
      state: {
        cartItems: [{
          // ...product,
      productId: product.id || product._id || product.productId, // choose correct field
          quantity: quantity,
          price: product.price,
           name: product.name,
        imageUrl: product.images?.[0] || "/default-product.jpg" 
        }],
        total: (product.price * quantity).toFixed(2),
 fromBuyNow: true       }
    });
  };

  if (loading) {
    return <Loading name="product" />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">Product not found</h2>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buy Now</h1>
          <p className="mt-2 text-gray-600">Review your item before checkout</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex justify-center">
                <img
                  src={product.image || product.images?.[0] || "/default-product.jpg"}
                  alt={product.name}
                  className="w-full h-64 object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = "/default-product.jpg";
                  }}
                />
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.brand}</p>
                <p className="text-gray-600">{product.category}</p>
                
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center">
                  <span className="mr-4 text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-50 min-w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={product.stock ? quantity >= product.stock : quantity >= 10}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4 text-sm text-gray-500">
                    {product.stock ? `${product.stock} available` : 'In stock'}
                  </span>
                </div>

                {product.stock && quantity > product.stock && (
                  <p className="mt-2 text-sm text-red-600">
                    Only {product.stock} items available
                  </p>
                )}

                <div className="mt-8 space-y-4">
                  <button
                    onClick={proceedToOrderDetails}
                    disabled={product.stock && quantity > product.stock}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={() => navigate("/")}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;