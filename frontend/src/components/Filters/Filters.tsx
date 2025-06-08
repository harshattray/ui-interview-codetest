import React from 'react';
import { 
  Box, 
  FormControl, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  Paper,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { CriticalityLevel, TimeRange } from '../../types';

interface FiltersProps {
  selectedCriticalities: CriticalityLevel[];
  setSelectedCriticalities: (criticalities: CriticalityLevel[]) => void;
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (timeRange: TimeRange) => void;
  showCVEs: boolean;
  setShowCVEs: (show: boolean) => void;
  showAdvisories: boolean;
  setShowAdvisories: (show: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedCriticalities,
  setSelectedCriticalities,
  selectedTimeRange,
  setSelectedTimeRange,
  showCVEs,
  setShowCVEs,
  showAdvisories,
  setShowAdvisories
}) => {
  const handleCriticalityChange = (criticality: CriticalityLevel) => {
    if (selectedCriticalities.includes(criticality)) {
      setSelectedCriticalities(
        selectedCriticalities.filter(c => c !== criticality)
      );
    } else {
      setSelectedCriticalities([...selectedCriticalities, criticality]);
    }
  };

  const handleTimeRangeChange = (event: SelectChangeEvent<TimeRange>) => {
    setSelectedTimeRange(event.target.value as TimeRange);
  };

  const getCriticalityColor = (criticality: CriticalityLevel): string => {
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

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        transition: 'all 0.3s ease'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Time Range Filter */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={selectedTimeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value={TimeRange.THREE_DAYS}>Last 3 Days</MenuItem>
            <MenuItem value={TimeRange.SEVEN_DAYS}>Last 7 Days</MenuItem>
            <MenuItem value={TimeRange.FOURTEEN_DAYS}>Last 14 Days</MenuItem>
            <MenuItem value={TimeRange.THIRTY_DAYS}>Last 30 Days</MenuItem>
          </Select>
        </FormControl>

        {/* Criticality Filters */}
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            Criticality Levels
          </Typography>
          <FormGroup row>
            {Object.values(CriticalityLevel).map((criticality) => (
              <FormControlLabel
                key={criticality}
                control={
                  <Checkbox
                    checked={selectedCriticalities.includes(criticality)}
                    onChange={() => handleCriticalityChange(criticality)}
                    sx={{
                      color: getCriticalityColor(criticality),
                      '&.Mui-checked': {
                        color: getCriticalityColor(criticality),
                      },
                    }}
                  />
                }
                label={criticality.charAt(0) + criticality.slice(1).toLowerCase()}
              />
            ))}
          </FormGroup>
        </FormControl>

        {/* Data Series Filters */}
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            Data Series
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCVEs}
                  onChange={(e) => setShowCVEs(e.target.checked)}
                  sx={{
                    color: '#d32f2f',
                    '&.Mui-checked': {
                      color: '#d32f2f',
                    },
                  }}
                />
              }
              label="CVEs"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAdvisories}
                  onChange={(e) => setShowAdvisories(e.target.checked)}
                  sx={{
                    color: '#2196f3',
                    '&.Mui-checked': {
                      color: '#2196f3',
                    },
                  }}
                />
              }
              label="Advisories"
            />
          </FormGroup>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Filters;
