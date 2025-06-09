import { getCriticalityColor } from '../colorUtils';
import { CriticalityLevel } from '../../types';

describe('colorUtils', () => {
  describe('getCriticalityColor', () => {
    it('should return red for CRITICAL criticality', () => {
      expect(getCriticalityColor(CriticalityLevel.CRITICAL)).toBe('#d32f2f');
    });

    it('should return light red for HIGH criticality', () => {
      expect(getCriticalityColor(CriticalityLevel.HIGH)).toBe('#f44336');
    });

    it('should return orange for MEDIUM criticality', () => {
      expect(getCriticalityColor(CriticalityLevel.MEDIUM)).toBe('#ff9800');
    });

    it('should return yellow for LOW criticality', () => {
      expect(getCriticalityColor(CriticalityLevel.LOW)).toBe('#ffeb3b');
    });

    it('should return green for NONE criticality', () => {
      expect(getCriticalityColor(CriticalityLevel.NONE)).toBe('#4caf50');
    });

    it('should return green for default case', () => {
      // @ts-expect-error - Testing default case with invalid criticality value
      expect(getCriticalityColor('UNKNOWN')).toBe('#4caf50');
    });
  });
});
