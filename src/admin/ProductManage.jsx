import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAuth } from "../common/context/AuthProvider";
import { useTheme } from "../common/context/Darkthemeprovider";
import StatsCard from "./StatsCard";
import SortDropdown from "../common/components/SortDropdown";
import UpdateProductForm from "./UpdateProductform";
import AddProductForm from "./AddProductForm";
import {
    GetFilteredProducts,
    GetProducts,
    GetProductsByCategory,
    ToggleDeleteProduct,
} from "../services/AdminService/ProductService";
import { GetDashboard } from "../services/AdminService/Dashboardservice";

const ProductManage = () => {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        totalProducts: 0,
        totalInventoryValue: 0,
        lowStockCount: 0,
        totalUsers: 0,
        totalRevenue: 0,
        deliveredOrdersCount: 0,
        shippedOrdersCount: 0,
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 10;

    // Fetch all data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch products with pagination
                const productsData = await GetProducts("", currentPage, productsPerPage);
                setProducts(productsData.products || []);
                setFilteredProducts(productsData.products || []);
                setTotalPages(productsData.totalPages || 1);

                // Fetch dashboard data for stats
                const dashboardData = await GetDashboard();
                if (dashboardData.data) {
                    setDashboardStats({
                        totalProducts: dashboardData.data.totalProducts || 0,
                        totalInventoryValue: dashboardData.data.totalInventoryValue || 0,
                        lowStockCount: dashboardData.data.lowStockCount || 0,
                        totalUsers: dashboardData.data.totalUsers || 0,
                        totalRevenue: dashboardData.data.totalRevenue || 0,
                        deliveredOrdersCount: dashboardData.data.deliveredOrdersCount || 0,
                        shippedOrdersCount: dashboardData.data.shippedOrdersCount || 0,
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load product data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    // Set manual categories (since dashboard doesn't provide categories)
    useEffect(() => {
        const manualCategories = [
            { id: 3, name: "Diecast cars" },
            { id: 4, name: "Action figures" },
            { id: 5, name: "Comic Books" },
            { id: 6, name: "Cards" },
        ];
        setCategories(manualCategories);
    }, []);

    // Handle search with API filtering
    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setCurrentPage(1);

        try {
            const productsData = await GetProducts(term, 1, productsPerPage);
            setFilteredProducts(productsData.products || []);
            setTotalPages(productsData.totalPages || 1);
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            toast.error("Failed to filter products");
        }
    };

    // Handle sort by category with API
   const handleSortByCategory = async (categoryId) => {
  setCurrentPage(1);

  try {
    let productsData;

    if (categoryId === "all") {
      productsData = await GetProducts("", 1, productsPerPage);
    } else {
      productsData = await GetProductsByCategory(categoryId, 1, productsPerPage);
    }

    setFilteredProducts(productsData.products || []);
    setTotalPages(productsData.totalPages || 1);
  } catch (error) {
    console.error("Error fetching category products:", error);
    toast.error("Failed to load products");
  }
};


    // Change page
    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        try {
            const productsData = await GetProducts(searchTerm, pageNumber, productsPerPage);
            setFilteredProducts(productsData.products || []);
            setTotalPages(productsData.totalPages || 1);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        }
    };

    // Open form to add new product
    const handleAddProduct = () => {
        setShowAddForm(true);
    };

    // Open form to edit product
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setShowUpdateForm(true);
    };

    // Toggle delete product with confirmation
    const handleToggleDeleteProduct = async (productId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will deactivate the product!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, deactivate it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ToggleDeleteProduct(productId);

                    // Refresh the product list and dashboard stats
                    const productsData = await GetProducts(searchTerm, currentPage, productsPerPage);
                    setProducts(productsData.products || []);
                    setFilteredProducts(productsData.products || []);

                    // Refresh dashboard stats
                    const dashboardData = await GetDashboard();
                    if (dashboardData.data) {
                        setDashboardStats({
                            totalProducts: dashboardData.data.totalProducts || 0,
                            totalInventoryValue: dashboardData.data.totalInventoryValue || 0,
                            lowStockCount: dashboardData.data.lowStockCount || 0,
                            totalUsers: dashboardData.data.totalUsers || 0,
                            totalRevenue: dashboardData.data.totalRevenue || 0,
                            deliveredOrdersCount: dashboardData.data.deliveredOrdersCount || 0,
                            shippedOrdersCount: dashboardData.data.shippedOrdersCount || 0,
                        });
                    }

                    Swal.fire("Deactivated!", "The product has been deactivated.", "success");
                } catch (error) {
                    console.error("Error deactivating product:", error);
                    toast.error("Failed to deactivate product");
                }
            }
        });
    };

    // Handle form submission success
  const handleFormSuccess = async () => {
  try {
    // Fetch refreshed products using unified GetProducts
    const productsData = await GetProducts("", currentPage, productsPerPage);
    setProducts(productsData.products || []);
    setFilteredProducts(productsData.products || []);

    // Refresh dashboard stats after adding/updating product
    const dashboardData = await GetDashboard();
    if (dashboardData.data) {
      setDashboardStats({
        totalProducts: dashboardData.data.totalProducts || 0,
        totalInventoryValue: dashboardData.data.totalInventoryValue || 0,
        lowStockCount: dashboardData.data.lowStockCount || 0,
        totalUsers: dashboardData.data.totalUsers || 0,
        totalRevenue: dashboardData.data.totalRevenue || 0,
        deliveredOrdersCount: dashboardData.data.deliveredOrdersCount || 0,
        shippedOrdersCount: dashboardData.data.shippedOrdersCount || 0,
      });
    }

    // Reset form states
    setShowAddForm(false);
    setShowUpdateForm(false);
    setCurrentProduct(null);

    toast.success("Product list refreshed successfully");
  } catch (error) {
    console.error("Error refreshing products:", error);
    toast.error("Failed to refresh product data");
  }
};


    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get category name by ID
    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Unknown Category";
    };

    // Get product image
    const getProductImage = (product) => {
        if (product.imageBase64 && product.imageBase64.length > 0) {
            return `${product.imageBase64[0]}`;
        }
        return "https://via.placeholder.com/150";
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

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
            {/* Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Product Management</h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="w-full sm:w-64">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className={darkMode ? "text-gray-400" : "text-gray-400"} />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search products..."
                                className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                                }`}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddProduct}
                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiPlus className="mr-2" /> Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards - Using Dashboard Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Products"
                    value={dashboardStats.totalProducts}
                    icon="📦"
                    darkMode={darkMode}
                    color={darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-50 text-blue-600"}
                />
                <StatsCard
                    title="Total Inventory Value"
                    value={formatCurrency(dashboardStats.totalInventoryValue)}
                    icon="💰"
                    darkMode={darkMode}
                    color={darkMode ? "bg-green-900 text-green-200" : "bg-green-50 text-green-600"}
                />
                <StatsCard
                    title="Products Low in Stock"
                    value={dashboardStats.lowStockCount}
                    icon="⚠️"
                    darkMode={darkMode}
                    color={darkMode ? "bg-yellow-900 text-yellow-200" : "bg-yellow-50 text-yellow-600"}
                />
            </div>

            {/* Sort and Search Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="w-full sm:w-64">
                    <SortDropdown darkMode={darkMode} onSortChange={handleSortByCategory} categories={categories} />
                </div>
            </div>

            {/* Products Table */}
            <div
                className={`shadow-sm rounded-xl border overflow-hidden mb-6 ${
                    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                }`}
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                            <tr>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    ID
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Product
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Added On
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Category
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Price
                                </th>
                                <th
                                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    Stock
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
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                        >
                                            #{product.id}
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={getProductImage(product)}
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded-md mr-3"
                                                />
                                                <span className="truncate max-w-xs">{product.name}</span>
                                            </div>
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                darkMode ? "text-gray-300" : "text-gray-500"
                                            }`}
                                        >
                                            {formatDate(product.createdOn)}
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                darkMode ? "text-gray-300" : "text-gray-500"
                                            } capitalize`}
                                        >
                                            {getCategoryName(product.categoryId)}
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                        >
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    (product.currentStock || 0) > 10
                                                        ? darkMode
                                                            ? "bg-green-900 text-green-200"
                                                            : "bg-green-100 text-green-800"
                                                        : (product.currentStock || 0) > 5
                                                        ? darkMode
                                                            ? "bg-yellow-900 text-yellow-200"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        : darkMode
                                                        ? "bg-red-900 text-red-200"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {product.currentStock || 0} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className={`p-1 rounded-md transition-colors duration-150 ${
                                                        darkMode
                                                            ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900"
                                                            : "text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                                    }`}
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleDeleteProduct(product.id)}
                                                    className={`p-1 rounded-md transition-colors duration-150 ${
                                                        darkMode
                                                            ? "text-red-400 hover:text-red-300 hover:bg-red-900"
                                                            : "text-red-600 hover:text-red-900 hover:bg-red-50"
                                                    }`}
                                                    title="Deactivate"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className={`px-6 py-4 text-center text-sm ${
                                            darkMode ? "text-gray-400" : "text-gray-500"
                                        }`}
                                    >
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div
                        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 mt-6 border-t sm:px-6 rounded-b-xl space-y-3 sm:space-y-0 ${
                            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                        }`}
                    >
                        <div className={`text-sm text-center sm:text-left ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Showing{" "}
                            <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {(currentPage - 1) * productsPerPage + 1}
                            </span>{" "}
                            to{" "}
                            <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {Math.min(currentPage * productsPerPage, filteredProducts.length)}
                            </span>{" "}
                            of{" "}
                            <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {filteredProducts.length}
                            </span>{" "}
                            products
                        </div>

                        <nav className="flex justify-center sm:justify-end space-x-2" aria-label="Pagination">
                            <button
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md border text-sm font-medium flex items-center ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                }`}
                            >
                                <FiChevronLeft className="mr-1" /> Previous
                            </button>

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
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${
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

                            <button
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md border text-sm font-medium flex items-center ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                }`}
                            >
                                Next <FiChevronRight className="ml-1" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Add Product Form Modal */}
            {showAddForm && (
                <AddProductForm
                    onCancel={() => setShowAddForm(false)}
                    onSuccess={handleFormSuccess}
                    darkMode={darkMode}
                    categories={categories}
                />
            )}

            {/* Update Product Form Modal */}
            {showUpdateForm && (
                <UpdateProductForm
                    product={currentProduct}
                    onCancel={() => setShowUpdateForm(false)}
                    onSuccess={handleFormSuccess}
                    darkMode={darkMode}
                    categories={categories}
                />
            )}
        </div>
    );
};

export default ProductManage;
