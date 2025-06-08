import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, useTheme } from '@mui/material';
import type { DataPoint } from '../../types';

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showCVEs?: boolean;
  showAdvisories?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 50, left: 60 },
  showCVEs = true,
  showAdvisories = true,
}) => {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, d => Math.max(
          showCVEs ? d.cves : 0, 
          showAdvisories ? d.advisories : 0
        )) as number * 1.1
      ])
      .range([innerHeight, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(data.length, 7))
      .tickFormat((d) => {
        // Handle both Date and NumberValue types
        return d instanceof Date ? d3.timeFormat('%b %d')(d) : '';
      });
    
    const yAxis = d3.axisLeft(yScale);

    // Add axes to chart
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g').attr('class', 'y-axis').call(yAxis);

    // Add grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    // Create line generators
    const cveLine = d3
      .line<DataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.cves))
      .curve(d3.curveMonotoneX);

    const advisoryLine = d3
      .line<DataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.advisories))
      .curve(d3.curveMonotoneX);

    // Add lines to chart
    if (showCVEs) {
      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', theme.palette.error.main)
        .attr('stroke-width', 2)
        .attr('d', cveLine)
        .attr('class', 'line-cves')
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);
    }

    if (showAdvisories) {
      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', theme.palette.info.main)
        .attr('stroke-width', 2)
        .attr('d', advisoryLine)
        .attr('class', 'line-advisories')
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);
    }

    // Create tooltip with enhanced styling
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(255, 255, 255, 0.95)')
      .style('color', '#333')
      .style('padding', '12px')
      .style('border-radius', '6px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('box-shadow', '0 3px 14px rgba(0, 0, 0, 0.15)')
      .style('border', '1px solid #ddd')
      .style('z-index', '1000');

    // Add interactive dots
    const dots = svg
      .selectAll('.dot-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'dot-group');

    if (showCVEs) {
      dots
        .append('circle')
        .attr('class', 'dot-cve')
        .attr('cx', d => xScale(new Date(d.timestamp)))
        .attr('cy', d => yScale(d.cves))
        .attr('r', 4)
        .attr('fill', theme.palette.error.main)
        .style('opacity', 0)
        .transition()
        .delay((_, i) => i * 50)
        .duration(500)
        .style('opacity', 1);
    }

    if (showAdvisories) {
      dots
        .append('circle')
        .attr('class', 'dot-advisory')
        .attr('cx', d => xScale(new Date(d.timestamp)))
        .attr('cy', d => yScale(d.advisories))
        .attr('r', 4)
        .attr('fill', theme.palette.info.main)
        .style('opacity', 0)
        .transition()
        .delay((_, i) => i * 50)
        .duration(500)
        .style('opacity', 1);
    }

    // Add hover interaction
    svg
      .selectAll<SVGElement, DataPoint>('.dot-group')
      .on('mouseover', function(event: MouseEvent, d: DataPoint) {
        d3.select(this)
          .selectAll('circle')
          .transition()
          .duration(100)
          .attr('r', 6);

        const formatDate = d3.timeFormat('%B %d, %Y');
        const date = formatDate(new Date(d.timestamp));
        
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${date}</div>`;
        
        // Add CVEs with color indicator
        if (showCVEs) {
          const cveColor = theme.palette.error.main;
          tooltipContent += `<div style="display: flex; align-items: center; margin-bottom: 6px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${cveColor}; margin-right: 8px;"></div>
            <span><strong>CVEs:</strong> ${d.cves}</span>
          </div>`;
        }
        
        // Add Advisories with color indicator
        if (showAdvisories) {
          const advisoryColor = theme.palette.warning.main;
          tooltipContent += `<div style="display: flex; align-items: center;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${advisoryColor}; margin-right: 8px;"></div>
            <span><strong>Advisories:</strong> ${d.advisories}</span>
          </div>`;
        }
        
        // Add percentage change from previous day if available
        const index = data.findIndex(item => item.timestamp === d.timestamp);
        if (index > 0) {
          const prevDay = data[index - 1];
          if (showCVEs) {
            const cveChange = d.cves - prevDay.cves;
            const cveChangePercent = prevDay.cves > 0 ? ((cveChange / prevDay.cves) * 100).toFixed(1) : '0';
            const changeDirection = cveChange >= 0 ? '↑' : '↓';
            const changeColor = cveChange >= 0 ? 'red' : 'green';
            tooltipContent += `<div style="margin-top: 8px; font-size: 13px; color: ${changeColor}">
              CVEs ${Math.abs(cveChange)} ${changeDirection} (${Math.abs(Number(cveChangePercent))}% from previous)
            </div>`;
          }
        }
        
        tooltip
          .html(tooltipContent)
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 30}px`)
          .transition()
          .duration(200)
          .style('opacity', 0.9);
      })
      .on('mouseout', function() {
        d3.select(this)
          .selectAll('circle')
          .transition()
          .duration(100)
          .attr('r', 4);
          
        tooltip
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add labels
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.secondary)
      .text('Count');

    svg
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.secondary)
      .text('Date');

    // Clean up on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data, width, height, margin, showCVEs, showAdvisories, theme]);

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <svg ref={svgRef} />
    </Box>
  );
};

export default LineChart;
