import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as d3Tip from 'd3-tip';
import ResizeObserver from 'resize-observer-polyfill';

function generateMockData(numPoints: number) {
  const data = [];
  const startDate = new Date().getTime(); // current timestamp

  for (let i = 0; i < numPoints; i++) {
    const timestamp = new Date(startDate - i * 1000 * 60 * 10); // every 10 minutes
    const dBValue = Math.floor(Math.random() * 81) + 20; // dB value between 20 and 100
    const confidence = parseFloat(Math.random().toFixed(4));
    data.push({
      timestamp: timestamp.toISOString(),
      dB: dBValue,
      confidence: confidence,
    });
  }

  return data;
}

interface DataItem {
  timestamp: string;
  dB: number;
  confidence: number;
}

interface NoiseChartProps {
  noiseThreshold: number;
  confidenceThreshold: number;
}

const NoiseChart: React.FC<NoiseChartProps> = ({ noiseThreshold, confidenceThreshold }) => {
  const mockData = generateMockData(250);
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
    const fullWidth = 10 * mockData.length;
  
    d3.select(mainChartRef.current).selectAll('*').remove();

    const svg = d3.select(mainChartRef.current)
      .attr('width', fullWidth + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain([new Date(mockData[mockData.length - 1].timestamp), new Date(mockData[0].timestamp)])
      .range([0, fullWidth]);

    const y = d3.scaleLinear()
      .domain([0, 120])
      .range([height, 0]);

    const line = d3.line<DataItem>()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.dB));

    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeHour.every(2))
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
      .datum(mockData)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    svg.selectAll('.dot')
      .data(mockData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('stroke', 'black')
      .attr('fill', d => (d.dB >= noiseThreshold && d.confidence >= confidenceThreshold) ? 'red' : 'black')
      .attr('cx', d => x(new Date(d.timestamp)))
      .attr('cy', d => y(d.dB))
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
      .data(mockData)
      .enter().append('circle')
      .attr('class', 'dot-overlay')
      .attr('cx', d => x(new Date(d.timestamp)))
      .attr('cy', d => y(d.dB))
      .attr('r', 10)
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .95);
        tooltip.html(`Timestamp: ${d3.timeFormat('%Y-%m-%d %H:%M')(new Date(d.timestamp))}<br/>dB: ${d.dB}<br/>${d.dB > noiseThreshold ? ' Confidence: ' + d.confidence : ''}`)
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
      .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);

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

  }, [dimensions, mockData, noiseThreshold, confidenceThreshold]);

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
