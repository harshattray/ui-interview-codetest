import React, { useRef } from 'react';
import { useTheme, Box } from '@mui/material';
import type { DataPoint } from '../../types';
import { useD3LineChart } from '../../hooks/useD3LineChart';

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

  useD3LineChart({
    data,
    svgRef,
    width,
    height,
    margin,
    showCVEs,
    showAdvisories,
    theme,
  });

  return (
    <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </Box>
  );
};

export default LineChart;