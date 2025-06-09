import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { useDashboardData } from '../useDashboardData';
import '@testing-library/jest-dom';
import { GET_TIME_SERIES_DATA } from '../../graphql/queries';
import { TimeRange, CriticalityLevel } from '../../types';

// Simple mock data for tests
const mockTimeSeriesData = {
  summary: {
    cves: { average: 15, delta: 5 },
    advisories: { average: 8, delta: -3 },
    totalAlerts: { average: 23, delta: 2 }
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
];

// Helper function to wait for hook updates
const waitForHookUpdate = async (): Promise<void> => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

// Define a proper wrapper component for tests
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
};

// Jest is automatically available in the global scope in test files

describe('useDashboardData', () => {
  it('should initialize with default values', async () => {
    
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    
    // Wait for data to load
    await waitForHookUpdate();
    
    // After loading, should have default values
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
    expect(result.current.selectedTimeRange).toBe(TimeRange.SEVEN_DAYS);
    expect(result.current.selectedCriticalities).toEqual(Object.values(CriticalityLevel));
    expect(result.current.showCVEs).toBe(true);
    expect(result.current.showAdvisories).toBe(true);
  });

  it('should update selectedTimeRange when setSelectedTimeRange is called', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });
    
    // Wait for initial data load
    await waitForHookUpdate();
    
    // Update time range
    act(() => {
      result.current.setSelectedTimeRange(TimeRange.THIRTY_DAYS);
    });
    
    // Wait for update
    await waitForHookUpdate();
    
    // Time range should be updated
    expect(result.current.selectedTimeRange).toBe(TimeRange.THIRTY_DAYS);
  });

  it('should update selectedCriticalities when setSelectedCriticalities is called', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });
    
    // Wait for initial data load
    await waitForHookUpdate();
    
    // Update criticalities
    act(() => {
      result.current.setSelectedCriticalities([CriticalityLevel.HIGH]);
    });
    
    // Wait for update
    await waitForHookUpdate();
    
    // Criticalities should be updated
    expect(result.current.selectedCriticalities).toEqual([CriticalityLevel.HIGH]);
  });

  it('should toggle CVE visibility', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });
    
    // Wait for initial data load
    await waitForHookUpdate();
    
    // Initial state should show CVEs
    expect(result.current.showCVEs).toBe(true);
    
    // Toggle CVE visibility
    act(() => {
      result.current.setShowCVEs(false);
    });
    
    // CVEs should be hidden
    expect(result.current.showCVEs).toBe(false);
  });

  it('should toggle advisory visibility', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });
    
    // Wait for initial data load
    await waitForHookUpdate();
    
    // Initial state should show advisories
    expect(result.current.showAdvisories).toBe(true);
    
    // Toggle advisory visibility
    act(() => {
      result.current.setShowAdvisories(false);
    });
    
    // Advisories should be hidden
    expect(result.current.showAdvisories).toBe(false);
  });

  it('should refetch data when refetchData is called', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: Wrapper });
    
    await waitForHookUpdate();
    
    act(() => {
      result.current.refetchData();
    });
    
    expect(result.current.data).toBeDefined();
    
    await waitForHookUpdate();
    
    expect(result.current.loading).toBe(false);
  });
});
