import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const OrderDistributionChart = ({ orders }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    // Count orders by status
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.orderStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            label: "Order Status",
            data,
            backgroundColor: ["#4ade80", "#facc15", "#f87171", "#60a5fa", "#a78bfa"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right", // labels on the right
            align: "center", // vertical alignment of labels
            labels: {
              boxWidth: 20,
              padding: 15,
            },
          },
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
      },
    });
  }, [orders]);

  return (
    <div className="w-full h-96 lg:h-[400px] xl:h-[500px] flex justify-center items-center">
      <canvas ref={chartRef} />
    </div>
  );
};

export default OrderDistributionChart;
