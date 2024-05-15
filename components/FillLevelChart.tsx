import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import ResizeObserver from 'resize-observer-polyfill';

const thresholds = [30, 70];

const hours = Array.from({ length: 97 }, (_, i) => i - 48);
// Create mock data for the chart
var fill_levels_past: {hour: number, fill: number}[] = new Array(49).fill({hour: -48, fill: 0});
for (let i = 1; i < fill_levels_past.length; i++) {
  const prev = fill_levels_past[i - 1].fill || 0;
  fill_levels_past[i] = {hour: hours[i], fill: Math.round(Math.min(100, prev + Math.random() * 2))};
}
var fill_levels_prediction: {hour: number, fill: number}[] = new Array(48).fill({hour: 0, fill: 0});
fill_levels_prediction[0] = {hour: hours[49], fill: Math.round(Math.min(100, fill_levels_past[48].fill + Math.random() * 2))};
for (let i = 1; i < fill_levels_prediction.length; i++) {
  const prev = fill_levels_prediction[i - 1].fill || 0;
  fill_levels_prediction[i] = {hour: hours[i + 49], fill: Math.round(Math.min(100, prev + Math.random() * 2))};
}

const FillLevelChart = () => {
  const ref = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const svgElement = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) {
        return;
      }
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (svgElement) {
      resizeObserver.observe(svgElement);
    }

    return () => {
      if (svgElement) {
        resizeObserver.unobserve(svgElement);
      }
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) {
      return;
    }

    const margin = { top: 5, right: 5, bottom: 30, left: 20 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([Math.min(...hours), Math.max(...hours)])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const pastLine = d3.line()
      .x((_d, i) => x(hours[i]))
      .y(d => y(d.fill));

    const predictionLine = d3.line()
      .x((_d, i) => x(hours[i + 48]))
      .y(d => y(d.fill));

    const xAxis = d3.axisBottom(x)
      .tickValues([-48, -36, -24, -12, -4, 0, 4, 12, 24, 36, 48]);
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // Y-axis is centered
    const yAxis = d3.axisLeft(y)
      .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    svg.append('g')
      .attr('transform', `translate(${width / 2},0)`)
      .call(yAxis);

    // Add green background rectangle for y <= thresholds[0]
    svg.append('rect')
      .attr('x', 0)
      .attr('y', y(thresholds[0]))
      .attr('width', width)
      .attr('height', height - y(thresholds[0]))
      .attr('fill', 'green')
      .attr('opacity', 0.15);

    // Add yellow background rectangle for thresholds[0] < y <= thresholds[1]
    svg.append('rect')
      .attr('x', 0)
      .attr('y', y(thresholds[1]))
      .attr('width', width)
      .attr('height', y(thresholds[0]) - y(thresholds[1]))
      .attr('fill', 'yellow')
      .attr('opacity', 0.15);

    // Add red background rectangle for y > thresholds[1]
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', y(thresholds[1]))
      .attr('fill', 'red')
      .attr('opacity', 0.15);

    // Add white rectangle for x > 0
    svg.append('rect')
      .attr('x', x(0))
      .attr('y', 0)
      .attr('width', width - x(0))
      .attr('height', height)
      .attr('fill', 'white')
      .attr('opacity', 0.3);

    // Define color scale
    const color = d3.scaleThreshold(thresholds, ["green", "yellow", "red"]);

    // Draw the past line
    svg.append('path')
      .datum(fill_levels_past)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5)
      .attr('d', pastLine);

    // Draw the prediction line
    svg.append('path')
      .datum([fill_levels_past[fill_levels_past.length-1], ...fill_levels_prediction])
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2')
      .attr('d', predictionLine);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .style('text-anchor', 'middle')
      .text('Hours');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Fill Level (%)');

    svg.selectAll('.dot-pred')
      .data(fill_levels_prediction)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('stroke', 'black')
      .attr('fill', d => color(d.fill))
      .attr('cx', d => x(d.hour))
      .attr('cy', d => y(d.fill))
      .attr('r', 1.5);

    svg.selectAll('.dot-past')
      .data(fill_levels_past)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('stroke', 'black')
      .attr('fill', d => color(d.fill))
      .attr('cx', d => x(d.hour))
      .attr('cy', d => y(d.fill))
      .attr('r', 2);

    // Add tooltip
    const tipPast = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((_event: any, d: { fill: number; hour: number; }) =>
        `${Math.abs(d.hour)} hours ago: <span style='color:red'>${d.fill}%</span>`);
    
    const tipPrediction = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((_event: any, d: { fill: number; hour: number; }) =>
        `In ${d.hour} hours: <span style='color:red'>${d.fill}%</span> <em>(Prediction)</em>`);
    
    svg.call(tipPast);
    svg.call(tipPrediction);

    svg.selectAll('.dot-overlay-past')
      .data(fill_levels_past)
      .enter().append('circle')
      .attr('class', 'dot-overlay')
      .attr('cx', d => x(d.hour))
      .attr('cy', d => y(d.fill))
      .attr('r', 6)
      .style('opacity', 0)
      .on('mouseover', tipPast.show)
      .on('mouseout', tipPast.hide);

    svg.selectAll('.dot-overlay-prediction')
      .data(fill_levels_prediction)
      .enter().append('circle')
      .attr('class', 'dot-overlay')
      .attr('cx', d => x(d.hour))
      .attr('cy', d => y(d.fill))
      .attr('r', 6)
      .style('opacity', 0)
      .on('mouseover', tipPrediction.show)
      .on('mouseout', tipPrediction.hide);

  }, [dimensions]);

  return (
    <svg ref={ref} style={{ width: '100%', height: '400px' }}></svg>
  );
};

export default FillLevelChart;
