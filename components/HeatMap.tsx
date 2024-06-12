// components/HeatMapChart.tsx
"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { COLORS, THRESHOLDS } from "../contants";
import d3Tip from "d3-tip";

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

const MARGIN = { top: 10, right: 10, bottom: 30, left: 30 };

type HeatmapProps = {};

export const Heatmap = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 800;
  const height = 600;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear any previous content

    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const allYGroups = [...new Set(data.map((d) => d.fillLevel))];
    const allXGroups = [
      ...new Set(data.map((d) => new Date(d.timestamp).toLocaleDateString())),
    ];

    const xScale = d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
    const yScale = d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);

    const aggregatedData = d3
      .groups(
        data,
        (d) => new Date(d.timestamp).toLocaleDateString(),
        (d) => d.fillLevel
      )
      .flatMap(([x, yGroup]) =>
        yGroup.map(([y, values]) => ({
          x,
          y,
          value: values.length,
        }))
      );

    const [min, max] = d3.extent(aggregatedData.map((d) => d.value)) as [
      number,
      number
    ];
    const colorScale = d3
      .scaleLinear<string>()
      .domain(THRESHOLDS.map((t) => t * max))
      .range(COLORS);

    const tip = d3Tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(
        (event, d) => `<strong>Count:</strong> <span>${d.value}</span><br>
                             <strong>Date:</strong> <span>${d.x}</span><br>
                             <strong>Fill Level:</strong> <span>${d.y}%</span>`
      );

    svg.call(tip);

    const bounds = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    bounds
      .selectAll("rect")
      .data(aggregatedData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.x)!)
      .attr("y", (d) => yScale(d.y)!)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.value)!)
      .attr("stroke", "white")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    bounds
      .selectAll(".x-label")
      .data(allXGroups)
      .enter()
      .append("text")
      .attr("class", "x-label")
      .attr("x", (d) => xScale(d)! + xScale.bandwidth() / 2)
      .attr("y", boundsHeight + 10)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 10)
      .text((d) => d);

    bounds
      .selectAll(".y-label")
      .data(allYGroups)
      .enter()
      .append("text")
      .attr("class", "y-label")
      .attr("x", -5)
      .attr("y", (d) => yScale(d)! + yScale.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 10)
      .text((d) => d);
  }, [data, height, width]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default Heatmap;
