import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import Loading from "../common/components/Loading";
import { useTheme } from "../common/context/Darkthemeprovider";
import { FiDollarSign, FiShoppingBag, FiUsers, FiCheckCircle } from "react-icons/fi";
import { GetDashboard } from "../services/AdminService/Dashboardservice";
import { GetAllOrders } from "../services/AdminService/OrderService";
import OrderDistributionChart from "./OrderDistributionChart";
import OrderTrendChart from "./OrderTrendChart";
import RevenueTrendChart from "./RevenueTrendChart";


const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const dashboardRes = await GetDashboard();
        setStats(dashboardRes.data);

        const ordersRes = await GetAllOrders(1, 50);
        console.log(ordersRes.data.items)
        setOrders(ordersRes.data.items|| []);
      } catch (err) {
        console.error("Error fetching dashboard or orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading name="admin dashboard" />;

  return (
    <div className={`p-4 sm:p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={<FiUsers className="w-5 h-5" />} darkMode={darkMode} />
        <StatsCard title="Total Products" value={stats.totalProducts} icon={<FiShoppingBag className="w-5 h-5" />} darkMode={darkMode} />
        <StatsCard title="Total Orders Delivered" value={stats.deliveredOrdersCount} icon={<FiCheckCircle className="w-5 h-5" />} darkMode={darkMode} />
        <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<FiDollarSign className="w-5 h-5" />} darkMode={darkMode} />
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">Revenue Trend</h2>
          <RevenueTrendChart orders={orders} />
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">Order Trend</h2>
          <OrderTrendChart orders={orders} />
        </div>
        <div className="p-4 rounded-lg shadow lg:col-span-2 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">Order Distribution</h2>
          <OrderDistributionChart orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
