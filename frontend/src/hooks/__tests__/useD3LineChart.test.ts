import { renderHook } from '@testing-library/react';
import * as d3 from 'd3';
import { createTheme } from '@mui/material/styles';
import { useD3LineChart } from '../useD3LineChart';
import type { DataPoint } from '../../types';

// Using the global d3 mock from __mocks__/d3.js
jest.mock('d3');

describe('useD3LineChart', () => {
  const theme = createTheme();
  const mockData: DataPoint[] = [
    { timestamp: '2023-01-01T00:00:00Z', cves: 10, advisories: 5 },
    { timestamp: '2023-01-02T00:00:00Z', cves: 15, advisories: 8 },
    { timestamp: '2023-01-03T00:00:00Z', cves: 20, advisories: 11 },
  ];

  const mockSvgRef = {
    current: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render chart if svgRef is null', () => {
    renderHook(() =>
      useD3LineChart({
        data: mockData,
        svgRef: { current: null },
        width: 800,
        height: 400,
        margin: { top: 20, right: 30, bottom: 50, left: 50 },
        showCVEs: true,
        showAdvisories: true,
        theme,
      })
    );

    expect(d3.select).not.toHaveBeenCalled();
  });

  it('should not render chart if data is empty', () => {
    renderHook(() =>
      useD3LineChart({
        data: [],
        svgRef: mockSvgRef,
        width: 800,
        height: 400,
        margin: { top: 20, right: 30, bottom: 50, left: 50 },
        showCVEs: true,
        showAdvisories: true,
        theme,
      })
    );

    expect(d3.select).toHaveBeenCalled();
    expect(d3.scaleTime).not.toHaveBeenCalled();
  });

  it('should render chart with both CVEs and Advisories when both are enabled', () => {
    renderHook(() =>
      useD3LineChart({
        data: mockData,
        svgRef: mockSvgRef,
        width: 800,
        height: 400,
        margin: { top: 20, right: 30, bottom: 50, left: 50 },
        showCVEs: true,
        showAdvisories: true,
        theme,
      })
    );

    expect(d3.select).toHaveBeenCalled();
    expect(d3.scaleTime).toHaveBeenCalled();
    expect(d3.scaleLinear).toHaveBeenCalled();
    expect(d3.axisBottom).toHaveBeenCalled();
    expect(d3.axisLeft).toHaveBeenCalled();
    expect(d3.line).toHaveBeenCalled();
    expect(d3.extent).toHaveBeenCalled();
    expect(d3.max).toHaveBeenCalled();
  });

  it('should only render CVEs when advisories are disabled', () => {
    renderHook(() =>
      useD3LineChart({
        data: mockData,
        svgRef: mockSvgRef,
        width: 800,
        height: 400,
        margin: { top: 20, right: 30, bottom: 50, left: 50 },
        showCVEs: true,
        showAdvisories: false,
        theme,
      })
    );

    expect(d3.max).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function)
    );
    expect(d3.line).toHaveBeenCalledTimes(1);
  });

  it('should only render Advisories when CVEs are disabled', () => {
    renderHook(() =>
      useD3LineChart({
        data: mockData,
        svgRef: mockSvgRef,
        width: 800,
        height: 400,
        margin: { top: 20, right: 30, bottom: 50, left: 50 },
        showCVEs: false,
        showAdvisories: true,
        theme,
      })
    );

    expect(d3.max).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function)
    );
    
    expect(d3.line).toHaveBeenCalledTimes(1);
  });

  it('should update chart when dimensions change', () => {
    const { rerender } = renderHook(
      (props) => useD3LineChart(props),
      {
        initialProps: {
          data: mockData,
          svgRef: mockSvgRef,
          width: 800,
          height: 400,
          margin: { top: 20, right: 30, bottom: 50, left: 50 },
          showCVEs: true,
          showAdvisories: true,
          theme,
        },
      }
    );

    // Clear mocks to track new calls
    jest.clearAllMocks();

    // Rerender with different dimensions
    rerender({
      data: mockData,
      svgRef: mockSvgRef,
      width: 1000,
      height: 500,
      margin: { top: 20, right: 30, bottom: 50, left: 50 },
      showCVEs: true,
      showAdvisories: true,
      theme,
    });
    expect(d3.select).toHaveBeenCalled();
    expect(d3.scaleTime).toHaveBeenCalled();
    expect(d3.scaleLinear).toHaveBeenCalled();
  });

  it('should sort data by timestamp', () => {
    const unsortedData: DataPoint[] = [
      { timestamp: '2023-01-03T00:00:00Z', cves: 20, advisories: 11 },
      { timestamp: '2023-01-01T00:00:00Z', cves: 10, advisories: 5 },
      { timestamp: '2023-01-02T00:00:00Z', cves: 15, advisories: 8 },
    ];

    renderHook(() =>
      useD3LineChart({
        data: unsortedData,
        svgRef: mockSvgRef,
        width: 800,
        height: 400,
        margin: { top: 20, right: 30, bottom: 50, left: 50 },
        showCVEs: true,
        showAdvisories: true,
        theme,
      })
    );
    expect(d3.extent).toHaveBeenCalled();
  });
});
