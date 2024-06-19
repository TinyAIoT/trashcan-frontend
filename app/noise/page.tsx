"use client";

import PageTitle from "@/components/PageTitle";
import { Info } from "lucide-react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

function generateMockData(numPoints: number) {
  const data = [];
  const startDate = new Date().getTime(); // current timestamp

  for (let i = 0; i < numPoints; i++) {
      const timestamp = new Date(startDate - i * 1000 * 60 * 10); // every 10 minutes
      const dBValue = Math.floor(Math.random() * 81) + 20; // dB value between 20 and 100
      data.push({
          timestamp: timestamp.toISOString(),
          dB: dBValue
      });
  }

  return data;
}

export default function NoiseDashboard() {
  
  const mockData = generateMockData(250);
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    const width = svg.attr("width") - 40;
    const height = svg.attr("height") - 40;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const x = d3.scaleTime().range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.dB));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    x.domain(d3.extent(mockData, d => new Date(d.timestamp)));
    y.domain([0, 100]);

    svg.append("path")
      .datum(mockData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  }, [mockData]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Noise Dashboard" />
      <div className="flex items-center justify-start">
        <p className="text-lg">Active time interval: 10PM to 6AM</p>
        <Info className="text-gray-500 ml-5 mr-2" />
        <p className="text-lg text-gray-500">The time interval can be changed in the settings</p>
      </div>
      {/* Graphic */}
      <div className="h-[200px]">
        <svg ref={chartRef} width="600" height="200"></svg>
      </div>
      <div className="flex items-center justify-start">
        <Info className="text-gray-500 mr-2" />
        <p className="text-lg text-gray-500">Hover over the points in the red area to see the classification of the model.</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg">
          <span className="text-red-500">Red points</span> are irregularities, as they satisfy both of the following conditions:
        </p>
        <ul className="list-disc pl-5">
          <li>Above the threshold of 80dB.</li>
          <li>Classified as noise <span className="text-gray-500">(instead of sound by cars/weather/...)</span>.</li>
        </ul>
      </div>
    </div>
  );
}
