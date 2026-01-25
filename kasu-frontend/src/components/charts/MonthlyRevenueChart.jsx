import React from "react";
import { Bar } from "react-chartjs-2";
import { useData } from "../../context/DataContext";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MonthlyRevenueChart = ({ months = 6 }) => {
  const { orders } = useData();

  // Calculate revenue for last N months
  const monthlyData = Array.from({ length: months }, (_, i) => {
    const date = subMonths(new Date(), months - i - 1);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= monthStart && orderDate <= monthEnd;
    });

    const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = monthOrders.length;

    return {
      month: format(date, "MMM"),
      year: format(date, "yyyy"),
      revenue,
      orders: orderCount,
      avgOrderValue: orderCount > 0 ? revenue / orderCount : 0,
    };
  });

  const data = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue ($)",
        data: monthlyData.map((item) => item.revenue),
        backgroundColor: "rgba(14, 165, 233, 0.8)",
        borderColor: "rgb(14, 165, 233)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const monthData = monthlyData[context.dataIndex];
            return [
              `Revenue: $${context.parsed.y.toLocaleString()}`,
              `Orders: ${monthData.orders}`,
              `Avg. Order: $${monthData.avgOrderValue.toFixed(2)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
          font: { size: 12 },
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MonthlyRevenueChart;
