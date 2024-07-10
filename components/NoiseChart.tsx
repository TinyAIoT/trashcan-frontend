import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import ResizeObserver from 'resize-observer-polyfill';


interface DataItem {
  timestamp: string;
  measurement: number;
  noisePrediction: number;
}

interface NoiseChartProps {
  noiseData: DataItem[];
  noiseThreshold: number;
  confidenceThreshold: number;
}

const NoiseChart: React.FC<NoiseChartProps> = ({ noiseData, noiseThreshold, confidenceThreshold }) => {
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
    const fullWidth = 20 * noiseData.length;
  
    d3.select(mainChartRef.current).selectAll('*').remove();

    const svg = d3.select(mainChartRef.current)
      .attr('width', fullWidth + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain([new Date(noiseData[0].timestamp), new Date(noiseData[noiseData.length - 1].timestamp)])
      .range([0, fullWidth]);

    const y = d3.scaleLinear()
      .domain([-100, 0])
      .range([height, 0]);

    const line = d3.line<DataItem>()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.measurement));

    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeMinute.every(1))
      .tickFormat((domainValue) => {
        // Ensure the value is a Date before formatting
        if (domainValue instanceof Date) {
          return d3.timeFormat('%Y-%m-%d %H:%M')(domainValue);
        }
        return '';
      });

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em');

    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', fullWidth)
      .attr('height', y(noiseThreshold))
      .attr('fill', 'red')
      .attr('opacity', 0.15);

    svg.append('path')
      .datum(noiseData)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    svg.selectAll('.dot')
      .data(noiseData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('stroke', 'black')
      .attr('fill', d => (d.measurement >= noiseThreshold && d.noisePrediction >= confidenceThreshold) ? 'red' : 'black')
      .attr('cx', d => x(new Date(d.timestamp)))
      .attr('cy', d => y(d.measurement))
      .attr('r', 4);

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
      .data(noiseData)
      .enter().append('circle')
      .attr('class', 'dot-overlay')
      .attr('cx', d => x(new Date(d.timestamp)))
      .attr('cy', d => y(d.measurement))
      .attr('r', 10)
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .95);
        tooltip.html(`Timestamp: ${d3.timeFormat('%Y-%m-%d %H:%M:%S')(new Date(d.timestamp))}<br/>Measurement: ${d.measurement}<br/> Confidence: ${d.noisePrediction}`)
          .style('left', `${event.pageX - 260}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    d3.select(yAxisRef.current).selectAll('*').remove();
    const yAxis = d3.axisLeft(y)
      .tickValues([-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0]);

    d3.select(yAxisRef.current)
      .attr('width', margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left - 1},${margin.top})`)
      .call(yAxis);

    d3.select(yAxisRef.current)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('dB Level');

  }, [dimensions, noiseData, noiseThreshold, confidenceThreshold]);

  // Scroll to the right when the component is mounted to see the latest data
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollLeft = scrollableDivRef.current.scrollWidth + 1000;
    }
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <svg ref={yAxisRef} className="absolute left-0 top-0"></svg>
      <div className="overflow-x-scroll h-full ml-10" ref={scrollableDivRef}>
        <svg ref={mainChartRef} className="block h-full -ml-10"></svg>
      </div>
    </div>
  );
};

export default NoiseChart;
