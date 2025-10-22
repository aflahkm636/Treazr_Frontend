import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../common/context/AuthProvider";
import { useTheme } from "../common/context/Darkthemeprovider";
import {
    FiPackage,
    FiDollarSign,
    FiTruck,
    FiCheckCircle,
    FiUser,
    FiShoppingCart,
    FiCreditCard,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiArrowUp,
    FiArrowDown,
    FiFilter,
    FiSearch,
} from "react-icons/fi";
import StatsCard from "./StatsCard";
import { GetAllOrders, UpdateOrderStatus, SearchOrders, GetOrdersByStatus } from "../services/AdminService/OrderService";
import { GetDashboard } from "../services/AdminService/Dashboardservice";

const OrderManage = () => {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
    });
    const [selectedOrderItems, setSelectedOrderItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "datee",
        direction: "desc",
    });
    const [statusFilter, setStatusFilter] = useState("all");
    const ordersPerPage = 8;

    // Status colors mapping
    const statusColors = {
        pending: {
            bg: darkMode ? "bg-yellow-900" : "bg-yellow-50",
            text: darkMode ? "text-yellow-300" : "text-yellow-800",
            border: darkMode ? "border-yellow-700" : "border-yellow-200",
        },
        processing: {
            bg: darkMode ? "bg-blue-900" : "bg-blue-50",
            text: darkMode ? "text-blue-300" : "text-blue-800",
            border: darkMode ? "border-blue-700" : "border-blue-200",
        },
        shipped: {
            bg: darkMode ? "bg-purple-900" : "bg-purple-50",
            text: darkMode ? "text-purple-300" : "text-purple-800",
            border: darkMode ? "border-purple-700" : "border-purple-200",
        },
        delivered: {
            bg: darkMode ? "bg-green-900" : "bg-green-50",
            text: darkMode ? "text-green-300" : "text-green-800",
            border: darkMode ? "border-green-700" : "border-green-200",
        },
        cancelled: {
            bg: darkMode ? "bg-red-900" : "bg-red-50",
            text: darkMode ? "text-red-300" : "text-red-800",
            border: darkMode ? "border-red-700" : "border-red-200",
        },
    };

    // Payment method colors mapping
    const paymentColors = {
        cashondelivery: { bg: darkMode ? "bg-indigo-900" : "bg-indigo-50", text: darkMode ? "text-indigo-300" : "text-indigo-800" },
        credit: { bg: darkMode ? "bg-blue-900" : "bg-blue-50", text: darkMode ? "text-blue-300" : "text-blue-800" },
        paypal: { bg: darkMode ? "bg-green-900" : "bg-green-50", text: darkMode ? "text-green-300" : "text-green-800" },
        other: { bg: darkMode ? "bg-gray-700" : "bg-gray-100", text: darkMode ? "text-gray-300" : "text-gray-800" },
    };

    // Fetch orders and dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch orders with pagination
                const ordersData = await GetAllOrders(currentPage, ordersPerPage);
                console.log("Orders data:", ordersData); // Debug log
                setOrders(ordersData.items || ordersData.data?.items || ordersData || []);
                
                // Fetch dashboard stats
                const dashboardData = await GetDashboard();
                console.log("Dashboard data:", dashboardData); // Debug log
                if (dashboardData.data) {
                    setStats({
                        totalOrders: dashboardData.data.totalOrders || 0,
                        totalRevenue: dashboardData.data.totalRevenue || 0,
                        shippedOrders: dashboardData.data.shippedOrdersCount || 0,
                        deliveredOrders: dashboardData.data.deliveredOrdersCount || 0,
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load order data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    // Handle search by username
    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setCurrentPage(1);

        if (term === "") {
            // Reset to all orders
            try {
                const ordersData = await GetAllOrders(1, ordersPerPage);
                setOrders(ordersData.items || ordersData.data?.items || ordersData || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            }
        } else {
            // Search orders by username
            try {
                const searchData = await SearchOrders(term);
                setOrders(searchData.items|| searchData.data?.items || searchData || []);
            } catch (error) {
                console.error("Error searching orders:", error);
                toast.error("order not found");
            }
        }
    };

    // Handle status filter
    const handleStatusFilter = async (status) => {
        setStatusFilter(status);
        setCurrentPage(1);

        if (status === "all") {
            try {
                const ordersData = await GetAllOrders(1, ordersPerPage);
                setOrders(ordersData.items || ordersData.data?.items || ordersData || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            }
        } else {
            try {
                const filteredData = await GetOrdersByStatus(status);
                setOrders(filteredData.items || filteredData.data?.items || filteredData || []);
            } catch (error) {
                console.error("Error filtering orders:", error);
                toast.error("Failed to filter orders");
            }
        }
    };

    // Sort functionality
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortedOrders = (orders) => {
        const sortableOrders = [...orders];
        if (sortConfig.key) {
            sortableOrders.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key === "date") {
                    aValue = a.orderDate ? new Date(a.orderDate) : new Date(a.createdOn);
                    bValue = b.orderDate ? new Date(b.orderDate) : new Date(b.createdOn);
                } else if (sortConfig.key === "total") {
                    aValue = parseFloat(a.totalAmount || a.total);
                    bValue = parseFloat(b.totalAmount || b.total);
                } else if (sortConfig.key === "customer") {
                    aValue = (a.user?.username || a.user?.name || `User ${a.userId}`).toLowerCase();
                    bValue = (b.user?.username || b.user?.name || `User ${b.userId}`).toLowerCase();
                } else {
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableOrders;
    };

    // Update order status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await UpdateOrderStatus(orderId, newStatus);
            
            // Update local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, orderStatus: newStatus } : order
                )
            );

            // Refresh dashboard stats
            const dashboardData = await GetDashboard();
            if (dashboardData.data) {
                setStats({
                    // totalOrders: dashboardData.data.totalOrders || 0,
                    totalRevenue: dashboardData.data.totalRevenue || 0,
                    shippedOrders: dashboardData.data.shippedOrdersCount || 0,
                    deliveredOrders: dashboardData.data.deliveredOrdersCount || 0,
                });
            }

            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Show order items modal
    const showOrderItems = (items) => {
        setSelectedOrderItems(items);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    // Get customer name
    const getCustomerName = (order) => {
        return order.user?.username || order.user?.name || `User ${order.userId}`;
    };

    // Get order items
    const getOrderItems = (order) => {
        return order.items || [];
    };

    // Get total amount
    const getTotalAmount = (order) => {
        return order.totalAmount || 0;
    };

    // Get payment method
    const getPaymentMethod = (order) => {
        return order.paymentMethod || "CashOnDelivery";
    };

    // Get order status
    const getOrderStatus = (order) => {
        return order.orderStatus || order.status || "pending";
    };

    // Get payment status
    const getPaymentStatus = (order) => {
        return order.paymentStatus || "Pending";
    };

    // Filter and sort orders (client-side for current page)
    const filteredOrders = getSortedOrders(orders);

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div
                    className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                        darkMode ? "border-blue-400" : "border-blue-500"
                    }`}
                ></div>
            </div>
        );
    }

    return (
        <div
            className={`container mx-auto px-4 py-8 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        >
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Order Management</h1>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    View and manage all customer orders
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<FiPackage className="w-5 h-5" />}
                    darkMode={darkMode}
                    color={darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-50 text-blue-600"}
                /> */}
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={<FiDollarSign className="w-5 h-5" />}
                    darkMode={darkMode}
                    color={darkMode ? "bg-green-900 text-green-200" : "bg-green-50 text-green-600"}
                />
                <StatsCard
                    title="Shipped Orders"
                    value={stats.shippedOrders}
                    icon={<FiTruck className="w-5 h-5" />}
                    darkMode={darkMode}
                    color={darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-50 text-purple-600"}
                />
                <StatsCard
                    title="Delivered Orders"
                    value={stats.deliveredOrders}
                    icon={<FiCheckCircle className="w-5 h-5" />}
                    darkMode={darkMode}
                    color={darkMode ? "bg-teal-900 text-teal-200" : "bg-teal-50 text-teal-600"}
                />
            </div>

            {/* Order List */}
            <div
                className={`p-6 rounded-xl shadow-sm border transition-all duration-300 ${
                    darkMode
                        ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/20"
                        : "bg-white border-gray-100 hover:shadow-lg hover:shadow-gray-100"
                }`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2
                            className={`text-lg font-semibold flex items-center ${
                                darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                            <FiShoppingCart className="mr-2" /> Recent Orders
                        </h2>
                    </div>
                    <div className="mt-2 sm:mt-0 flex gap-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className={darkMode ? "text-gray-400" : "text-gray-400"} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by username..."
                                className={`pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:ring-offset-gray-800"
                                        : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:ring-offset-white"
                                }`}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        
                        {/* Status Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className={`appearance-none pl-3 pr-8 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:ring-offset-gray-800"
                                        : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:ring-offset-white"
                                }`}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <div
                                className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                            >
                                <FiFilter className="h-4 w-4" />
                            </div>
                        </div>
                        
                        <button
                            onClick={() => requestSort("date")}
                            className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                darkMode
                                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:ring-offset-gray-800"
                                    : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:ring-offset-white"
                            }`}
                        >
                            Date
                            {sortConfig.key === "date" &&
                                (sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />)}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <tr>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Order ID
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Customer
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Date
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Items
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Amount
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    <FiCreditCard className="inline mr-1" /> Payment
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Status
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
                        >
                            {currentOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className={`text-center px-6 py-8 text-sm ${
                                            darkMode ? "text-gray-400" : "text-gray-500"
                                        }`}
                                    >
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                currentOrders.map((order) => (
                                    <tr key={order.id} className={darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                        >
                                            #{order.id}
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                darkMode ? "text-gray-300" : "text-gray-500"
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                                        darkMode ? "bg-gray-600" : "bg-gray-200"
                                                    }`}
                                                >
                                                    <FiUser className={darkMode ? "text-gray-300" : "text-gray-500"} />
                                                </div>
                                                <div className="ml-4">
                                                    <div
                                                        className={`font-medium ${
                                                            darkMode ? "text-white" : "text-gray-900"
                                                        }`}
                                                    >
                                                        {getCustomerName(order)}
                                                    </div>
                                                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                        User ID: {order.userId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                darkMode ? "text-gray-300" : "text-gray-500"
                                            }`}
                                        >
                                            {formatDate(order.orderDate || order.createdOn)}
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                darkMode ? "text-gray-300" : "text-gray-500"
                                            }`}
                                        >
                                            <button
                                                onClick={() => showOrderItems(getOrderItems(order))}
                                                className={`flex items-center ${
                                                    darkMode
                                                        ? "text-blue-400 hover:text-blue-300"
                                                        : "text-blue-600 hover:text-blue-800"
                                                } hover:underline`}
                                            >
                                                {getOrderItems(order).length} items
                                            </button>
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                        >
                                            {formatCurrency(getTotalAmount(order))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                        paymentColors[getPaymentMethod(order)?.toLowerCase()]?.bg ||
                                                        paymentColors.other.bg
                                                    } ${
                                                        paymentColors[getPaymentMethod(order)?.toLowerCase()]?.text ||
                                                        paymentColors.other.text
                                                    }`}
                                                >
                                                    {getPaymentMethod(order)}
                                                </span>
                                                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                    {getPaymentStatus(order)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    statusColors[getOrderStatus(order).toLowerCase()]?.bg || statusColors.pending.bg
                                                } ${statusColors[getOrderStatus(order).toLowerCase()]?.text || statusColors.pending.text} ${
                                                    statusColors[getOrderStatus(order).toLowerCase()]?.border || statusColors.pending.border
                                                }`}
                                            >
                                                {getOrderStatus(order)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <select
                                                value={getOrderStatus(order)}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                className={`block w-full pl-3 pr-8 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                                                    statusColors[getOrderStatus(order).toLowerCase()]?.border || statusColors.pending.border
                                                } ${statusColors[getOrderStatus(order).toLowerCase()]?.bg || statusColors.pending.bg} ${
                                                    darkMode ? "text-white" : "text-gray-900"
                                                }`}
                                            >
                                                <option value="pending" className={darkMode ? "bg-gray-800" : "bg-white"}>
                                                    Pending
                                                </option>
                                                <option
                                                    value="processing"
                                                    className={darkMode ? "bg-gray-800" : "bg-white"}
                                                >
                                                    Processing
                                                </option>
                                                <option value="shipped" className={darkMode ? "bg-gray-800" : "bg-white"}>
                                                    Shipped
                                                </option>
                                                <option value="delivered" className={darkMode ? "bg-gray-800" : "bg-white"}>
                                                    Delivered
                                                </option>
                                                <option value="cancelled" className={darkMode ? "bg-gray-800" : "bg-white"}>
                                                    Cancelled
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredOrders.length > ordersPerPage && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 space-y-3 sm:space-y-0">
                        {/* Page info */}
                        <div className={`text-sm text-center sm:text-left ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                            {filteredOrders.length} orders
                        </div>

                        {/* Pagination controls */}
                        <nav className="flex justify-center sm:justify-end space-x-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md border text-sm font-medium flex items-center transition-colors ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                                }`}
                            >
                                <FiChevronLeft className="mr-1" /> Previous
                            </button>

                            {/* Page numbers */}
                            <div className="hidden sm:flex space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                currentPage === pageNum
                                                    ? darkMode
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-blue-600 text-white"
                                                    : darkMode
                                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md border text-sm font-medium flex items-center transition-colors ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                                }`}
                            >
                                Next <FiChevronRight className="ml-1" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Order Items Modal */}
            {selectedOrderItems && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div
                        className={`rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl transform transition-all ${
                            darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        <div
                            className={`flex justify-between items-center border-b p-4 sticky top-0 z-10 ${
                                darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                            }`}
                        >
                            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                                Order Items
                            </h3>
                            <button
                                onClick={() => setSelectedOrderItems(null)}
                                className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                                    darkMode
                                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                                        : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <ul className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                                {selectedOrderItems.map((item, index) => (
                                    <li key={index} className="py-4">
                                        <div className="flex">
                                            <div
                                                className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden ${
                                                    darkMode ? "bg-gray-700" : "bg-gray-100"
                                                }`}
                                            >
                                                {item.images && item.images.length > 0 ? (
                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.productName || item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FiPackage
                                                            className={`w-6 h-6 ${
                                                                darkMode ? "text-gray-500" : "text-gray-400"
                                                            }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                                                    {item.productName || item.name}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                    <div className={darkMode ? "text-gray-400" : "text-gray-500"}>
                                                        <span className="font-medium">Qty:</span> {item.quantity}
                                                    </div>
                                                    <div className={darkMode ? "text-gray-400" : "text-gray-500"}>
                                                        <span className="font-medium">Price:</span> {formatCurrency(item.price)}
                                                    </div>
                                                    <div
                                                        className={`col-span-2 ${
                                                            darkMode ? "text-gray-300" : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span className="font-medium">Total:</span> {formatCurrency((item.price * item.quantity))}
                                                    </div>
                                                    {item.productId && (
                                                        <div className={`col-span-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                            Product ID: {item.productId}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div
                            className={`border-t p-4 sticky bottom-0 ${
                                darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                            }`}
                        >
                            <button
                                onClick={() => setSelectedOrderItems(null)}
                                className={`w-full py-2 px-4 rounded-md transition duration-150 ${
                                    darkMode
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManage;