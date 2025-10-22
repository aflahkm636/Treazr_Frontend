import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiHeart, FiShoppingCart, FiZap } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { AddToCart } from "../../services/CartService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ToggleWishList } from "../../services/WishlistService";

const ProductListCard = React.memo(({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  const { wishlist, setWishlist } = useWishlist();
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  // ---------------- Derived state ----------------
  const isInWishlist = useMemo(
    () =>
      (wishlist || []).some(
        item => item?.productId === product.id || item?.product?.id === product.id
      ),
    [wishlist, product.id]
  );

  // Fixed cart item check - handle both API response structures
  const isInCart = useMemo(() => {
    const cartItems = cart?.items || [];
    return cartItems.some(item => {
      const itemProductId = item?.productId || item?.product?.id;
      return itemProductId === product.id;
    });
  }, [cart, product.id]);

  // Get cart item count for this product
  const cartItemCount = useMemo(() => {
    const cartItems = cart?.items || [];
    const cartItem = cartItems.find(item => {
      const itemProductId = item?.productId || item?.product?.id;
      return itemProductId === product.id;
    });
    return cartItem?.quantity || 0;
  }, [cart, product.id]);

  // ---------------- Toggle Wishlist ----------------
  const handleToggleWishlist = useCallback(
    async e => {
      e.stopPropagation();
      if (!user) return toast.warning("Please login to use wishlist");

      setIsLoadingWishlist(true);
      try {
        await ToggleWishList(product.id);

        const updatedWishlist = isInWishlist
          ? wishlist.filter(item => {
              const itemProductId = item?.productId || item?.product?.id;
              return itemProductId !== product.id;
            })
          : [...(wishlist || []), { productId: product.id }];

        setWishlist(updatedWishlist);
        toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update wishlist");
      } finally {
        setIsLoadingWishlist(false);
      }
    },
    [user, product.id, isInWishlist, setWishlist, wishlist]
  );

  // ---------------- Add to Cart / Go to Cart ----------------
  const handleAddToCart = useCallback(
    async e => {
      e?.stopPropagation();
      if (!user) return toast.warning("Please login to add to cart");

      // Already in cart → navigate to cart
      if (isInCart) return navigate("/cart");

      if (product.currentStock === 0) {
        return toast.warning("Product is out of stock");
      }

      setIsLoadingCart(true);

      // Optimistic update
      setCart(prev => ({
        ...prev,
        items: [
          ...(prev?.items || []),
          {
            productId: product.id,
            product: product,
            quantity: 1,
            price: product.price
          }
        ],
      }));

      try {
        const response = await AddToCart({ productId: product.id, quantity: 1 });
        
        // Update with actual API response
        setCart(prev => ({
          ...prev,
          items: response.data?.items || prev.items,
        }));

        toast.success("Added to cart");
      } catch (err) {
        console.error(err);
        toast.error("Failed to add to cart");

        // Rollback optimistic update
        setCart(prev => ({
          ...prev,
          items: (prev?.items || []).filter(item => {
            const itemProductId = item?.productId || item?.product?.id;
            return itemProductId !== product.id;
          }),
        }));
      } finally {
        setIsLoadingCart(false);
      }
    },
    [user, product, isInCart, setCart, navigate]
  );

  // ---------------- Buy Now ----------------
  const handleBuyNow = useCallback(
    e => {
      e?.stopPropagation();
      if (!user) return toast.warning("Please login to buy now");
      if (product.currentStock === 0) return toast.warning("Product is out of stock");

      navigate("/buy-now", {
        state: {
          product: {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.imageBase64?.[0] || "/default-product.jpg",
            stock: product.currentStock,
            brand: product.brand,
            category: product.category,
          },
        },
      });
    },
    [navigate, product, user]
  );

  // ---------------- Go to Product Details ----------------
  const handleClick = useCallback(() => {
    navigate(`/productdetails/${product.id}`);
  }, [navigate, product.id]);

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-200 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img
          src={product.imageBase64?.[0] || "/default-product.jpg"}
          alt={product.name}
          onError={e => (e.currentTarget.src = "/default-product.jpg")}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={isLoadingWishlist}
          className={`absolute top-2 right-2 z-10 p-2.5 rounded-full transition-all ${
            isInWishlist ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"
          } ${isLoadingWishlist ? "opacity-70 animate-pulse" : ""}`}
        >
          <FiHeart className={`text-lg ${isInWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              product.currentStock > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {product.currentStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Product Info */}
        <div className="flex-1 mb-3">
          <Tooltip title={product.name} arrow placement="top">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm leading-tight">
              {product.name}
            </h3>
          </Tooltip>

          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Add / Go to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.currentStock === 0 || isLoadingCart}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              product.currentStock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isInCart
                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:shadow-md border border-yellow-200"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-md"
            } ${isLoadingCart ? "opacity-70 animate-pulse" : ""}`}
          >
            <FiShoppingCart className="text-sm" />
            <span>
              {isLoadingCart ? "Adding..." : isInCart ? "Go to Cart" : "Add to Cart"}
            </span>
            {/* {isInCart && cartItemCount > 0 && (
              <span className="ml-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )} */}
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={product.currentStock === 0 || !user}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              product.currentStock === 0 || !user
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md"
            }`}
          >
            <FiZap className="text-sm" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductListCard;