import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useData } from "../../context/DataContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CategoriesChart = () => {
  const { categories, orders, items } = useData();

  const chartColors = [
    "rgba(14,165,233,0.8)",
    "rgba(16,185,129,0.8)",
    "rgba(245,158,11,0.8)",
    "rgba(156,163,175,0.8)",
    "rgba(139,92,246,0.8)",
    "rgba(236,72,153,0.8)",
    "rgba(99,102,241,0.8)",
  ];

  // -------- REAL CATEGORY REVENUE CALCULATION --------
  const categoryData = useMemo(() => {
    if (!orders.length || !categories.length || !items.length) return [];

    // Step 1: Initialize category revenue map
    const revenueMap = {};
    categories.forEach((cat) => {
      revenueMap[cat._id.toString()] = {
        name: cat.name,
        revenue: 0,
      };
    });

    // Step 2: Calculate revenue from orders
    orders.forEach((order) => {
      order.items.forEach((orderItem) => {
        const itemId =
          typeof orderItem.item === "object"
            ? orderItem.item._id.toString()
            : orderItem.item.toString();

        // Find actual item to know its category
        const realItem = items.find((it) => it._id.toString() === itemId);

        if (!realItem) return;

        const categoryId = realItem.category._id.toString();

        if (revenueMap[categoryId]) {
          revenueMap[categoryId].revenue += orderItem.subtotal;
        }
      });
    });

    // Step 3: Convert to array and sort DESC by revenue
    return Object.values(revenueMap).sort((a, b) => b.revenue - a.revenue);
  }, [orders, categories, items]);

  const data = {
    labels: categoryData.map((c) => c.name),
    datasets: [
      {
        label: "Revenue",
        data: categoryData.map((c) => c.revenue),
        backgroundColor: categoryData.map(
          (_, i) => chartColors[i % chartColors.length],
        ),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹ ${ctx.parsed.x.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹ ${value.toLocaleString()}`,
        },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CategoriesChart;
