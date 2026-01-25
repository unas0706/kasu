import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useData } from "../../context/DataContext";
import { ORDER_STATUS, ORDER_STATUS_LABELS } from "../../utils/constants";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersChart = () => {
  const { getOrderStatusDistribution } = useData();
  const statusData = getOrderStatusDistribution();

  // Define colors for each status
  const statusColors = {
    pending: "rgb(245, 158, 11)",
    accepted: "rgb(14, 165, 233)",
    preparing: "rgb(139, 92, 246)",
    ready: "rgb(16, 185, 129)",
    completed: "rgb(16, 185, 129)",
    declined: "rgb(239, 68, 68)",
  };

  const data = {
    labels: statusData.map(
      (item) => ORDER_STATUS_LABELS[item.status] || item.status,
    ),
    datasets: [
      {
        data: statusData.map((item) => item.count),
        backgroundColor: statusData.map(
          (item) => statusColors[item.status] || "#9ca3af",
        ),
        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label} - ${data.datasets[0].data[i]} (${statusData[i]?.percentage?.toFixed(1) || 0}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                lineWidth: 0,
                hidden: false,
                index: i,
              }));
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} orders (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
  };

  return <Doughnut data={data} options={options} />;
};

export default OrdersChart;
