import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiUser, FiUserX, FiUserCheck, FiTrash2, FiChevronDown, FiChevronUp, FiBox, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useTheme } from '../common/context/Darkthemeprovider';
import { GetUserById, BlockUnblockUser, SoftDeleteUser }  from '../services/AdminService/UserService';
import { GetOrdersByUserId, UpdateOrderStatus }from '../services/AdminService/OrderService';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await GetUserById(userId);
      setUser(userData);
      await fetchUserOrders(userId);
    } catch (error) {
      toast.error('Failed to load user details');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const ordersData = await GetOrdersByUserId(userId);
      setOrders(ordersData || []);
    } catch (error) {
      toast.error('Failed to load user orders');
    }
  };

  const toggleUserStatus = async () => {
    const result = await Swal.fire({
      title: `Confirm ${user.isBlocked ? 'Unblock' : 'Block'}`,
      text: `Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${user.isBlocked ? 'Unblock' : 'Block'}`
    });

    if (result.isConfirmed) {
      await BlockUnblockUser(userId);
      setUser(prev => ({ ...prev, isBlocked: !prev.isBlocked }));
      toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
    }
  };

  const handleDeleteUser = async () => {
    const result = await Swal.fire({
      title: 'Delete User',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await SoftDeleteUser(userId);
      toast.success('User deleted successfully');
      navigate('/admin/users');
    }
  };

  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    const statusOptions = {
      'pending': 'Pending',
      'processing': 'Processing', 
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    const { value: newStatus } = await Swal.fire({
      title: 'Update Order Status',
      input: 'select',
      inputOptions: statusOptions,
      inputValue: currentStatus,
      showCancelButton: true
    });

    if (newStatus) {
      await UpdateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      toast.success('Order status updated successfully');
    }
  };

  const orderStats = orders.length > 0 && {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0).toFixed(2),
    statusCounts: orders.reduce((acc, order) => {
      acc[order.orderStatus?.toLowerCase()] = (acc[order.orderStatus?.toLowerCase()] || 0) + 1;
      return acc;
    }, {})
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
      'processing': darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800',
      'shipped': darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800',
      'delivered': darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
      'completed': darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
      'cancelled': darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
    };
    return statusColors[status?.toLowerCase()] || (darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800');
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <FiUserX className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>User not found</p>
        </div>
      </div>
    );
  }

  const displayedOrders = expandedOrders.all ? orders : orders.slice(0, 3);

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <button 
        onClick={() => navigate('/admin/users')}
        className={`mb-6 flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
      >
        <FiArrowLeft className="mr-2" /> Back to Users
      </button>

      {/* User Information */}
      <div className={`rounded-xl shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{user.email}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={toggleUserStatus}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                user.isBlocked 
                  ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                  : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}
            >
              {user.isBlocked ? <FiUserCheck className="mr-2" /> : <FiUserX className="mr-2" />}
              {user.isBlocked ? 'Unblock User' : 'Block User'}
            </button>
            <button
              onClick={handleDeleteUser}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                darkMode ? 'bg-red-800 text-red-100' : 'bg-red-600 text-white'
              }`}
            >
              <FiTrash2 className="mr-2" /> Delete User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: FiUser, label: 'Role', value: user.role === 1 ? 'Admin' : 'Standard User' },
            { icon: FiCalendar, label: 'Joined', value: new Date(user.createdOn).toLocaleDateString() },
            { icon: user.isBlocked ? FiUserX : FiUserCheck, label: 'Status', value: user.isBlocked ? 'Blocked' : 'Active' }
          ].map((item, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{item.label}</p>
                  <p className={`mt-1 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Statistics */}
      {orderStats && (
        <div className={`rounded-xl shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              icon={FiBox}
              label="Total Orders"
              value={orderStats.totalOrders}
              darkMode={darkMode}
              color="blue"
            />
            <StatCard 
              icon={FiDollarSign}
              label="Total Spent"
              value={`₹${orderStats.totalSpent}`}
              darkMode={darkMode}
              color="green"
            />
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-50'}`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-600'}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-gray-600'}`}>Order Status</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(orderStats.statusCounts).map(([status, count]) => (
                      <span key={status} className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
                        {count} {status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History */}
      <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order History</h3>
        
        {orders.length > 0 ? (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                darkMode={darkMode}
                expanded={expandedOrders[order.id]}
                onToggleExpand={() => toggleOrderExpansion(order.id)}
                onUpdateStatus={() => handleUpdateOrderStatus(order.id, order.orderStatus)}
                getStatusColor={getStatusColor}
              />
            ))}
            
            {orders.length > 3 && (
              <div className="text-center">
                <button
                  onClick={() => setExpandedOrders(prev => ({ ...prev, all: !prev.all }))}
                  className={`flex items-center justify-center mx-auto ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  {expandedOrders.all ? (
                    <>
                      <FiChevronUp className="mr-1" /> Show fewer orders
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="mr-1" /> Show all {orders.length} orders
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiBox className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No orders found for this user.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, darkMode, color }) => (
  <div className={`p-4 rounded-lg ${darkMode ? `bg-${color}-900` : `bg-${color}-50`}`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full mr-4 ${darkMode ? `bg-${color}-800 text-${color}-200` : `bg-${color}-100 text-${color}-600`}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className={`text-sm ${darkMode ? `text-${color}-200` : 'text-gray-600'}`}>{label}</p>
        <p className={`mt-1 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  </div>
);

const OrderCard = ({ order, darkMode, expanded, onToggleExpand, onUpdateStatus, getStatusColor }) => {
  const items = order.items || order.orderItems || [];
  
  return (
    <div className={`border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'}`}>
      <div className={`p-4 flex justify-between items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div>
          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order #{order.id}</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {new Date(order.createdOn).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onUpdateStatus}
            className={`px-3 py-1 text-xs rounded-lg ${
              darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}
          >
            Update Status
          </button>
          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{order.totalAmount}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Items ({items.length})
        </h5>
        {items.length > 0 ? (
          <>
            <ul className="space-y-2">
              {items.slice(0, expanded ? items.length : 3).map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {item.quantity} × {item.productName}
                  </span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>₹{item.price}</span>
                </li>
              ))}
            </ul>
            {items.length > 3 && (
              <button
                onClick={onToggleExpand}
                className={`mt-2 text-sm flex items-center ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {expanded ? (
                  <>
                    <FiChevronUp className="mr-1" /> Show less
                  </>
                ) : (
                  <>
                    <FiChevronDown className="mr-1" /> Show {items.length - 3} more items
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No items found</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;