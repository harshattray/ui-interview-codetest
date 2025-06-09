// React is used implicitly by JSX
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SummaryCard from '../SummaryCard';
import * as dashboardUtils from '../../../utils/dashboardUtils';

// Mock the dashboardUtils functions
jest.mock('../../../utils/dashboardUtils', () => ({
  formatDelta: jest.fn().mockReturnValue('+5.0%'),
  getDeltaColor: jest.fn().mockReturnValue('#ff0000'),
}));

describe('SummaryCard', () => {
  const theme = createTheme();
  const defaultProps = {
    title: 'Test Card',
    averageValue: 42,
    delta: 5,
  };

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <SummaryCard {...defaultProps} {...props} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('renders the average value correctly', () => {
    renderComponent({ averageValue: 42.7 });
    expect(screen.getByText('43')).toBeInTheDocument();
  });

  it('renders the delta value using formatDelta', () => {
    renderComponent();
    expect(dashboardUtils.formatDelta).toHaveBeenCalledWith(5);
    expect(screen.getByText('+5.0%')).toBeInTheDocument();
  });

  it('renders the "Average over selected period" text', () => {
    renderComponent();
    expect(screen.getByText('Average over selected period')).toBeInTheDocument();
  });

  it('applies different icons based on title', () => {
    // Test for CVEs
    const { rerender } = renderComponent({ title: 'CVEs' });
    expect(screen.getByText('CVEs')).toBeInTheDocument();
    // SecurityIcon should be present for CVEs
    const cveIcon = document.querySelector('svg[data-testid="SecurityIcon"]');
    expect(cveIcon).toBeInTheDocument();

    // Test for Advisories
    rerender(
      <ThemeProvider theme={theme}>
        <SummaryCard {...defaultProps} title="Advisories" />
      </ThemeProvider>
    );
    expect(screen.getByText('Advisories')).toBeInTheDocument();
    // AnnouncementIcon should be present for Advisories
    const advisoryIcon = document.querySelector('svg[data-testid="AnnouncementIcon"]');
    expect(advisoryIcon).toBeInTheDocument();

    // Test for Other title
    rerender(
      <ThemeProvider theme={theme}>
        <SummaryCard {...defaultProps} title="Other" />
      </ThemeProvider>
    );
    expect(screen.getByText('Other')).toBeInTheDocument();
    // Should use SecurityIcon for other titles too
    const otherIcon = document.querySelector('svg[data-testid="SecurityIcon"]');
    expect(otherIcon).toBeInTheDocument();
  });
});
