import { CriticalityLevel } from '../types';

export const getCriticalityColor = (criticality: CriticalityLevel): string => {
  switch (criticality) {
    case CriticalityLevel.CRITICAL:
      return '#d32f2f'; // Red
    case CriticalityLevel.HIGH:
      return '#f44336'; // Light Red
    case CriticalityLevel.MEDIUM:
      return '#ff9800'; // Orange
    case CriticalityLevel.LOW:
      return '#ffeb3b'; // Yellow
    case CriticalityLevel.NONE:
    default:
      return '#4caf50'; // Green
  }
};
