import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ExportButton from '../ExportButton';
import * as dashboardUtils from '../../../utils/dashboardUtils';

// Mock the dashboardUtils functions
jest.mock('../../../utils/dashboardUtils', () => ({
  exportDataAsCSV: jest.fn(),
}));

describe('ExportButton', () => {
  const theme = createTheme();
  const mockDataPoints = [
    { timestamp: '2023-01-01T00:00:00Z', cves: 10, advisories: 5 },
    { timestamp: '2023-01-02T00:00:00Z', cves: 15, advisories: 8 },
  ];

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <ExportButton dataPoints={mockDataPoints} {...props} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the export button with correct text', () => {
    renderComponent();
    expect(screen.getByText('EXPORT DATA')).toBeInTheDocument();
  });

  it('calls exportDataAsCSV when clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('EXPORT DATA'));
    expect(dashboardUtils.exportDataAsCSV).toHaveBeenCalledWith(mockDataPoints);
  });

  it('is disabled when no data points are provided', () => {
    renderComponent({ dataPoints: [] });
    const button = screen.getByText('EXPORT DATA');
    expect(button).toBeDisabled();
  });

  it('is disabled when dataPoints is undefined', () => {
    renderComponent({ dataPoints: undefined });
    const button = screen.getByText('EXPORT DATA');
    expect(button).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    renderComponent({ disabled: true });
    const button = screen.getByText('EXPORT DATA');
    expect(button).toBeDisabled();
  });

  it('is not disabled when data points are provided and disabled is false', () => {
    renderComponent({ disabled: false });
    const button = screen.getByText('EXPORT DATA');
    expect(button).not.toBeDisabled();
  });
});
