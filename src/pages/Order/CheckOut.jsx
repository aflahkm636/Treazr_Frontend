// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { useAuth } from "../../common/context/AuthProvider";
// import { FaHome } from "react-icons/fa";
// import PaymentMethods from "../../common/components/Payment";
// import Loading from "../../common/components/Loading";
// import { GetUserAddresses, CreateAddress, UpdateAddress, DeleteAddress } from "../../services/AddressService";
// import AddressForm from "./AddressForm";
// import AddressList from "./AddressList";
// import { CreateOrderBuyNow, CreateOrderFromCart } from "../../services/AdminService/OrderService";

// const Checkout = () => {
//   const location = useLocation();
//   const { user } = useAuth();
//   const userId = user?.id;
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(true);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [addressMode, setAddressMode] = useState("existing");
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [shippingFee, setShippingFee] = useState(0);
//   const [isBuyNow, setIsBuyNow] = useState(false);
//   const [buyNowProduct, setBuyNowProduct] = useState(null);
//   const [cartItems, setCartItems] = useState([]);
//   const [processingOrder, setProcessingOrder] = useState(false);
//   const [savingAddress, setSavingAddress] = useState(false);
//   const [hasValidData, setHasValidData] = useState(false);
//   const [newAddressData, setNewAddressData] = useState(null);
//   const [addressError, setAddressError] = useState(null);

//   useEffect(() => {
//     if (location.state?.fromBuyNow) {
//       setIsBuyNow(true);
//       setBuyNowProduct(location.state.cartItems?.[0]);
//       setHasValidData(true);
//     } else if (location.state?.cartItems) {
//       setCartItems(location.state.cartItems || []);
//       setHasValidData(true);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }
    
//     const fetchData = async () => {
//       try {
//         console.log("Fetching addresses for user:", userId);
        
//         // Fetch addresses
//         try {
//           const addressesResponse = await GetUserAddresses();
//           console.log("Addresses response:", addressesResponse);
          
//           // Handle different response structures
//           let userAddresses = [];
//           if (Array.isArray(addressesResponse)) {
//             userAddresses = addressesResponse;
//           } else if (addressesResponse?.data) {
//             userAddresses = Array.isArray(addressesResponse.data) ? addressesResponse.data : [];
//           } else if (addressesResponse?.data?.data) {
//             userAddresses = Array.isArray(addressesResponse.data.data) ? addressesResponse.data.data : [];
//           }
          
//           console.log("Processed addresses:", userAddresses);
          
//           setAddresses(userAddresses);
//           setAddressError(null);
          
//           if (userAddresses.length > 0) {
//             setSelectedAddress(userAddresses[0]);
//           } else {
//             console.log("No addresses found, showing empty state");
//           }
//         } catch (addressError) {
//           console.error("Error fetching addresses:", addressError);
//           setAddressError("Failed to load addresses. You can add a new address below.");
//           setAddresses([]);
//         }
        
//         setLoading(false);
//         setHasValidData(true);
//       } catch (error) {
//         console.error("Error fetching checkout data:", error);
//         Swal.fire("Error", "Failed to load checkout data", "error");
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, [userId]);

//   useEffect(() => {
//     setShippingFee(paymentMethod === "cod" ? 5 : 0);
//   }, [paymentMethod]);

//   const handleSaveAddress = async (addressData) => {
//     setSavingAddress(true);
//     try {
//       let savedAddress;
      
//       if (addressMode === "edit" && editingAddress) {
//         savedAddress = await UpdateAddress(editingAddress.id, addressData);
//         setAddresses(prev => prev.map(addr => 
//           addr.id === editingAddress.id ? savedAddress : addr
//         ));
//       } else {
//         savedAddress = await CreateAddress(addressData);
//         setAddresses(prev => [...prev, savedAddress]);
//       }
      
//       setSelectedAddress(savedAddress);
//       setAddressMode("existing");
//       setEditingAddress(null);
      
//       Swal.fire("Success", `Address ${addressMode === "edit" ? 'updated' : 'saved'} successfully`, "success");
//     } catch (error) {
//       console.error("Error saving address:", error);
//       Swal.fire("Error", `Failed to ${addressMode === "edit" ? 'update' : 'save'} address`, "error");
//     } finally {
//       setSavingAddress(false);
//     }
//   };

//   const handleEditAddress = (address) => {
//     setEditingAddress(address);
//     setAddressMode("edit");
//   };

//   const handleDeleteAddress = async (addressId) => {
//     if (addresses.length <= 1) {
//       Swal.fire("Error", "You must have at least one address", "error");
//       return;
//     }

