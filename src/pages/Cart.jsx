import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../common/context/AuthProvider";
import Swal from "sweetalert2";
import Loading from "../common/components/Loading";
import { FiShoppingCart, FiTrash2, FiChevronLeft } from "react-icons/fi";
import { FaRegSadTear } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";

import {
  GetCart,
  UpdateCartitemQuantity,
  DeleteCartItem,
  ClearCart
} from "../services/CartService"; // adjust path

function Cart() {
  const { user, authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch cart items from backend
 useEffect(() => {
  const fetchCart = async () => {
    try {
      setUpdating(true);
      const res = await GetCart();
      const items = res.data.items.map((item) => ({
        ...item,
          image:
          item.imageBase64 && item.imageBase64.length > 0
            ? item.imageBase64[0] 
            : "/placeholder.png", 
      }));
      setCartItems(items);
    } catch (err) {
      toast.error(err?.message || "Failed to fetch cart");
    } finally {
      setUpdating(false);
    }
  };

  if (user) fetchCart();
}, [user]);


  // Update quantity of a cart item
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 5) return;
    try {
      setUpdating(true);
      await UpdateCartitemQuantity(cartItemId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      toast.error(err?.message || "Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  // Remove a single item
  const removeItem = async (cartItemId) => {
    try {
      setUpdating(true);
      await DeleteCartItem(cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      toast.error(err?.message || "Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  // Confirm and remove an item
  const handleRemove = (cartItemId) => {
    Swal.fire({
      title: "Remove this item?",
      text: "This will remove the item from your cart",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(cartItemId);
        Swal.fire("Removed!", "Item has been removed from your cart.", "success");
      }
    });
  };

  // Clear the entire cart
  const handleClearCart = async () => {
    try {
      const result = await Swal.fire({
        title: "Clear cart?",
        text: "This will remove all items from your cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, clear it",
      });

      if (result.isConfirmed) {
        await ClearCart();
        setCartItems([]);
        Swal.fire("Cleared!", "Your cart has been cleared.", "success");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to clear cart");
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warn("Your cart is empty");
      return;
    }
    navigate("/order", {
      state: {
        cartItems,
        total: calculateTotal(),
        fromBuyNow: false
      },
    });
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (authLoading || updating) return <Loading name="cart" />;
  if (!user)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FiShoppingCart className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Your shopping cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to view and manage your cart
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FaRegSadTear className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Your shopping cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items yet
          </p>
          <button
            onClick={handleContinueShopping}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto gap-2"
          >
            <HiOutlineShoppingBag />
            Continue Shopping
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FiShoppingCart className="text-blue-600" />
                Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
              </h2>
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {typeof item.price === "number" && (
                        <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-center w-12">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating || item.quantity >= 5}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <div className="w-24 text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={updating}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
                </span>
                <span className="font-medium">${calculateTotal()}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={updating || cartItems.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full mt-2 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiChevronLeft />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
