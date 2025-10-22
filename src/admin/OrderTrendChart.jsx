import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const OrderTrendChart = ({ orders }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    // Count orders per day
    const ordersByDate = orders.reduce((acc, order) => {
      const date = new Date(order.createdOn).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(ordersByDate).sort((a, b) => new Date(a) - new Date(b));
    const data = Object.values(ordersByDate);

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Orders",
            data,
            backgroundColor: "#60a5fa",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  }, [orders]);

  return <canvas ref={chartRef} />;
};

export default OrderTrendChart;
