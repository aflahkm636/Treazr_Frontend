import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/context/AuthProvider";
import { FaBoxOpen, FaTimes, FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { GetUserOrders, CancelOrder, GetOrderById } from "../../services/AdminService/OrderService";

const ViewOrder = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userOrders = await GetUserOrders();
                setOrders(userOrders || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await CancelOrder(orderId);
            setOrders((prev) => prev.filter((order) => order.id !== orderId));
            // Close modal if this order was being viewed
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

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
            case "Completed":
                return "bg-green-100 text-green-800";
            case "Shipped":
                return "bg-blue-100 text-blue-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Please login to view your orders</h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

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
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.orderStatus)}`}>
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
                                                    {item.imageUrl ? (
                                                        <img 
                                                            src={item.imageUrl} 
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

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
                            >
                                <FaArrowLeft className="text-lg" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold">My Orders</h1>
                                <p className="text-indigo-100">View and manage your orders</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-indigo-100">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FaShoppingBag className="text-indigo-600 mr-2" />
                        All Orders
                    </h2>
                </div>

                {orders.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div 
                                        className="flex-1 cursor-pointer mb-4 lg:mb-0"
                                        onClick={() => handleViewOrderDetails(order.id)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                                            <div>
                                                <p className="font-medium text-gray-900">Order #{order.id}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(order.createdOn).toLocaleDateString("en-US", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="mt-2 sm:mt-0">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {order.items ? order.items.length : 0} item{order.items && order.items.length !== 1 ? 's' : ''} • Total: ${Number(order.totalAmount).toFixed(2)}
                                        </p>
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewOrderDetails(order.id)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                        >
                                            View Details
                                        </button>
                                        {canCancelOrder(order) && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewOrder;