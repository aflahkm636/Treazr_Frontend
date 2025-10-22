import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../common/context/AuthProvider";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";
import Loading from "../../common/components/Loading";

import { GetUserAddresses, CreateAddress, UpdateAddress, DeleteAddress } from "../../services/AddressService";
import { CreateOrder, VerifyRazorpayPayment } from "../../services/AdminService/OrderService";
import { CheckoutOrder } from "../../services/RazorpayHelper";

function Order() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "razorpay"

    // Get order data from location state
    const { cartItems, total, fromBuyNow = false } = location.state || {};

    useEffect(() => {
        if (!user) {
            toast.error("Please login to place order");
            navigate("/login");
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            toast.error("No items to order");
            navigate("/");
            return;
        }

        fetchAddresses();
    }, [user, cartItems, navigate]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await GetUserAddresses();
            setAddresses(response.data || []);
            if (response.data && response.data.length > 0) {
                setSelectedAddress(response.data[0]);
            }
        } catch (error) {
            toast.error("Failed to load addresses");
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSelect = (address) => setSelectedAddress(address);

    const handleAddNewAddress = () => {
        setEditingAddress(null);
        setShowAddressForm(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await DeleteAddress(addressId);
            toast.success("Address deleted successfully");
            setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
            if (selectedAddress && selectedAddress.id === addressId) {
                setSelectedAddress(addresses.length > 1 ? addresses[0] : null);
            }
        } catch (error) {
            toast.error("Failed to delete address");
            console.error("Error deleting address:", error);
        }
    };

    const handleSaveAddress = async (addressData) => {
        try {
            if (editingAddress) {
                await UpdateAddress(editingAddress.id, addressData);
                toast.success("Address updated successfully");
                setAddresses((prev) =>
                    prev.map((addr) => (addr.id === editingAddress.id ? { ...addr, ...addressData } : addr))
                );
                if (selectedAddress && selectedAddress.id === editingAddress.id) {
                    setSelectedAddress({ ...selectedAddress, ...addressData });
                }
            } else {
                const response = await CreateAddress(addressData);
                toast.success("Address added successfully");
                const newAddress = response.data;
                setAddresses((prev) => [...prev, newAddress]);
                setSelectedAddress(newAddress);
            }

            setShowAddressForm(false);
            setEditingAddress(null);
        } catch (error) {
            toast.error(`Failed to ${editingAddress ? "update" : "save"} address`);
            console.error("Error saving address:", error);
        }
    };

    const handleCancelAddress = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        try {
            setProcessing(true);

            // CreateOrderDTO
            const orderData = {
                addressId: selectedAddress.id,
                newAddress: null,
                paymentMethod: paymentMethod === "cod" ? 0 : 1,
            };

            // BuyNowDTO only contains productId and quantity
            let productId = null;
            let quantity = null;

            if (fromBuyNow && cartItems?.length > 0) {
                productId = cartItems[0].productId || cartItems[0].id;
                quantity = cartItems[0].quantity;
            }
            console.log("Buy Now cartItems:", cartItems);
            console.log("productId:", productId, "quantity:", quantity);

            // Handle Razorpay separately
            if (paymentMethod === "razorpay") {
                await CheckoutOrder({
                    orderData,
                    buyNowData: productId && quantity ? { productId, quantity } : null,
                    isBuyNow: fromBuyNow,
                    onSuccess: () =>
                        navigate("/order-success", {
                            state: { total, paymentMethod: "Razorpay" },
                        }),
                });
                return;
            }

            // For COD
            const response = await CreateOrder(orderData, productId, quantity);

            if (response.statusCode === 200) {
                toast.success("Order placed successfully!");
                navigate("/order-success", {
                    state: {
                        orderId: response.data?.id || response.data?.orderId,
                        total,
                        paymentMethod: "Cash on Delivery",
                    },
                });
            } else {
                throw new Error(response.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error(error?.message || "Failed to place order");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Loading name="order" />;

    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="mt-2 text-gray-600">{fromBuyNow ? "Buy Now" : "Complete Your Order"}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Address Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                                {!showAddressForm && (
                                    <button
                                        onClick={handleAddNewAddress}
                                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        + Add New Address
                                    </button>
                                )}
                            </div>

                            {showAddressForm ? (
                                <AddressForm
                                    initialValues={editingAddress}
                                    onSubmit={handleSaveAddress}
                                    onCancel={handleCancelAddress}
                                    isEditing={!!editingAddress}
                                    loading={processing}
                                />
                            ) : (
                                <AddressList
                                    addresses={addresses}
                                    selectedAddress={selectedAddress}
                                    onAddressSelect={handleAddressSelect}
                                    onEditAddress={handleEditAddress}
                                    onDeleteAddress={handleDeleteAddress}
                                    onAddNewAddress={handleAddNewAddress}
                                />
                            )}
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                            <div className="space-y-4">
                                {["cod", "razorpay"].map((method) => (
                                    <div key={method} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={method}
                                            name="paymentMethod"
                                            value={method}
                                            checked={paymentMethod === method}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <label htmlFor={method} className="ml-3 block text-sm font-medium text-gray-700">
                                            {method === "cod" ? "Cash on Delivery" : "Pay with Razorpay"}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item, index) => (
                                    <div key={item.id || item.productId || index} className="flex items-center gap-3">
                                        {/* <img
                                            key={index}
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded border"
                                            onError={(e) => (e.target.src = "/default-product.jpg")}
                                        /> */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{parseFloat(total || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                                    <span>Total</span>
                                    <span>₹{parseFloat(total || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={processing || !selectedAddress || !paymentMethod}
                                className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    `Place Order - ₹${parseFloat(total || 0).toFixed(2)}`
                                )}
                            </button>

                            <button
                                onClick={() => navigate(fromBuyNow ? "/products" : "/cart")}
                                disabled={processing}
                                className="w-full mt-3 text-gray-600 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {fromBuyNow ? "Continue Shopping" : "Back to Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
