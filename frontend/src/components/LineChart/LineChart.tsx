import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme, Box } from '@mui/material';
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
    if (!svgRef.current) return;

    // Ensure data is sorted by timestamp for accurate bisector performance
    const sortedData = data && data.length > 0
      ? [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      : [];

    // Clear any existing chart and tooltips
    d3.select(svgRef.current).selectAll('*').remove();
    d3.select('body').selectAll('.d3-tooltip').remove();

    if (sortedData.length === 0) {
      return; // No data to render
    }

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(sortedData, (d: DataPoint) => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(sortedData, (d: DataPoint) => Math.max(
          showCVEs ? d.cves : 0,
          showAdvisories ? d.advisories : 0
        )) as number * 1.1 || 10 // Fallback if max is 0
      ])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(sortedData.length, 7))
      .tickFormat(d => (d instanceof Date ? d3.timeFormat('%b %d')(d) : ''));

    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g').attr('class', 'y-axis').call(yAxis);

    const legendData = [
      { label: 'CVEs', color: theme.palette.error.main, enabled: showCVEs },
      { label: 'Advisories', color: theme.palette.warning.main, enabled: showAdvisories },
    ].filter(item => item.enabled);

    const legend = svg.append('g').attr('class', 'legend').attr('transform', `translate(${innerWidth - 120},0)`);
    legendData.forEach((item, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
      legendRow.append('rect').attr('width', 10).attr('height', 10).attr('fill', item.color);
      legendRow.append('text').attr('x', 15).attr('y', 10).attr('text-anchor', 'start').style('font-size', '12px').style('fill', theme.palette.text.primary).text(item.label);
    });

    svg.append('g').attr('class', 'grid').call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => '')).style('stroke-dasharray', '3,3').style('stroke-opacity', 0.2);

    const lineGenerator = (yAccessor: (d: DataPoint) => number) => d3.line<DataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(yAccessor(d)))
      .curve(d3.curveMonotoneX);

    if (showCVEs) {
      svg.append('path').datum(sortedData).attr('fill', 'none').attr('stroke', theme.palette.error.main).attr('stroke-width', 2).attr('d', lineGenerator(d => d.cves)).attr('class', 'line-cves').style('opacity', 0).transition().duration(1000).style('opacity', 1);
    }
    if (showAdvisories) {
      svg.append('path').datum(sortedData).attr('fill', 'none').attr('stroke', theme.palette.warning.main).attr('stroke-width', 2).attr('d', lineGenerator(d => d.advisories)).attr('class', 'line-advisories').style('opacity', 0).transition().duration(1000).style('opacity', 1);
    }

    const tooltip = d3.select('body').append('div').attr('class', 'd3-tooltip').style('position', 'absolute').style('background-color', 'rgba(255, 255, 255, 0.95)').style('color', '#333').style('padding', '12px').style('border-radius', '6px').style('font-size', '14px').style('pointer-events', 'none').style('opacity', 0).style('box-shadow', '0 3px 14px rgba(0,0,0,0.15)').style('border', '1px solid #ddd').style('z-index', '1000');

    const dotsContainer = svg.append('g').attr('class', 'dots-container');

    if (showCVEs) {
      dotsContainer.selectAll('.dot-cve').data(sortedData).enter().append('circle').attr('class', 'dot-cve').attr('cx', d => xScale(new Date(d.timestamp))).attr('cy', d => yScale(d.cves)).attr('r', 5).attr('fill', theme.palette.error.main).attr('data-timestamp', d => d.timestamp).style('opacity', 1);
    }
    if (showAdvisories) {
      dotsContainer.selectAll('.dot-advisory').data(sortedData).enter().append('circle').attr('class', 'dot-advisory').attr('cx', d => xScale(new Date(d.timestamp))).attr('cy', d => yScale(d.advisories)).attr('r', 5).attr('fill', theme.palette.warning.main).attr('data-timestamp', d => d.timestamp).style('opacity', 1);
    }

    svg.append('rect').attr('width', innerWidth).attr('height', innerHeight).style('fill', 'none').style('pointer-events', 'all')
      .on('mousemove', function (event: MouseEvent) {
        const [xPos] = d3.pointer(event, this);
        const mouseDate = xScale.invert(xPos);
        const bisect = d3.bisector((d: DataPoint) => new Date(d.timestamp)).left;
        const index = bisect(sortedData, mouseDate, 1);

        let closestDataPoint: DataPoint;
        if (index >= sortedData.length) {
            closestDataPoint = sortedData[sortedData.length - 1];
        } else if (index === 0) {
            closestDataPoint = sortedData[0];
        } else {
            const d0 = sortedData[index - 1];
            const d1 = sortedData[index];
            closestDataPoint = (mouseDate.getTime() - new Date(d0.timestamp).getTime()) > (new Date(d1.timestamp).getTime() - mouseDate.getTime()) ? d1 : d0;
        }

        svg.selectAll('.dot-cve, .dot-advisory').style('opacity', 0.5).attr('r', 5);
        svg.selectAll(`.dot-cve[data-timestamp="${closestDataPoint.timestamp}"], .dot-advisory[data-timestamp="${closestDataPoint.timestamp}"]`).style('opacity', 1).attr('r', 7);

        const formatDate = d3.timeFormat('%B %d, %Y');
        const dateStr = formatDate(new Date(closestDataPoint.timestamp));
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${dateStr}</div>`;
        if (showCVEs) {
          tooltipContent += `<div style="display: flex; align-items: center; margin-bottom: 6px;"><div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${theme.palette.error.main}; margin-right: 8px;"></div><span><strong>CVEs:</strong> ${closestDataPoint.cves}</span></div>`;
        }
        if (showAdvisories) {
          tooltipContent += `<div style="display: flex; align-items: center;"><div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${theme.palette.warning.main}; margin-right: 8px;"></div><span><strong>Advisories:</strong> ${closestDataPoint.advisories}</span></div>`;
        }

        const dataIndex = sortedData.findIndex(item => item.timestamp === closestDataPoint.timestamp);
        if (dataIndex > 0) {
          const prevDay = sortedData[dataIndex - 1];
          if (showCVEs && prevDay) {
            const cveChange = closestDataPoint.cves - prevDay.cves;
            const cveChangePercent = prevDay.cves > 0 ? ((cveChange / prevDay.cves) * 100).toFixed(1) : (cveChange > 0 ? '100.0' : '0');
            const changeDirection = cveChange >= 0 ? '↑' : '↓';
            const changeColor = cveChange > 0 ? 'red' : (cveChange < 0 ? 'green' : 'grey');
            tooltipContent += `<div style="margin-top: 8px; font-size: 13px; color: ${changeColor}">CVEs ${Math.abs(cveChange)} ${changeDirection} (${Math.abs(Number(cveChangePercent))}% from previous)</div>`;
          }
        }
        tooltip.html(tooltipContent).style('left', `${event.pageX + 15}px`).style('top', `${event.pageY - 30}px`).transition().duration(200).style('opacity', 0.9);
      })
      .on('mouseout', function () {
        svg.selectAll('.dot-cve, .dot-advisory').style('opacity', 1).attr('r', 5);
        tooltip.transition().duration(500).style('opacity', 0);
      });


    svg.append('text').attr('transform', 'rotate(-90)').attr('y', 0 - margin.left).attr('x', 0 - innerHeight / 2).attr('dy', '1em').style('text-anchor', 'middle').style('font-size', '12px').style('fill', theme.palette.text.secondary).text('Count');
    svg.append('text').attr('x', innerWidth / 2).attr('y', innerHeight + margin.bottom - 10).style('text-anchor', 'middle').style('font-size', '12px').style('fill', theme.palette.text.secondary).text('Date');

    return () => {
      d3.select('body').selectAll('.d3-tooltip').remove();
    };
  }, [data, width, height, margin, showCVEs, showAdvisories, theme]);

  return (
    <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <svg ref={svgRef} />
    </Box>
  );
};

export default LineChart;