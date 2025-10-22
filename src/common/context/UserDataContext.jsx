import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { GetCart } from "../../services/CartService";
import { GetWishList } from "../../services/WishlistService";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Fetch on login
  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      return;
    }

    (async () => {
      try {
        const [cartData, wishlistData] = await Promise.all([
          GetCart(),
          GetWishList(),
        ]);
        setCart(cartData.data || []);
        setWishlist(wishlistData.data|| []);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    })();
  }, [user]);

  return (
    <UserDataContext.Provider value={{ cart, setCart, wishlist, setWishlist }}>
      {children}
    </UserDataContext.Provider>
  );
};

// Custom hook
export const useUserData = () => useContext(UserDataContext);
