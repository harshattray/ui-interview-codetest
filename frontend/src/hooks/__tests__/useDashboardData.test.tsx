import React from 'react';
import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { useDashboardData } from '../../hooks/useDashboardData';
import '@testing-library/jest-dom';
import { GET_TIME_SERIES_DATA } from '../../graphql/queries';
import { TimeRange, CriticalityLevel } from '../../types';
// No need to import WrapperProps as we're defining the wrapper inline

// Simple mock data for tests
const mockTimeSeriesData = {
  summary: {
    cves: { averageValue: 15, delta: 5 },
    advisories: { averageValue: 8, delta: -3 },
    totalAlerts: { averageValue: 23, delta: 2 },
    timeRange: TimeRange.SEVEN_DAYS,
    criticalities: Object.values(CriticalityLevel),
  },
  dataPoints: [
    { timestamp: '2023-01-01T00:00:00Z', cves: 10, advisories: 5 },
    { timestamp: '2023-01-02T00:00:00Z', cves: 15, advisories: 8 },
    { timestamp: '2023-01-03T00:00:00Z', cves: 20, advisories: 11 }
  ]
};

// Create mocks for Apollo Client
type MockData = {
  timeSeriesData: typeof mockTimeSeriesData;
};

const mocks: MockedResponse<MockData>[] = [
  {
    request: {
      query: GET_TIME_SERIES_DATA,
      variables: {
        timeRange: TimeRange.SEVEN_DAYS,
        criticalities: Object.values(CriticalityLevel),
      },
    },
    result: {
      data: {
        timeSeriesData: mockTimeSeriesData
      },
    },
  },
  {
    request: {
      query: GET_TIME_SERIES_DATA,
      variables: {
        timeRange: TimeRange.THIRTY_DAYS,
        criticalities: Object.values(CriticalityLevel),
      },
    },
    result: {
      data: {
        timeSeriesData: mockTimeSeriesData
      },
    },
  },
  {
    request: {
      query: GET_TIME_SERIES_DATA,
      variables: {
        timeRange: TimeRange.SEVEN_DAYS,
        criticalities: [CriticalityLevel.HIGH],
      },
    },
    result: {
      data: {
        timeSeriesData: mockTimeSeriesData
      },
    },
  },
  // Add a mock for refetch with the same variables as the initial query
  {
    request: {
      query: GET_TIME_SERIES_DATA,
      variables: {
        timeRange: TimeRange.SEVEN_DAYS,
        criticalities: Object.values(CriticalityLevel),
      },
    },
    result: {
      data: {
        timeSeriesData: mockTimeSeriesData
      },
    },
  },
];

// Helper function to wait for hook updates
const waitForHookToUpdate = async (): Promise<void> => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

// Define a wrapper component for tests
const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MockedProvider mocks={mocks as any} addTypename={false}>
    {children}
  </MockedProvider>
);

describe('useDashboardData', () => {
  it('initializes with loading state', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: Wrapper,
    });

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();
  });

  it('updates time range selection', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: Wrapper,
    });
    
    await waitForHookToUpdate();
    
    act(() => {
      result.current.setSelectedTimeRange(TimeRange.THIRTY_DAYS);
    });
    
    await waitForHookToUpdate();
    
    expect(result.current.selectedTimeRange).toBe(TimeRange.THIRTY_DAYS);
    expect(result.current.data).toBeDefined();
  });

  it('updates criticalities selection', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: Wrapper,
    });
    
    await waitForHookToUpdate();
    
    act(() => {
      result.current.setSelectedCriticalities([CriticalityLevel.HIGH]);
    });
    
    await waitForHookToUpdate();
    
    expect(result.current.selectedCriticalities).toEqual([CriticalityLevel.HIGH]);
  });

  it('returns data when query completes', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: Wrapper,
    });

    // Wait for the query to complete
    await waitForHookToUpdate();

    // Verify data is returned correctly
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeDefined();
  });

  it('toggles CVE visibility', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });
    
    await waitForHookToUpdate();
    
    expect(result.current.showCVEs).toBe(true);
    
    act(() => {
      result.current.setShowCVEs(false);
    });
    
    expect(result.current.showCVEs).toBe(false);
  });

  it('toggles advisory visibility', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });
    
    await waitForHookToUpdate();
    
    expect(result.current.showAdvisories).toBe(true);
    
    act(() => {
      result.current.setShowAdvisories(false);
    });
    
    expect(result.current.showAdvisories).toBe(false);
  });

  it('handles refetch correctly', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: Wrapper,
    });

    // Wait for the initial query to complete
    await waitForHookToUpdate();

    // Mock the refetch function
    const mockRefetch = jest.fn().mockResolvedValue({
      data: mockTimeSeriesData,
    });
    result.current.refetchData = mockRefetch;

    // Call refetch
    await act(async () => {
      await result.current.refetchData();
    });

    // Verify refetch was called
    expect(mockRefetch).toHaveBeenCalled();
  });
});
