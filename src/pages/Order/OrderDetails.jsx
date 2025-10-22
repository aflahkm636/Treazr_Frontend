// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { useAuth } from "../../common/context/AuthProvider";
// import Loading from "../../common/components/Loading";

// const OrderDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { cartItems: initialCartItems, total: initialTotal, fromBuyNow } = location.state || {};
//   const [cartItems, setCartItems] = useState(initialCartItems || []);
//   const [total, setTotal] = useState(initialTotal || 0);
//   const [loading, setLoading] = useState(false);
//   const [hasValidData, setHasValidData] = useState(false);

//   useEffect(() => {
//     // Check if we have valid cart items
//     if (initialCartItems && initialCartItems.length > 0) {
//       setCartItems(initialCartItems);
//       setHasValidData(true);
//     } else if (user?.cart && user.cart.length > 0) {
//       setCartItems(user.cart);
//       calculateTotal(user.cart);
//       setHasValidData(true);
//     } else {
//       setHasValidData(false);
//     }
//   }, [user, initialCartItems]);

//   const calculateTotal = (items) => {
//     const calculatedTotal = items.reduce((acc, item) => {
//       const price = item.price || 0;
//       const quantity = item.quantity || 1;
//       return acc + (price * quantity);
//     }, 0);
//     setTotal(calculatedTotal.toFixed(2));
//   };

//   if (loading) {
//     return <Loading name="order details" />;
//   }

//   // Show empty state if no valid data
//   if (!hasValidData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
//           <h1 className="text-2xl font-serif font-bold text-gray-800 mb-4">Order Details</h1>
//           <p className="text-gray-600 mb-6">
//             {fromBuyNow ? "No product information found." : "Your cart is empty."}
//           </p>
//           <button 
//             onClick={() => navigate(fromBuyNow ? "/" : "/cart")}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             {fromBuyNow ? "Continue Shopping" : "Return to Cart"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

//   const handleProceedToCheckout = async () => {
//     setLoading(true);
    
//     try {
//       // Check stock for each item
//       const outOfStockItems = cartItems.filter(item => {
//         const quantity = item.quantity || 1;
//         const stock = item.stock || 0;
//         return quantity > stock;
//       });

//       if (outOfStockItems.length > 0) {
//         Swal.fire({
//           title: "Stock Issue",
//           html: `Some items exceed available stock:<br><br>
//                  ${outOfStockItems.map(item => 
//                    `• ${item.name} (Available: ${item.stock || 0})`
//                  ).join('<br>')}`,
//           icon: "error",
//           confirmButtonColor: "#6366f1",
//           confirmButtonText: "OK"
//         });
//         setLoading(false);
//         return;
//       }

//       // Navigate to checkout with appropriate state
//       navigate("/checkout", { 
//         state: { 
//           cartItems,
//           orderTotal: total,
//           itemCount: totalItems,
//           fromBuyNow: fromBuyNow || false
//         } 
//       });
//     } catch (error) {
//       console.error("Error proceeding to checkout:", error);
//       Swal.fire("Error", "Failed to proceed to checkout", "error");
//       setLoading(false);
//     }
//   };

//   const getStockStatus = (item) => {
//     const stock = item.stock || 0;
//     const quantity = item.quantity || 1;
    
//     if (quantity > stock) {
//       return <span className="text-red-600 font-medium">Out of Stock</span>;
//     } else if (stock < 10) {
//       return <span className="text-orange-600">Only {stock} left</span>;
//     } else {
//       return <span className="text-green-600">In Stock</span>;
//     }
//   };

//   const hasOutOfStockItems = cartItems.some(item => {
//     const quantity = item.quantity || 1;
//     const stock = item.stock || 0;
//     return quantity > stock;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-3xl font-serif font-bold text-gray-900">
//             {fromBuyNow ? "Product Summary" : "Order Summary"}
//           </h1>
//           <p className="mt-2 text-gray-600">
//             {fromBuyNow ? "Review your product before checkout" : "Review your items before checkout"}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Products List */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//               <h2 className="text-xl font-serif font-semibold mb-6 text-gray-800">
//                 {fromBuyNow ? "Your Product" : "Your Products"} 
//                 <span className="text-gray-500"> ({totalItems})</span>
//               </h2>
              
//               <div className="divide-y divide-gray-100">
//                 {cartItems.map((item, index) => {
//                   const itemKey = item.productId || item.id || `item-${index}`;
//                   const price = item.price || 0;
//                   const quantity = item.quantity || 1;
//                   const image = item.image || item.images?.[0];
//                   const name = item.name || "Unknown Product";
                  
//                   return (
//                     <div key={itemKey} className="py-6 flex items-start">
//                       <img
//                         src={image}
//                         alt={name}
//                         className="w-20 h-20 object-cover rounded-lg mr-6"
//                         onError={(e) => {
//                           e.target.src = "/default-product.jpg";
//                         }}
//                       />
                      
//                       <div className="flex-1">
//                         <h3 className="font-medium text-gray-900">{name}</h3>
//                         <p className="text-gray-600 mt-1">${price.toFixed(2)}</p>
//                         <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                        
//                         <div className="mt-2">
//                           {getStockStatus(item)}
//                         </div>
//                       </div>
                      
//                       <div className="w-24 text-right">
//                         <p className="font-medium text-lg">
//                           ${(price * quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Additional Information */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <h3 className="font-semibold text-gray-800 mb-4">Next Steps</h3>
//               <div className="space-y-3 text-sm text-gray-600">
//                 <p>• You'll enter shipping information in the next step</p>
//                 <p>• Choose your preferred payment method</p>
//                 <p>• Review and place your order</p>
//                 {fromBuyNow && (
//                   <p className="text-indigo-600 font-medium">
//                     • This is a direct purchase - item will be reserved for you
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-8">
//               <h2 className="text-xl font-serif font-semibold mb-6 text-gray-800">
//                 Order Total
//               </h2>
              
//               <div className="space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">
//                     {fromBuyNow ? "Product Total" : `Subtotal (${totalItems} items)`}
//                   </span>
//                   <span className="font-medium">${total}</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="text-gray-600">Calculated at checkout</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tax</span>
//                   <span className="text-gray-600">Calculated at checkout</span>
//                 </div>
                
//                 <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
//                   <span>Estimated Total</span>
//                   <span>${total}</span>
//                 </div>
                
//                 <button
//                   onClick={handleProceedToCheckout}
//                   disabled={hasOutOfStockItems || loading}
//                   className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     "Proceed to Checkout"
//                   )}
//                 </button>

//                 <button
//                   onClick={() => navigate(fromBuyNow ? "/" : "/cart")}
//                   className="w-full mt-3 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
//                 >
//                   {fromBuyNow ? "Continue Shopping" : "Back to Cart"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;