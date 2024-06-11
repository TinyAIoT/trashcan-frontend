// components/HeatMapChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Scatter } from "react-chartjs-2";
import "chartjs-adapter-date-fns"; // Import the date-fns adapter

Chart.register(...registerables);

const data = [
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 20, trashcanId: 1 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 50, trashcanId: 1 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 80, trashcanId: 1 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 40, trashcanId: 1 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 70, trashcanId: 1 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 30, trashcanId: 1 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 60, trashcanId: 1 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 90, trashcanId: 1 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 30, trashcanId: 2 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 60, trashcanId: 2 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 40, trashcanId: 2 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 70, trashcanId: 2 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 50, trashcanId: 2 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 80, trashcanId: 2 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 90, trashcanId: 2 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 20, trashcanId: 2 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 50, trashcanId: 3 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 70, trashcanId: 3 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 60, trashcanId: 3 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 90, trashcanId: 3 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 80, trashcanId: 3 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 20, trashcanId: 3 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 30, trashcanId: 3 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 40, trashcanId: 3 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 70, trashcanId: 4 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 80, trashcanId: 4 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 90, trashcanId: 4 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 20, trashcanId: 4 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 40, trashcanId: 4 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 60, trashcanId: 4 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 50, trashcanId: 4 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 30, trashcanId: 4 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 80, trashcanId: 5 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 90, trashcanId: 5 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 20, trashcanId: 5 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 30, trashcanId: 5 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 60, trashcanId: 5 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 70, trashcanId: 5 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 40, trashcanId: 5 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 50, trashcanId: 5 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 60, trashcanId: 6 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 20, trashcanId: 6 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 40, trashcanId: 6 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 60, trashcanId: 6 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 50, trashcanId: 6 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 30, trashcanId: 6 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 70, trashcanId: 6 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 80, trashcanId: 6 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 90, trashcanId: 7 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 40, trashcanId: 7 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 30, trashcanId: 7 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 50, trashcanId: 7 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 20, trashcanId: 7 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 60, trashcanId: 7 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 70, trashcanId: 7 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 80, trashcanId: 7 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 40, trashcanId: 8 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 50, trashcanId: 8 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 60, trashcanId: 8 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 70, trashcanId: 8 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 80, trashcanId: 8 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 90, trashcanId: 8 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 20, trashcanId: 8 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 30, trashcanId: 8 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 50, trashcanId: 9 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 60, trashcanId: 9 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 70, trashcanId: 9 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 80, trashcanId: 9 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 90, trashcanId: 9 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 20, trashcanId: 9 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 30, trashcanId: 9 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 40, trashcanId: 9 },
  { timestamp: "2024-01-01T00:00:00Z", fillLevel: 60, trashcanId: 10 },
  { timestamp: "2024-01-01T12:00:00Z", fillLevel: 70, trashcanId: 10 },
  { timestamp: "2024-01-02T00:00:00Z", fillLevel: 80, trashcanId: 10 },
  { timestamp: "2024-01-02T12:00:00Z", fillLevel: 90, trashcanId: 10 },
  { timestamp: "2024-01-03T00:00:00Z", fillLevel: 20, trashcanId: 10 },
  { timestamp: "2024-01-03T12:00:00Z", fillLevel: 30, trashcanId: 10 },
  { timestamp: "2024-01-04T00:00:00Z", fillLevel: 40, trashcanId: 10 },
  { timestamp: "2024-01-04T12:00:00Z", fillLevel: 50, trashcanId: 10 },
];

const HeatMapChart = () => {
  const chartData = {
    datasets: [
      {
        label: "Trashcan Fill Levels Over Time",
        data: data.map((item) => ({
          x: new Date(item.timestamp).getTime(), // Convert timestamp to milliseconds
          y: item.trashcanId,
          r: item.fillLevel / 10, // Bubble radius proportional to fill level
        })),
        backgroundColor: (context) => {
          const index = context.dataIndex;
          const value = context.dataset.data[index].r * 10;
          return `rgba(255, ${255 - value * 2.55}, ${255 - value * 2.55}, 0.8)`;
        },
        pointBackgroundColor: (context) => {
          const index = context.dataIndex;
          const value = context.dataset.data[index].r * 10;
          return `rgba(255, ${255 - value * 2.55}, ${255 - value * 2.55}, 0.8)`;
        },
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day", // Change to appropriate time unit (hour, day, month, etc.)
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Trashcan ID",
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw.r * 10;
            return `Trashcan ID: ${context.raw.y}, Fill Level: ${value}%`;
          },
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};
export default HeatMapChart;