//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         await DeleteAddress(addressId);
//         setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        
//         if (selectedAddress?.id === addressId) {
//           const newSelected = addresses.find(addr => addr.id !== addressId);
//           setSelectedAddress(newSelected || null);
//         }
        
//         Swal.fire("Deleted!", "Address has been deleted.", "success");
//       } catch (error) {
//         console.error("Error deleting address:", error);
//         Swal.fire("Error", "Failed to delete address", "error");
//       }
//     }
//   };

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//   };

//   const handleNewAddress = () => {
//     setAddressMode("new");
//     setEditingAddress(null);
//   };

//   const cancelAddressEdit = () => {
//     setAddressMode("existing");
//     setEditingAddress(null);
//   };

//   const calculateSubtotal = () => {
//     if (isBuyNow && buyNowProduct) {
//       const price = buyNowProduct.price || 0;
//       const quantity = buyNowProduct.quantity || 1;
//       return price * quantity;
//     }
    
//     return cartItems.reduce((total, item) => {
//       const price = item.price || 0;
//       const quantity = item.quantity || 1;
//       return total + (price * quantity);
//     }, 0);
//   };

//   const calculateTotal = () => (calculateSubtotal() + shippingFee).toFixed(2);

//   // Convert frontend payment method to backend enum
//   const getBackendPaymentMethod = (paymentMethod) => {
//     return paymentMethod === "cod" ? "CashOnDelivery" : "Razorpay";
//   };

//   const handlePlaceOrder = async () => {
//     setProcessingOrder(true);
//     try {
//       // Validate address selection
//       if (!selectedAddress && !newAddressData) {
//         Swal.fire("Error", "Please select or add a shipping address", "error");
//         setProcessingOrder(false);
//         return;
//       }

//       // Prepare order data according to your backend DTOs
//       const orderData = {
//         paymentMethod: getBackendPaymentMethod(paymentMethod)
//       };

//       // Add address information based on mode
//       if (selectedAddress && addressMode === "existing") {
//         orderData.addressId = parseInt(selectedAddress.id);
//       } else if (newAddressData) {
//         orderData.newAddress = {
//           street: newAddressData.street,
//           city: newAddressData.city,
//           state: newAddressData.state,
//           zip: newAddressData.zip,
//           country: newAddressData.country || "India"
//         };
//       }

//       console.log("Order data:", orderData);

//       let result;
      
//       // Use the appropriate order creation method based on flow
//       if (isBuyNow && buyNowProduct) {
//         const buyNowData = {
//           productId: parseInt(buyNowProduct.productId || buyNowProduct.id),
//           quantity: parseInt(buyNowProduct.quantity || 1)
//         };
        
//         console.log("BuyNow data:", buyNowData);
        
//         // For buy now, use CreateOrderBuyNow with combined data
//         const combinedData = {
//           ...orderData,
//           ...buyNowData
//         };
        
//         result = await CreateOrderBuyNow(combinedData);
//       } else {
//         // For cart, use CreateOrderFromCart
//         result = await CreateOrderFromCart(orderData);
//       }

//       console.log("Order creation result:", result);

//       // Handle successful order creation
//       if (result) {
//         Swal.fire({
//           title: paymentMethod === "cod" ? "Order Placed!" : "Order Created!",
//           text: "Your order has been created successfully",
//           icon: "success",
//           confirmButtonText: "View Orders",
//         }).then(() => navigate("/orders"));
//       }
      
//     } catch (error) {
//       console.error("Error placing order:", error);
//       const errorMessage = error.response?.data?.message || error.message || "Failed to place order";
//       Swal.fire("Error", errorMessage, "error");
//     } finally {
//       setProcessingOrder(false);
//     }
//   };

//   // Handle saving new address data without immediately creating it in the database
//   const handleSaveNewAddressData = (addressData) => {
//     setNewAddressData(addressData);
//     setAddressMode("existing");
//     Swal.fire("Success", "Address will be saved with your order", "success");
//   };

//   if (loading) {
//     return <Loading name="checkout" />;
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-red-500 text-xl">Please login to proceed with checkout</div>
//       </div>
//     );
//   }

//   if (!hasValidData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-red-500 text-xl">No valid order data found. Please start over.</div>
//       </div>
//     );
//   }

//   const isOrderButtonDisabled = () => {
//     if (processingOrder) return true;
//     if (isBuyNow && !buyNowProduct) return true;
//     if (!isBuyNow && cartItems.length === 0) return true;
//     if (!selectedAddress && !newAddressData) return true;
//     return false;
//   };

//   const renderOrderItems = () => {
//     if (isBuyNow && buyNowProduct) {
//       const price = buyNowProduct.price || 0;
//       const quantity = buyNowProduct.quantity || 1;
//       const image = buyNowProduct.image || buyNowProduct.images?.[0];
//       const name = buyNowProduct.name || "Product";
      
