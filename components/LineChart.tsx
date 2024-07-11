import React, { useRef, useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import * as d3 from "d3";

interface DataItem {
  timestamp: Date;
  measurement: number;
}

interface LineChartProps {
  historyData: DataItem[];
  green: [number, number];
  yellow: [number, number];
  red: [number, number];
}

function determineColor(d: number, green: [number, number], yellow: [number, number], red: [number, number]) {
  if (d >= green[0] && d <= green[1]) return "green";
  if (d >= yellow[0] && d < yellow[1]) return "yellow";
  if (d >= red[0] && d <= red[1]) return "red";
  return "black";
}

const LineChart: React.FC<LineChartProps> = ({ historyData, green, yellow, red }) => {
  const yAxisRef = useRef<SVGSVGElement>(null);
  const mainChartRef = useRef<SVGSVGElement>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    const currentRef = mainChartRef.current;

    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    if (!mainChartRef.current) return;

    const margin = { top: 5, right: 5, bottom: 100, left: 40 };
    const height = dimensions.height - margin.top - margin.bottom;
    const pointWidth = 10;
    const fullWidth = pointWidth * historyData.length;

    d3.select(mainChartRef.current).selectAll("*").remove();

    const svg = d3
      .select(mainChartRef.current)
      .attr("width", fullWidth + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .domain(historyData.map(d => new Date(d.timestamp).toString()))
      .range([0, fullWidth])
      .padding(0.5);

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    const line = d3.line<DataItem>()
      .x(d => x(new Date(d.timestamp).toString()) || 0)
      .y(d => y(d.measurement));

    const xAxis = d3.axisBottom(x)
      .tickValues(x.domain().filter((_d, i) => i % 10 === 9))
      .tickFormat((domainValue: string) => d3.timeFormat('%Y-%m-%d %H:%M')(new Date(domainValue)));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em');

    svg
    .append("rect")
    .attr("x", 0)
    .attr("y", y(green[1]))
    .attr("width", fullWidth)
    .attr("height", y(green[0]) - y(green[1]))
    .attr("fill", "green")
    .attr("opacity", 0.15);
  
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", y(yellow[1]))
    .attr("width", fullWidth)
    .attr("height", y(yellow[0]) - y(yellow[1]))
    .attr("fill", "yellow")
    .attr("opacity", 0.15);
  
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", y(red[1]))
    .attr("width", fullWidth)
    .attr("height", y(red[0]) - y(red[1]))
    .attr("fill", "red")
    .attr("opacity", 0.15);

    svg
      .append("path")
      .datum(historyData)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg
      .selectAll(".dot")
      .data(historyData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("stroke", "black")
      .attr("fill", d => determineColor(d.measurement, green, yellow, red))
      .attr("cx", d => String(x(new Date(d.timestamp).toString())))
      .attr("cy", d => y(d.measurement))
      .attr("r", 3);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    svg.selectAll('.dot-overlay')
      .data(historyData)
      .enter().append('circle')
      .attr('class', 'dot-overlay')
      .attr('cx', d => x(new Date(d.timestamp).toString()) ?? 0)
      .attr('cy', d => y(d.measurement))
      .attr('r', 10)
      .style('opacity', 0)
      .style('fill', d => determineColor(d.measurement, green, yellow, red))
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .95);
        tooltip.html(`Timestamp: ${d3.timeFormat('%Y-%m-%d %H:%M')(new Date(d.timestamp))}<br/>Measurement: ${Math.round(d.measurement)}%`)
          .style('left', `${event.pageX - 260}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    d3.select(yAxisRef.current).selectAll("*").remove();
    const yAxis = d3.axisLeft(y)
      .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
      .tickFormat((d) => `${d}%`);

    d3.select(yAxisRef.current)
      .attr("width", margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left - 1},${margin.top})`)
      .call(yAxis);

    d3.select(yAxisRef.current)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Fill Level (%)");

  }, [dimensions, historyData, green, yellow, red]);

    // Scroll to the right when the component is mounted to see the latest data
    useEffect(() => {
      if (scrollableDivRef.current) {
        scrollableDivRef.current.scrollLeft = scrollableDivRef.current.scrollWidth;
      }
    }, [dimensions]);

  return (
    <div className="relative w-full h-[400px]">
      <svg ref={yAxisRef} className="absolute left-0 top-0"></svg>
      <div className="overflow-x-scroll h-full ml-10" ref={scrollableDivRef}>
        <svg ref={mainChartRef} className="block h-full -ml-10"></svg>
      </div>
    </div>
  );
};

export default LineChart;
