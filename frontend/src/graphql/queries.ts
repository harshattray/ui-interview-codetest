import { gql } from '@apollo/client';

export const GET_TIME_SERIES_DATA = gql`
  query GetTimeSeriesData($timeRange: TimeRange, $criticalities: [CriticalityLevel!]) {
    timeSeriesData(timeRange: $timeRange, criticalities: $criticalities) {
      dataPoints {
        timestamp
        cves
        advisories
      }
      summary {
        cves {
          averageValue
          delta
        }
        advisories {
          averageValue
          delta
        }
        timeRange
        criticalities
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    user {
      id
      name
    }
  }
`;
