import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import type { ApolloError, ApolloQueryResult } from '@apollo/client';
import { GET_TIME_SERIES_DATA } from '../graphql/queries';
import type { TimeSeriesResponse, TimeSeriesData } from '../types';
import { TimeRange, CriticalityLevel } from '../types';

interface QueryVariables {
  timeRange: TimeRange;
  criticalities: CriticalityLevel[] | null;
}

interface UseDashboardDataReturn {
  loading: boolean;
  error?: ApolloError;
  data?: TimeSeriesData;
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: React.Dispatch<React.SetStateAction<TimeRange>>;
  selectedCriticalities: CriticalityLevel[];
  setSelectedCriticalities: React.Dispatch<React.SetStateAction<CriticalityLevel[]>>;
  showCVEs: boolean;
  setShowCVEs: React.Dispatch<React.SetStateAction<boolean>>;
  showAdvisories: boolean;
  setShowAdvisories: React.Dispatch<React.SetStateAction<boolean>>;
  refetchData: (
    variables?: Partial<QueryVariables>
  ) => Promise<ApolloQueryResult<TimeSeriesResponse>>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.SEVEN_DAYS);
  const [selectedCriticalities, setSelectedCriticalities] = useState<CriticalityLevel[]>(
    Object.values(CriticalityLevel)
  );
  const [showCVEs, setShowCVEs] = useState(true);
  const [showAdvisories, setShowAdvisories] = useState(true);

  const { loading, error, data, refetch } = useQuery<TimeSeriesResponse, QueryVariables>(
    GET_TIME_SERIES_DATA,
    {
      variables: {
        timeRange: selectedTimeRange,
        criticalities: selectedCriticalities.length > 0 ? selectedCriticalities : null,
      },
    }
  );

  useEffect(() => {
    refetch({
      timeRange: selectedTimeRange,
      criticalities: selectedCriticalities.length > 0 ? selectedCriticalities : null,
    });
  }, [selectedTimeRange, selectedCriticalities, refetch]);

  return {
    loading,
    error,
    data: data?.timeSeriesData,
    selectedTimeRange,
    setSelectedTimeRange,
    selectedCriticalities,
    setSelectedCriticalities,
    showCVEs,
    setShowCVEs,
    showAdvisories,
    setShowAdvisories,
    refetchData: refetch,
  };
};
