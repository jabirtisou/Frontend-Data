import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const WorldMap = ({ data, countries }) => {
  const map = useRef(null);
  useEffect(() => {
    d3.select(map.current).selectAll('*').remove();

    const margin = { top: 40, bottom: 40, left: 120, right: 20 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const prices = Object.assign(
      {},
      ...countries.map((d) => ({ [d.name]: d.dollar_price }))
    );

    const priceMap = new Map(Object.entries(prices));

    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 1.3 / Math.PI)
      .center([-5, 20])
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const tooltip = d3
      .select(map.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', '1px solid gray')
      .style('border-radius', '5px')
      .style('color', 'black')
      .style('padding', '5px')
      .style('position', 'absolute')
      .style('opacity', 0);

    const svg = d3
      .select(map.current)
      .append('svg')
      .style('background-color', '#262830')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

    const paths = svg.append('g').selectAll('path').data(data.features);

    paths
      .enter()
      .append('path')
      .attr('d', path)
      .merge(paths)
      .attr('fill', (d) =>
        priceMap.get(d.properties.name) ? 'orange' : '#262830'
      )
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', function (e, d) {
        tooltip.transition().duration(200).style('opacity', 0.9);

        d3.select(this)
          .style('fill', (d) =>
            priceMap.get(d.properties.name) ? 'orange' : '#262830'
          )
          .style('opacity', 0.4);

        tooltip
          .html(
            `<div>${d.properties.name}: <span class='tooltip-value'>${
              priceMap.get(d.properties.name)
                ? '$' + priceMap.get(d.properties.name)
                : 'N/A'
            }</span></div>`
          )
          .style('left', e.pageX - 20 + 'px')
          .style('top', e.pageY - 50 + 'px');
      })
      .on('mousemove', function (e, d) {
        tooltip
          .style('left', e.pageX - 20 + 'px')
          .style('top', e.pageY - 50 + 'px');
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('fill', (d) =>
            priceMap.get(d.properties.name) ? 'orange' : '#262830'
          )
          .style('opacity', 1);

        tooltip.transition().duration(500).style('opacity', 0);
      });

    paths.exit().remove();
  }, [data, countries]);

  return <div ref={map}></div>;
};

export default WorldMap;