//       return (
//         <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-2">
//           <div className="py-4 flex items-center">
//             <img
//               src={image}
//               alt={name}
//               className="w-16 h-16 object-cover rounded-lg mr-4"
//               onError={(e) => {
//                 e.target.src = "/default-product.jpg";
//               }}
//             />
//             <div className="flex-1 min-w-0">
//               <p className="font-medium truncate">{name}</p>
//               <p className="text-sm text-gray-600">
//                 ${price.toFixed(2)} × {quantity}
//               </p>
//             </div>
//             <p className="font-medium whitespace-nowrap ml-2">
//               ${(price * quantity).toFixed(2)}
//             </p>
//           </div>
//         </div>
//       );
//     } else if (cartItems.length === 0) {
//       return <p className="text-gray-500 text-center py-8">Your cart is empty.</p>;
//     } else {
//       return (
//         <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-2">
//           {cartItems.map((item, index) => {
//             const price = item.price || 0;
//             const quantity = item.quantity || 1;
//             const image = item.image || item.images?.[0];
//             const name = item.name || "Product";
            
//             return (
//               <div key={`${item.productId || item.id}-${index}`} className="py-4 flex items-center">
//                 <img
//                   src={image}
//                   alt={name}
//                   className="w-16 h-16 object-cover rounded-lg mr-4"
//                   onError={(e) => {
//                     e.target.src = "/default-product.jpg";
//                   }}
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium truncate">{name}</p>
//                   <p className="text-sm text-gray-600">
//                     ${price.toFixed(2)} × {quantity}
//                   </p>
//                 </div>
//                 <p className="font-medium whitespace-nowrap ml-2">
//                   ${(price * quantity).toFixed(2)}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-3xl font-serif font-bold text-gray-900">Complete Your Purchase</h1>
//           <p className="mt-2 text-gray-600">Review your order details before payment</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
//             {/* Address Section */}
//             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <FaHome className="text-indigo-600 mr-3 text-xl" />
//                 <h2 className="text-xl font-serif font-semibold text-gray-800">
//                   Shipping Information
//                 </h2>
//               </div>

//               {addressError && (
//                 <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-700">{addressError}</p>
//                   <p className="text-sm text-red-600 mt-1">
//                     You can still proceed by adding a new address below.
//                   </p>
//                 </div>
//               )}

//               {addressMode === "existing" ? (
//                 <AddressList
//                   addresses={addresses}
//                   selectedAddress={selectedAddress}
//                   onAddressSelect={handleAddressSelect}
//                   onEditAddress={handleEditAddress}
//                   onDeleteAddress={handleDeleteAddress}
//                   onAddNewAddress={handleNewAddress}
//                 />
//               ) : (
//                 <AddressForm
//                   initialValues={editingAddress}
//                   onSubmit={addressMode === "edit" ? handleSaveAddress : handleSaveNewAddressData}
//                   onCancel={cancelAddressEdit}
//                   isEditing={addressMode === "edit"}
//                   loading={savingAddress}
//                 />
//               )}

//               {/* Show selected new address preview */}
//               {newAddressData && (
//                 <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//                   <p className="text-green-800 font-medium mb-2">New Address (Will be saved with order):</p>
//                   <p className="text-green-700">
//                     {newAddressData.street}, {newAddressData.city}, {newAddressData.state} {newAddressData.zip}, {newAddressData.country}
//                   </p>
//                   <button
//                     onClick={() => {
//                       setNewAddressData(null);
//                       handleNewAddress();
//                     }}
//                     className="mt-2 text-sm text-green-600 hover:text-green-800"
//                   >
//                     Change address
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Payment Methods - Only COD and Razorpay */}
//             <PaymentMethods
//               paymentMethod={paymentMethod}
//               setPaymentMethod={setPaymentMethod}
//             />
//           </div>

//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
//               <h2 className="text-xl font-serif font-semibold mb-6 text-gray-800">
//                 Order Summary
//               </h2>

//               {renderOrderItems()}

//               <div className="border-t border-gray-200 pt-4 space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span>${calculateSubtotal().toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span>${shippingFee.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-lg pt-2">
//                   <span>Total</span>
//                   <span>${calculateTotal()}</span>
//                 </div>
                
//                 {!selectedAddress && !newAddressData && (
//                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
//                     <p className="text-yellow-800 text-sm text-center">
//                       Please select or add a shipping address
//                     </p>
//                   </div>
//                 )}
                
//                 <button
//                   onClick={handlePlaceOrder}
//                   disabled={isOrderButtonDisabled()}
//                   className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {processingOrder ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;