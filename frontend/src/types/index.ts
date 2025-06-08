export const TimeRange = {
  THREE_DAYS: 'THREE_DAYS',
  SEVEN_DAYS: 'SEVEN_DAYS',
  FOURTEEN_DAYS: 'FOURTEEN_DAYS',
  THIRTY_DAYS: 'THIRTY_DAYS'
} as const;

export type TimeRange = typeof TimeRange[keyof typeof TimeRange];

export const CriticalityLevel = {
  NONE: 'NONE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const;

export type CriticalityLevel = typeof CriticalityLevel[keyof typeof CriticalityLevel];

export interface DataPoint {
  timestamp: string;
  cves: number;
  advisories: number;
}

export interface MetricSummary {
  averageValue: number;
  delta: number;
}

export interface TimeSeriesSummary {
  cves: MetricSummary;
  advisories: MetricSummary;
  timeRange: TimeRange;
  criticalities: CriticalityLevel[];
}

export interface TimeSeriesData {
  dataPoints: DataPoint[];
  summary: TimeSeriesSummary;
}

export interface User {
  id: string;
  name: string;
}

export interface TimeSeriesResponse {
  timeSeriesData: TimeSeriesData;
}

export interface UserResponse {
  user: User;
}
