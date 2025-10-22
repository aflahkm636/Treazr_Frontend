import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/context/AuthProvider";
import {
    FaUser,
    FaHeart,
    FaBoxOpen,
    FaChevronRight,
    FaCalendarAlt,
    FaEnvelope,
    FaShoppingBag,
    FaTimes,
} from "react-icons/fa";
import { GetUser } from "../../services/AdminService/UserService";
import { CancelOrder, GetUserOrders, GetOrderById } from "../../services/AdminService/OrderService";

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await GetUser();
                setUser(userData.data);

                const userOrders = await GetUserOrders();
                setOrders(userOrders || []);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setUser]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await CancelOrder(orderId);
            setOrders((prev) => prev.filter((order) => order.id !== orderId));
            // Also close modal if this order was being viewed
            if (selectedOrder === orderId) {
                setShowOrderModal(false);
                setSelectedOrder(null);
                setOrderDetails(null);
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            alert("Failed to cancel order. Please try again.");
        }
    };

    const handleViewOrderDetails = async (orderId) => {
        try {
            setSelectedOrder(orderId);
            const details = await GetOrderById(orderId);
            setOrderDetails(details);
            setShowOrderModal(true);
        } catch (error) {
            console.error("Error fetching order details:", error);
            alert("Failed to load order details.");
        }
    };

    const canCancelOrder = (order) => {
        const nonCancellableStatuses = ["Shipped", "Delivered", "Completed", "Cancelled"];
        return !nonCancellableStatuses.includes(order.orderStatus);
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );

    if (!user)
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Please login to view your profile</h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 mt-10">
            {/* Order Details Modal */}
            {showOrderModal && orderDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Order #{orderDetails.id} Details
                            </h3>
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Order Status */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Order Status</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            orderDetails.orderStatus === "Delivered" || orderDetails.orderStatus === "Completed"
                                                ? "bg-green-100 text-green-800"
                                                : orderDetails.orderStatus === "Shipped"
                                                ? "bg-blue-100 text-blue-800"
                                                : orderDetails.orderStatus === "Cancelled"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {orderDetails.orderStatus}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            ${Number(orderDetails.totalAmount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
                                <div className="space-y-4">
                                    {orderDetails.items && orderDetails.items.length > 0 ? (
                                        orderDetails.items.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    {item.images ? (
                                                        <img 
                                                            src={item.images?.[0]} 
                                                            alt={item.productName}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <FaBoxOpen className="text-gray-400 text-xl" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                    <p className="text-sm text-gray-500">Price: ${Number(item.price).toFixed(2)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        ${Number(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No items found in this order.</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Order Date</p>
                                    <p className="font-medium">
                                        {new Date(orderDetails.createdOn).toLocaleDateString()}
                                    </p>
                                </div>
                                {orderDetails.updatedOn && (
                                    <div>
                                        <p className="text-gray-500">Last Updated</p>
                                        <p className="font-medium">
                                            {new Date(orderDetails.updatedOn).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            {canCancelOrder(orderDetails) && (
                                <button
                                    onClick={() => handleCancelOrder(orderDetails.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                                <FaUser className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-indigo-100">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - User Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Personal Info Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaUser className="text-indigo-600 mr-2" />
                            Personal Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <FaEnvelope className="text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaCalendarAlt className="text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-medium">
                                        {new Date(user.createdOn).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/wishlist")}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <FaHeart className="text-indigo-600" />
                                    <span>Wishlist</span>
                                </div>
                                <FaChevronRight className="text-gray-400" />
                            </button>
                            <button
                                onClick={() => navigate("/vieworder")}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <FaBoxOpen className="text-purple-600" />
                                    <span>My Orders</span>
                                </div>
                                <FaChevronRight className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Recent Activity */}
                <div className="lg:col-span-2">
                    {/* Recent Orders Card */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaShoppingBag className="text-indigo-600 mr-2" />
                                Recent Orders
                            </h2>
                        </div>

                        {orders.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {orders.slice(0, 3).map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div 
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                                            onClick={() => handleViewOrderDetails(order.id)}
                                        >
                                            <div className="mb-3 sm:mb-0">
                                                <p className="font-medium text-gray-900">Order #{order.id}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(order.createdOn).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:items-end">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        order.orderStatus === "Delivered" || order.orderStatus === "Completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : order.orderStatus === "Shipped"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : order.orderStatus === "Cancelled"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                                <p className="text-lg font-semibold text-gray-900 mt-2">
                                                    ${Number(order.totalAmount).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                            <span>
                                                {order.items ? order.items.length : 0} item{order.items && order.items.length !== 1 ? "s" : ""}
                                            </span>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleViewOrderDetails(order.id)}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                                {canCancelOrder(order) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCancelOrder(order.id);
                                                        }}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">You haven't placed any orders yet</p>
                                <button
                                    onClick={() => navigate("/products")}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Browse Products
                                </button>
                            </div>
                        )}

                        {orders.length > 3 && (
                            <div className="p-4 border-t border-gray-100 text-center">
                                <button
                                    onClick={() => navigate("/vieworder")}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                >
                                    View all orders ({orders.length})
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;