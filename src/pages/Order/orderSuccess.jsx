import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";

function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, total } = location.state || {};

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 mt-10">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-6" />

                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>

                <p className="text-gray-600 mb-2">Thank you for your purchase. Your order has been confirmed.</p>

                {orderId && (
                    <p className="text-gray-700 mb-4">
                        Order ID: <span className="font-semibold">#{orderId}</span>
                    </p>
                )}

                {total && (
                    <p className="text-gray-700 mb-6">
                        Total Amount: <span className="font-semibold">${parseFloat(total).toFixed(2)}</span>
                    </p>
                )}

                <div className="space-y-3">
                   <Link
  to="/vieworder"
  className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 no-underline decoration-transparent focus:outline-none focus:ring-0"
>
  <FaShoppingBag />
  View My Orders
</Link>


                    <Link
                        to="/"
                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaHome />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
