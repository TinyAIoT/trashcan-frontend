// Component inspired by: https://www.react-graph-gallery.com/heatmap
"use client";

import { useState, useRef, useEffect } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { COLOR_LEGEND_HEIGHT } from "./constants";
import { ColorLegend } from "./ColorLegend";
import * as d3 from "d3";
import { COLORS, MARGIN, THRESHOLDS } from "./constants";


type HeatmapProps = {
  data: {
    time: number; // Unix timestamp
    percentage: number; // (10, 20, 30, ..., 90, 100)
    amount: number;
  }[];
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number | null;
};

const YAxis = ({ yGroups, height }: { yGroups: string[], height: number }) => {
  const yScale = d3
    .scaleBand<string>()
    .range([0, height - MARGIN.top - MARGIN.bottom])
    .domain(yGroups)
    .padding(0.1);

  const yLabels = yGroups.map((name, i) => {
    const yPos = yScale(name); // Calculate yPos using yScale with the current group name
    if (yPos === undefined) return null; // Guard against undefined yPos
    const displayText = `${Number(name)-10}-${name}%`;

    return (
      <text
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={9}
      >
        {displayText}
      </text>
    );
  });

  return (
    <svg width={MARGIN.left} height={height} className="absolute left-0 top-0">
      <g transform={`translate(${MARGIN.left - 1},${MARGIN.top})`}>
        {yLabels}
      </g>
    </svg>
  );
};

export const Heatmap = ({ data }: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  const colorScale = d3.scaleLinear<string>()
      .domain(THRESHOLDS)
      .range(COLORS);

  const allYGroups = Array.from(new Set(data.map(d => d.percentage)))
    .sort((a, b) => b - a)
    .map(String);

  // Scroll to the right when the component is mounted to see the latest data
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollLeft = scrollableDivRef.current.scrollWidth + 1000;
    }
  }, []);

  return (
    <div className="relative w-full h-[400px]">
    <YAxis yGroups={allYGroups} height={340} />
      <div className="overflow-x-scroll h-[340px] ml-12" ref={scrollableDivRef}>
        <div className="relative">
          <Renderer
            width={data.length * 2}
            height={340}
            data={data}
            setHoveredCell={setHoveredCell}
            colorScale={colorScale}
          />
          <Tooltip
            interactionData={hoveredCell}
            width={data.length * 2}
            height={340 - COLOR_LEGEND_HEIGHT}
          />
          </div>
        </div>
      <div className="w-full flex justify-center">
          <ColorLegend
            height={COLOR_LEGEND_HEIGHT}
            width={250}
            colorScale={colorScale}
          />
      </div>
    </div>
  );
};
