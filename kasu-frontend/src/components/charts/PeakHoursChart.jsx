import React from "react";
import { Bar } from "react-chartjs-2";
import { useData } from "../../context/DataContext";
import { format, isToday } from "date-fns";
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

const PeakHoursChart = () => {
  const { orders } = useData();

  // Calculate orders per hour for today
  const hours = Array.from({ length: 14 }, (_, i) => i + 9); // 9 AM to 10 PM
  const hourLabels = hours.map(
    (hour) => `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? "AM" : "PM"}`,
  );

  const todayOrders = orders.filter((order) =>
    isToday(new Date(order.createdAt)),
  );

  const ordersByHour = hours.map((hour) => {
    const hourStart = new Date();
    hourStart.setHours(hour, 0, 0, 0);
    const hourEnd = new Date();
    hourEnd.setHours(hour, 59, 59, 999);

    return todayOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= hourStart && orderDate <= hourEnd;
    }).length;
  });

  const data = {
    labels: hourLabels,
    datasets: [
      {
        label: "Orders",
        data: ordersByHour,
        backgroundColor: (context) => {
          const value = context.raw || 0;
          const maxValue = Math.max(...ordersByHour);
          const opacity = 0.6 + (value / maxValue) * 0.4; // Dynamic opacity based on value
          return `rgba(139, 92, 246, ${opacity})`;
        },
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
        borderRadius: 4,
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
            return `Orders: ${context.parsed.y}`;
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
          font: { size: 12 },
          precision: 0,
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

export default PeakHoursChart;
