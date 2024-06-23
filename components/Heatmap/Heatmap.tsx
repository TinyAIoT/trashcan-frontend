"use client";

import { useState, useRef, useEffect } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { COLOR_LEGEND_HEIGHT } from "./constants";
import { ColorLegend } from "./ColorLegend";
import * as d3 from "d3";
import { COLORS, THRESHOLDS } from "./constants";

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

export const Heatmap = ({ data }: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  const colorScale = d3.scaleLinear<string>()
      .domain(THRESHOLDS)
      .range(COLORS);

  // Scroll to the right when the component is mounted to see the latest data
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollLeft = scrollableDivRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <div className="overflow-x-scroll h-[340px]" ref={scrollableDivRef}>
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
