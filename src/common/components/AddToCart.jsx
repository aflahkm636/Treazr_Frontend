// components/AddToCart.jsx
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";
import { AddToCart } from "../../services/CartService"; // Use your CartService

const useAddToCart = () => {
  const { user, setUser } = useAuth();

  const handleAddToCart = useCallback(
    async (product, options = {}) => {
      const { showToast = true, onSuccess } = options;

      try {
        if (!user) {
          toast.error("Please login to add items to cart");
          return false;
        }

        // Prepare data to send to backend
        const cartItem = {
          productId: product.id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || "/default-product.jpg",
        };

        // Call backend to add item
        const updatedCart = await AddToCart(cartItem);

        // Update local user state
        const updatedUser = { ...user, cart: updatedCart };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        if (showToast) {
          toast.success(`${product.name} added to cart!`);
        }

        if (onSuccess) {
          onSuccess();
        }

        return true;
      } catch (error) {
        toast.error("Failed to add to cart");
        console.error("Add to cart error:", error);
        return false;
      }
    },
    [user, setUser]
  );

  return { handleAddToCart };
};

export default useAddToCart;
