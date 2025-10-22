import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiShoppingCart, FiArrowLeft, FiHeart, FiChevronDown, FiZap } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import useAddToCart from "./AddToCart";
import { GetProductById } from "../../services/Getproducts";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const { handleAddToCart } = useAddToCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await GetProductById(id);
        const data = res.data;
        setProduct(data);
      } catch (error) {
        toast.error("Failed to load product details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-amber-500"></div>
      </div>
    );
  }

  const images = product?.imageBase64?.length > 0 
    ? product.imageBase64 
    : ["/default-product.jpg"];
  const mainImage = images[selectedImage];
  const isAvailable = product.inStock && product.currentStock > 0;

  // Check if description has more than 2 lines
  const descriptionLines = product.description ? product.description.split('\n') : [];
  const shouldTruncate = descriptionLines.length > 2;
  const displayedDescription = showFullDescription 
    ? product.description 
    : descriptionLines.slice(0, 2).join('\n');

  const handleBuyNow = () => {
    if (!product) return;
    navigate("/buy-now", {
      state: {
        product: {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: mainImage,
          stock: product.currentStock,
          brand: product.brand,
          category: product.categoryName,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-8">
      <div className="w-full max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-700 transition-all duration-300 mb-6 group"
        >
          <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          {/* <span className="text-sm font-medium">Back to Products</span> */}
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image Section */}
          <div className="space-y-6">
            {/* Main Image - Increased size, reduced padding */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-1">
              <div className="flex items-center justify-center" style={{ minHeight: '360px', maxHeight: '420px' }}>
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain max-h-96 transition-transform duration-300"
                  onError={(e) => (e.target.src = "/default-product.jpg")}
                  loading="lazy"
                />
                {!isAvailable && (
                  <div className="absolute bg-black/30 flex items-center justify-center rounded-xl backdrop-blur-sm" style={{ width: 'calc(100% - 8px)', height: 'calc(100% - 8px)' }}>
                    <span className="text-white font-medium bg-black/60 px-3 py-2 rounded-lg text-xs">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images - Increased size */}
            {images.length > 1 && (
              <div className="flex justify-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                      selectedImage === idx
                        ? "border-amber-500 ring-2 ring-amber-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/default-product.jpg")}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons - Moved down with increased spacing */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => handleAddToCart({ ...product, image: mainImage })}
                disabled={!isAvailable}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isAvailable
                    ? "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <FiShoppingCart className="text-base" />
                Add to Cart
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!isAvailable}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isAvailable
                    ? "bg-slate-800 text-white hover:bg-slate-900 active:scale-95"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <FiZap className="text-base" />
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                {product.categoryName}
              </p>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-base text-slate-600">{product.brand}</p>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {isAvailable ? `In Stock (${product.currentStock})` : "Out of Stock"}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-200"></div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Description</h3>
              <div className="space-y-2">
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line line-clamp-2">
                  {displayedDescription}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
                  >
                    {showFullDescription ? "Show Less" : "Show Full Description"}
                    <FiChevronDown className={`text-xs transition-transform duration-200 ${showFullDescription ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Minimal Product Details - Compact version */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-slate-500 text-xs">Category</p>
                <p className="font-medium text-slate-900">{product.categoryName}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-slate-500 text-xs">Brand</p>
                <p className="font-medium text-slate-900">{product.brand}</p>
              </div>
            </div>

            {/* Compact Features */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Benefits</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;