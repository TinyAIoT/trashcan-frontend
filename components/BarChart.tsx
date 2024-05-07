/** @format */
"use client";
import React from "react";
import {
  BarChart as BarGraph,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

type Props = {};

const data = [
  {
    name: "Jan",
    total: 54000,
  },
  {
    name: "Feb",
    total: 60000,
  },
  {
    name: "Mar",
    total: 62000,
  },
  {
    name: "Apr",
    total: 62000,
  },
  {
    name: "May",
    total: 78000,
  },
  {
    name: "Jun",
    total: 65000,
  },
  {
    name: "Jul",
    total: 88000,
  },
  {
    name: "Aug",
    total: 90000,
  },
  {
    name: "Sep",
    total: 82000,
  },
  {
    name: "Oct",
    total: 88000,
  },
  {
    name: "Nov",
    total: 88500,
  },
  {
    name: "Dec",
    total: 92000,
  },
];

export default function BarChart({}: Props) {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarGraph data={data}>
        <XAxis
          dataKey={"name"}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey={"total"} radius={[4, 4, 0, 0]} />
      </BarGraph>
    </ResponsiveContainer>
  );
}
