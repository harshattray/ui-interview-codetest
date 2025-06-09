import { formatDelta, getDeltaColor, exportDataAsCSV } from '../dashboardUtils';
import { createTheme } from '@mui/material/styles';
import type { DataPoint } from '../../types';

describe('dashboardUtils', () => {
  const theme = createTheme();

  describe('formatDelta', () => {
    it('should format positive delta with plus sign', () => {
      expect(formatDelta(5.5)).toBe('+5.5%');
    });

    it('should format negative delta with minus sign', () => {
      expect(formatDelta(-3.2)).toBe('-3.2%');
    });

    it('should return dash for undefined delta', () => {
      expect(formatDelta(undefined)).toBe('-');
    });
  });

  describe('getDeltaColor', () => {
    it('should return error color for positive delta', () => {
      const result = getDeltaColor(5, theme);
      expect(result).toBe(theme.palette.error.main);
    });

    it('should return success color for negative delta', () => {
      const result = getDeltaColor(-5, theme);
      expect(result).toBe(theme.palette.success.main);
    });

    it('should return text.secondary for undefined delta', () => {
      const result = getDeltaColor(undefined, theme);
      expect(result).toBe(theme.palette.text.secondary);
    });
  });

  describe('exportDataAsCSV', () => {
    // Store original methods
    const originalCreateElement = document.createElement;
    const originalAppendChild = document.body.appendChild;
    const originalRemoveChild = document.body.removeChild;

    // Mock elements and methods
    let mockLinkElement: { setAttribute: jest.Mock; click: jest.Mock };
    let mockCreateElement: jest.Mock;
    let mockAppendChild: jest.Mock;
    let mockRemoveChild: jest.Mock;
    let mockSetAttribute: jest.Mock;
    let mockClick: jest.Mock;

    beforeEach(() => {
      // Create mock element
      mockLinkElement = {
        setAttribute: jest.fn(),
        click: jest.fn(),
      };

      // Create mock methods
      mockCreateElement = jest.fn().mockReturnValue(mockLinkElement);
      mockAppendChild = jest.fn();
      mockRemoveChild = jest.fn();

      // Replace document methods with mocks
      document.createElement = mockCreateElement as unknown as typeof document.createElement;
      document.body.appendChild = mockAppendChild as unknown as typeof document.body.appendChild;
      document.body.removeChild = mockRemoveChild as unknown as typeof document.body.removeChild;

      // Store references to the mocks for assertions
      mockSetAttribute = mockLinkElement.setAttribute;
      mockClick = mockLinkElement.click;

      // Mock alert
      global.alert = jest.fn();
    });

    afterEach(() => {
      // Restore original methods
      document.createElement = originalCreateElement;
      document.body.appendChild = originalAppendChild;
      document.body.removeChild = originalRemoveChild;
      jest.clearAllMocks();
    });

    it('should create and trigger download of CSV file', () => {
      // Test data
      const mockData: DataPoint[] = [
        { timestamp: '2023-01-01T00:00:00Z', cves: 10, advisories: 5 },
        { timestamp: '2023-01-02T00:00:00Z', cves: 15, advisories: 8 },
      ];

      // Call the function
      exportDataAsCSV(mockData);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockSetAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('security_metrics_')
      );
      expect(mockSetAttribute).toHaveBeenCalledWith(
        'href',
        expect.stringContaining('data:text/csv')
      );
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });

    it('should not create CSV file if data is empty', () => {
      exportDataAsCSV([]);

      expect(mockCreateElement).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('No data to export.');
    });

    it('should not create CSV file if data is undefined', () => {
      global.alert = jest.fn();
      exportDataAsCSV(undefined);

      expect(mockCreateElement).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('No data to export.');
    });
  });
});
