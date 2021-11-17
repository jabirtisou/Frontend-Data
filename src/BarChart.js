import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const chart = useRef(null);

  useEffect(() => {
    d3.select(chart.current).selectAll('*').remove();

    const margin = { top: 40, bottom: 40, left: 120, right: 20 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(chart.current)
      .append('svg')
      .style('background-color', '#262830')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, height])
      .padding(0.4);

    svg.append('g').call(d3.axisLeft(y));

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.dollar_price)])
      .range([0, width])
      .nice();
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    const rects = svg.selectAll('rect').data(data);

    rects
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => y(d.name))
      .merge(rects)
      .transition()
      .duration(1000)
      .attr('x', (d) => x(0))
      .attr('y', (d) => y(d.name))
      .attr('width', (d) => x(d.dollar_price))
      .attr('height', y.bandwidth())
      .attr('fill', '#f7f7f7')
      .attr('stroke', '#fff')
      .attr('stroke-width', '0.5px');

    rects.exit().remove();
  }, [data]);

  return <div ref={chart}></div>;
};

export default BarChart;
