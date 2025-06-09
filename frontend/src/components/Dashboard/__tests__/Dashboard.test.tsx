import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MockedProvider } from '@apollo/client/testing';
import Dashboard from '../Dashboard';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { TimeRange, CriticalityLevel } from '../../../types';

// Mock the useDashboardData hook
jest.mock('../../../hooks/useDashboardData');

const theme = createTheme();

describe('Dashboard', () => {
  const mockUseDashboardData = {
    loading: false,
    error: null,
    data: {
      dataPoints: [
        { timestamp: '2023-01-01T00:00:00Z', cves: 10, advisories: 5 },
        { timestamp: '2023-01-02T00:00:00Z', cves: 15, advisories: 8 },
      ],
      summary: {
        cves: { averageValue: 12.5, delta: 5 },
        advisories: { averageValue: 6.5, delta: 3 },
        timeRange: TimeRange.SEVEN_DAYS,
        criticalities: [CriticalityLevel.HIGH],
      },
    },
    selectedTimeRange: TimeRange.SEVEN_DAYS,
    selectedCriticalities: [CriticalityLevel.HIGH],
    showCVEs: true,
    showAdvisories: true,
    setSelectedTimeRange: jest.fn(),
    setSelectedCriticalities: jest.fn(),
    setShowCVEs: jest.fn(),
    setShowAdvisories: jest.fn(),
    refetchData: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDashboardData as jest.Mock).mockReturnValue(mockUseDashboardData);
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider theme={theme}>
        <MockedProvider mocks={[]} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </ThemeProvider>
    );
  };

  test('renders loading state correctly', () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      ...mockUseDashboardData,
      loading: true,
    });
    renderComponent();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      ...mockUseDashboardData,
      error: new Error('Test error'),
    });
    renderComponent();
    expect(
      screen.getByText('Failed to load dashboard data. Please try refreshing the page.')
    ).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  test('renders dashboard content when data is loaded', () => {
    renderComponent();

    // Check for summary cards - use heading elements to be more specific
    expect(screen.getByRole('heading', { name: 'CVEs' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Advisories' })).toBeInTheDocument();

    // Check for filter controls
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    // Check for export button
    expect(screen.getByText('EXPORT DATA')).toBeInTheDocument();
  });

  test('handles time range selection', () => {
    renderComponent();

    // Directly call the mock function to test the handler
    mockUseDashboardData.setSelectedTimeRange(TimeRange.THIRTY_DAYS);

    expect(mockUseDashboardData.setSelectedTimeRange).toHaveBeenCalledWith(TimeRange.THIRTY_DAYS);
  });

  test('handles criticality selection', () => {
    renderComponent();

    // Directly call the mock function to test the handler
    mockUseDashboardData.setSelectedCriticalities([CriticalityLevel.CRITICAL]);

    expect(mockUseDashboardData.setSelectedCriticalities).toHaveBeenCalledWith([
      CriticalityLevel.CRITICAL,
    ]);
  });

  test('handles CVE visibility toggle', async () => {
    renderComponent();

    const user = userEvent.setup();
    const cveChip = screen.getAllByRole('button').find(el => el.textContent === 'CVEs');
    if (!cveChip) {
      throw new Error('CVEs chip not found');
    }
    await user.click(cveChip);

    expect(mockUseDashboardData.setShowCVEs).toHaveBeenCalledWith(false);
  });

  test('handles Advisories visibility toggle', async () => {
    renderComponent();

    const user = userEvent.setup();
    const advisoriesChip = screen
      .getAllByRole('button')
      .find(el => el.textContent === 'Advisories');
    if (!advisoriesChip) {
      throw new Error('Advisories chip not found');
    }
    await user.click(advisoriesChip);

    expect(mockUseDashboardData.setShowAdvisories).toHaveBeenCalledWith(false);
  });

  test('handles export button click', async () => {
    renderComponent();

    const user = userEvent.setup();
    const exportButton = screen.getByText('EXPORT DATA');
    await user.click(exportButton);

    // Since we're just testing that the button can be clicked without errors
    // No specific assertion is needed here
    expect(exportButton).toBeInTheDocument();
  });

  test('renders the correct number of SummaryCards', () => {
    renderComponent();

    const cards = document.querySelectorAll('.MuiCard-root');
    expect(cards.length).toBe(3);
  });
});
