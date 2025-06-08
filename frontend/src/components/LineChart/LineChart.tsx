import React, { useRef, useState, useEffect } from 'react';
import { useTheme, Box } from '@mui/material';
import type { DataPoint } from '../../types';
import { useD3LineChart } from '../../hooks/useD3LineChart';

interface LineChartProps {
  data: DataPoint[];
  initialWidth?: number;
  initialHeight?: number; 
  margin?: { top: number; right: number; bottom: number; left: number };
  showCVEs?: boolean;
  showAdvisories?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  initialWidth = 800,
  initialHeight = 400, 
  margin = { top: 20, right: 20, bottom: 50, left: 40 },
  showCVEs = true,
  showAdvisories = true,
}) => {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) {
      setDimensions({ width: initialWidth, height: initialHeight });
      return;
    }

    // Initial size calculation
    const { width } = currentContainer.getBoundingClientRect();
    const calculatedHeight = Math.max(300, Math.min(400, width * 0.6)); // Responsive height based on width
    setDimensions({ width, height: calculatedHeight });

    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) {
        return;
      }
      const { width } = entries[0].contentRect;
      if (width > 0) {
        // Adjust height based on width for better mobile experience
        const calculatedHeight = Math.max(300, Math.min(400, width * 0.6));
        setDimensions({ width, height: calculatedHeight });
      }
    });

    resizeObserver.observe(currentContainer);
    return () => resizeObserver.disconnect();
  }, [initialWidth, initialHeight]);

  useD3LineChart({
    data,
    svgRef,
    width: dimensions.width,
    height: dimensions.height,
    margin,
    showCVEs,
    showAdvisories,
    theme,
  });

  return (
    <Box ref={containerRef} sx={{ 
      width: '100%', 
      height: dimensions.height,
      overflow: 'hidden',
      position: 'relative',
      '& svg': {
        maxWidth: '100%',
        height: 'auto',
        filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.1))',
        '& path.line': {
          strokeWidth: 3,
          filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))',
        },
        '& .axis': {
          '& text': {
            fontWeight: 500,
            fontSize: '0.75rem',
          },
          '& line': {
            stroke: theme.palette.divider,
          },
          '& path': {
            stroke: theme.palette.divider,
          }
        },
        '& .grid line': {
          stroke: `${theme.palette.divider}`,
          strokeOpacity: 0.3,
          strokeDasharray: '3,3',
        },
        '& .tooltip': {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          padding: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          fontSize: '0.875rem',
          fontWeight: 500,
          '& .tooltip-date': {
            fontWeight: 600,
            marginBottom: '4px',
            color: theme.palette.text.primary,
          },
          '& .tooltip-value': {
            display: 'flex',
            alignItems: 'center',
            marginTop: '2px',
            '& .color-dot': {
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              marginRight: '6px',
            },
          },
        },
        '& .legend': {
          '& text': {
            fontWeight: 500,
            fontSize: '0.75rem',
          },
        },
      }
    }}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ 
          display: 'block',
          overflow: 'visible',
        }}
      />
      
      {/* Decorative elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%)',
          zIndex: 0,
          opacity: 0.6,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(244,67,54,0.1) 0%, rgba(244,67,54,0.05) 100%)',
          zIndex: 0,
          opacity: 0.6,
        }}
      />
    </Box>
  );
};

export default LineChart;