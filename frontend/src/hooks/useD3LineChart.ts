import { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import type { Theme } from '@mui/material/styles';
import type { DataPoint } from '../types';

interface UseD3LineChartProps {
  data: DataPoint[];
  svgRef: React.RefObject<SVGSVGElement | null>;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  showCVEs: boolean;
  showAdvisories: boolean;
  theme: Theme;
}

const renderD3Legend = (
  svgG: d3.Selection<SVGGElement, unknown, null, undefined>,
  legendItems: Array<{ label: string; color: string }>,
  theme: Theme,
  innerWidth: number
) => {
  const legend = svgG
    .append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${innerWidth - 120},0)`);
  legendItems.forEach((item, i) => {
    const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
    legendRow.append('rect').attr('width', 10).attr('height', 10).attr('fill', item.color);
    legendRow
      .append('text')
      .attr('x', 15)
      .attr('y', 10)
      .attr('text-anchor', 'start')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.primary)
      .text(item.label);
  });
};

/**
 * Custom hook for rendering a D3 line chart with performance optimizations for large datasets
 * @param props - The props for the D3 line chart
 */
export const useD3LineChart = ({
  data,
  svgRef,
  width,
  height,
  margin,
  showCVEs,
  showAdvisories,
  theme,
}: UseD3LineChartProps) => {
  // Memoize data processing to avoid redundant calculations on re-renders
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Sort data by timestamp to ensure correct rendering
    const sortedData = [...data].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Sample data if there are too many points (improves performance)
    if (sortedData.length > 100) {
      const sampleRate = Math.ceil(sortedData.length / 100);
      return sortedData.filter((_, i) => i % sampleRate === 0 || i === sortedData.length - 1);
    }

    return sortedData;
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !processedData.length) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Use the processed data for the chart
    const chartData = processedData;

    // Clear previous chart elements
    d3.select(svgRef.current).selectAll('*').remove();
    d3.select('body').selectAll('.d3-tooltip').remove();

    if (chartData.length === 0) {
      return;
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
      .domain(d3.extent(chartData, (d: DataPoint) => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        (d3.max(chartData, (d: DataPoint) =>
          Math.max(showCVEs ? d.cves : 0, showAdvisories ? d.advisories : 0)
        ) as number) * 1.1 || 10,
      ])
      .range([innerHeight, 0]);

    // Optimize tick count based on available width
    const tickCount = Math.max(2, Math.min(chartData.length, Math.floor(innerWidth / 80)));
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(tickCount)
      .tickFormat(d => (d instanceof Date ? d3.timeFormat('%b %d')(d) : ''));

    const yAxis = d3.axisLeft(yScale);

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

    const activeLegendData = [
      { label: 'CVEs', color: theme.palette.error.main, enabled: showCVEs },
      { label: 'Advisories', color: theme.palette.warning.main, enabled: showAdvisories },
    ].filter(item => item.enabled);

    if (activeLegendData.length > 0) {
      renderD3Legend(svg, activeLegendData, theme, innerWidth);
    }

    // Add ARIA-accessible grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('aria-hidden', 'true') // Hide from screen readers since it's decorative
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    const lineGenerator = (yAccessor: (d: DataPoint) => number) =>
      d3
        .line<DataPoint>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yScale(yAccessor(d)))
        .curve(d3.curveMonotoneX);

    // Create a clipPath to ensure lines don't render outside the chart area
    svg
      .append('clipPath')
      .attr('id', 'chart-area-clip')
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    const chartArea = svg.append('g').attr('clip-path', 'url(#chart-area-clip)');

    // Render lines with optimized transitions
    if (showCVEs) {
      const cveLine = chartArea
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', theme.palette.error.main)
        .attr('stroke-width', 2)
        .attr('class', 'line-cves')
        .style('opacity', 0);

      // Use attrTween for smoother line animation
      const cveLineGenerator = lineGenerator(d => d.cves);
      cveLine.attr('d', cveLineGenerator).transition().duration(1000).style('opacity', 1);
    }

    if (showAdvisories) {
      const advisoriesLine = chartArea
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', theme.palette.warning.main)
        .attr('stroke-width', 2)
        .attr('class', 'line-advisories')
        .style('opacity', 0);

      // Use attrTween for smoother line animation
      const advisoriesLineGenerator = lineGenerator(d => d.advisories);
      advisoriesLine
        .attr('d', advisoriesLineGenerator)
        .transition()
        .duration(1000)
        .style('opacity', 1);
    }

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
      .style('box-shadow', '0 3px 14px rgba(0,0,0,0.15)')
      .style('border', '1px solid #ddd')
      .style('z-index', '1000');

    // Only render dots if we have a reasonable number of data points
    // This significantly improves performance with large datasets
    const shouldRenderDots = chartData.length <= 50;

    if (shouldRenderDots) {
      const dotsContainer = svg
        .append('g')
        .attr('class', 'dots-container')
        .attr('clip-path', 'url(#chart-area-clip)');

      if (showCVEs) {
        dotsContainer
          .selectAll('.dot-cve')
          .data(chartData)
          .enter()
          .append('circle')
          .attr('class', 'dot-cve')
          .attr('cx', d => xScale(new Date(d.timestamp)))
          .attr('cy', d => yScale(d.cves))
          .attr('r', 5)
          .attr('fill', theme.palette.error.main)
          .attr('data-timestamp', d => d.timestamp)
          .style('opacity', 1);
      }

      if (showAdvisories) {
        dotsContainer
          .selectAll('.dot-advisory')
          .data(chartData)
          .enter()
          .append('circle')
          .attr('class', 'dot-advisory')
          .attr('cx', d => xScale(new Date(d.timestamp)))
          .attr('cy', d => yScale(d.advisories))
          .attr('r', 5)
          .attr('fill', theme.palette.warning.main)
          .attr('data-timestamp', d => d.timestamp)
          .style('opacity', 1);
      }
    }

    // Create an overlay for better mouse and keyboard interaction with data points
    // This makes it easier to hover over points even with dense data
    svg
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('tabindex', 0) // Make focusable for keyboard navigation
      .attr('aria-label', 'Interactive chart. Use arrow keys to navigate data points')
      .attr('role', 'application')
      .on('mousemove', function (event: MouseEvent) {
        const [xPos] = d3.pointer(event, this);
        const mouseDate = xScale.invert(xPos);
        const bisect = d3.bisector((d: DataPoint) => new Date(d.timestamp)).left;
        const index = bisect(chartData, mouseDate, 1);

        let closestDataPoint: DataPoint;
        if (index >= chartData.length) {
          closestDataPoint = chartData[chartData.length - 1];
        } else if (index === 0) {
          closestDataPoint = chartData[0];
        } else {
          const d0 = chartData[index - 1];
          const d1 = chartData[index];
          closestDataPoint =
            mouseDate.getTime() - new Date(d0.timestamp).getTime() >
            new Date(d1.timestamp).getTime() - mouseDate.getTime()
              ? d1
              : d0;
        }

        svg.selectAll('.dot-cve, .dot-advisory').style('opacity', 0.5).attr('r', 5);
        svg
          .selectAll(
            `.dot-cve[data-timestamp="${closestDataPoint.timestamp}"], .dot-advisory[data-timestamp="${closestDataPoint.timestamp}"]`
          )
          .style('opacity', 1)
          .attr('r', 7);

        const formatDate = d3.timeFormat('%B %d, %Y');
        const dateStr = formatDate(new Date(closestDataPoint.timestamp));
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${dateStr}</div>`;
        if (showCVEs) {
          tooltipContent += `<div style="display: flex; align-items: center; margin-bottom: 6px;"><div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${theme.palette.error.main}; margin-right: 8px;"></div><span><strong>CVEs:</strong> ${closestDataPoint.cves}</span></div>`;
        }
        if (showAdvisories) {
          tooltipContent += `<div style="display: flex; align-items: center;"><div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${theme.palette.warning.main}; margin-right: 8px;"></div><span><strong>Advisories:</strong> ${closestDataPoint.advisories}</span></div>`;
        }

        const dataIndex = chartData.findIndex(
          (item: DataPoint) => item.timestamp === closestDataPoint.timestamp
        );
        if (dataIndex > 0) {
          const prevDay = chartData[dataIndex - 1];
          if (showCVEs && prevDay) {
            const cveChange = closestDataPoint.cves - prevDay.cves;
            const cveChangePercent =
              prevDay.cves > 0
                ? ((cveChange / prevDay.cves) * 100).toFixed(1)
                : cveChange > 0
                  ? '100.0'
                  : '0';
            const changeDirection = cveChange >= 0 ? '↑' : '↓';
            const changeColor = cveChange > 0 ? 'red' : cveChange < 0 ? 'green' : 'grey';
            tooltipContent += `<div style="margin-top: 8px; font-size: 13px; color: ${changeColor}">CVEs ${Math.abs(cveChange)} ${changeDirection} (${Math.abs(Number(cveChangePercent))}% from previous)</div>`;
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
      .on('mouseout', function () {
        svg.selectAll('.dot-cve, .dot-advisory').style('opacity', 1).attr('r', 5);
        tooltip.transition().duration(500).style('opacity', 0);
      })
      // Add keyboard navigation support for accessibility
      .on('focus', function () {
        // Show instructions for keyboard users
        tooltip
          .html('Use arrow keys to navigate between data points')
          .style('left', '50%')
          .style('top', '10px')
          .style('transform', 'translateX(-50%)')
          .transition()
          .duration(200)
          .style('opacity', 0.9);
      })
      .on('blur', function () {
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .on('keydown', function (event: KeyboardEvent) {
        // Handle keyboard navigation
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();

          // Find the currently focused data point or start with the first one
          let currentIndex = 0;
          const focusedPoint = svg.select(
            '.dot-cve[data-focused="true"], .dot-advisory[data-focused="true"]'
          );

          if (!focusedPoint.empty()) {
            const timestamp = focusedPoint.attr('data-timestamp');
            currentIndex = chartData.findIndex((d: DataPoint) => d.timestamp === timestamp);
          }

          // Calculate the next index based on arrow key
          let nextIndex = currentIndex;
          if (event.key === 'ArrowRight' && currentIndex < chartData.length - 1) {
            nextIndex = currentIndex + 1;
          } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
            nextIndex = currentIndex - 1;
          }

          // Update the focus state
          if (nextIndex !== currentIndex) {
            const nextDataPoint = chartData[nextIndex];

            // Reset all points
            svg
              .selectAll('.dot-cve, .dot-advisory')
              .style('opacity', 0.5)
              .attr('r', 5)
              .attr('data-focused', null);

            // Highlight the selected point
            svg
              .selectAll(
                `.dot-cve[data-timestamp="${nextDataPoint.timestamp}"], .dot-advisory[data-timestamp="${nextDataPoint.timestamp}"]`
              )
              .style('opacity', 1)
              .attr('r', 7)
              .attr('data-focused', 'true');

            // Show tooltip for the selected point
            const formatDate = d3.timeFormat('%B %d, %Y');
            const dateStr = formatDate(new Date(nextDataPoint.timestamp));
            let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${dateStr}</div>`;

            if (showCVEs) {
              tooltipContent += `<div style="display: flex; align-items: center; margin-bottom: 6px;"><div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${theme.palette.error.main}; margin-right: 8px;"></div><span><strong>CVEs:</strong> ${nextDataPoint.cves}</span></div>`;
            }

            if (showAdvisories) {
              tooltipContent += `<div style="display: flex; align-items: center;"><div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${theme.palette.warning.main}; margin-right: 8px;"></div><span><strong>Advisories:</strong> ${nextDataPoint.advisories}</span></div>`;
            }

            tooltip
              .html(tooltipContent)
              .style('left', `${xScale(new Date(nextDataPoint.timestamp)) + margin.left + 15}px`)
              .style('top', '50%')
              .transition()
              .duration(200)
              .style('opacity', 0.9);
          }
        }
      });

    // Add accessible axis labels with ARIA attributes
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - innerHeight / 2)
      .attr('dy', '1em')
      .attr('id', 'y-axis-label')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.secondary)
      .text('Count');

    svg
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('id', 'x-axis-label')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.secondary)
      .text('Date');

    // Add ARIA descriptions for screen readers
    svg
      .selectAll('.y-axis')
      .attr('aria-labelledby', 'y-axis-label')
      .attr('role', 'graphics-symbol');

    svg
      .selectAll('.x-axis')
      .attr('aria-labelledby', 'x-axis-label')
      .attr('role', 'graphics-symbol');

    // Add accessibility attributes instead of visible title
    svg.attr('aria-label', 'Security Metrics Time Series Chart');

    svg
      .append('desc')
      .text(
        `This chart shows ${showCVEs ? 'CVEs' : ''}${showCVEs && showAdvisories ? ' and ' : ''}${showAdvisories ? 'Advisories' : ''} over time.`
      );

    return () => {
      d3.select('body').selectAll('.d3-tooltip').remove();
    };
  }, [processedData, svgRef, width, height, margin, showCVEs, showAdvisories, theme]);
};
