import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { GetWishList } from "../../services/WishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        setLoadingWishlist(false);
        return;
      }

      try {
        const response = await GetWishList();
        setWishlist(response.data || []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, setWishlist, loadingWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
