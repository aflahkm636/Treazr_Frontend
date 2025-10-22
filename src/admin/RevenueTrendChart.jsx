import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const RevenueTrendChart = ({ orders }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // Destroy previous chart if exists
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    // Group revenue by date with payment method rules
    const revenueByDate = orders.reduce((acc, order) => {
      let addRevenue = false;

      if (order.paymentMethod === "CashOnDelivery" && order.orderStatus === "Delivered") {
        addRevenue = true;
      } else if (order.paymentMethod === "Razorpay" && order.paymentStatus === "Completed") {
        addRevenue = true;
      }

      if (addRevenue) {
        const date = new Date(order.createdOn).toLocaleDateString();
        acc[date] = (acc[date] || 0) + order.totalAmount;
      }

      return acc;
    }, {});

    const labels = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));
    const data = Object.values(revenueByDate);

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue",
            data,
            fill: true,
            borderColor: "#4ade80",
            backgroundColor: "rgba(74, 222, 128, 0.2)",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
      },
    });
  }, [orders]);

  return <canvas ref={chartRef} />;
};

export default RevenueTrendChart;
