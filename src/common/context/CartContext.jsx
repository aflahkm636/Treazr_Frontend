import React, { createContext, useContext, useEffect, useState } from "react";
import { GetCart } from "../../services/CartService";
import { useAuth } from "./AuthProvider";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] }); 
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart({ items: [] });
        setLoadingCart(false);
        return;
      }

      try {
        const response = await GetCart();
        // Ensure cart has proper structure with items array
        setCart({
          items: response.data?.items || [],
          ...response.data
        });
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart({ items: [] });
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, setCart, loadingCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};