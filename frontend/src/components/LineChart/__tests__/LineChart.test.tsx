import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LineChart from '../LineChart';
import { useD3LineChart } from '../../../hooks/useD3LineChart';
import '@testing-library/jest-dom';

// Mock the useD3LineChart hook
jest.mock('../../../hooks/useD3LineChart');

describe('LineChart', () => {
  const theme = createTheme();
  const mockData = [
    { timestamp: '2023-01-01T00:00:00Z', cves: 10, advisories: 5 },
    { timestamp: '2023-01-02T00:00:00Z', cves: 15, advisories: 8 },
  ];

  beforeEach(() => {
    (useD3LineChart as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <LineChart data={mockData} initialWidth={800} initialHeight={400} {...props} />
      </ThemeProvider>
    );
  };

  it('renders an SVG element', () => {
    renderComponent();
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('calls useD3LineChart with correct parameters', () => {
    renderComponent({
      showCVEs: true,
      showAdvisories: false,
    });

    // Check if useD3LineChart was called with the expected parameters
    expect(useD3LineChart).toHaveBeenCalled();

    // Get the first call arguments
    const callArgs = (useD3LineChart as jest.Mock).mock.calls[0][0];

    // Verify individual properties instead of the entire object
    expect(callArgs.data).toEqual(mockData);
    expect(callArgs.showCVEs).toBe(true);
    expect(callArgs.showAdvisories).toBe(false);
    expect(callArgs.theme).toBeDefined();
  });

  it('sets initial dimensions correctly', () => {
    // Instead of checking the SVG attributes directly, we should check that
    // useD3LineChart was called with the correct dimensions
    renderComponent({
      initialWidth: 1000,
      initialHeight: 500,
    });

    // Verify that useD3LineChart was called
    expect(useD3LineChart).toHaveBeenCalled();

    // Get the first call arguments and check the width and height
    const callArgs = (useD3LineChart as jest.Mock).mock.calls[0][0];
    expect(callArgs.width).toBe(1000);
    expect(callArgs.height).toBe(500);
  });

  it('uses default values for optional props', () => {
    renderComponent({
      initialWidth: undefined,
      initialHeight: undefined,
      showCVEs: undefined,
      showAdvisories: undefined,
    });

    expect(useD3LineChart).toHaveBeenCalledWith(
      expect.objectContaining({
        showCVEs: true,
        showAdvisories: true,
      })
    );
  });
});
