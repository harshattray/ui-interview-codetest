import React from 'react';
import { 
  Box, 
  FormControl, 
  Typography, 
  Paper,
  Select,
  MenuItem,
  Divider,
  Chip,
  Stack,
  useTheme
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

  const theme = useTheme();
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to right, rgba(66, 66, 66, 0.8), rgba(33, 33, 33, 0.9))' 
          : 'linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.95))'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h6" fontWeight="500">
          Filters
        </Typography>
        <Chip 
          label={`${selectedCriticalities.length} filters applied`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 4,
        alignItems: { xs: 'flex-start', md: 'flex-end' }
      }}>
        {/* Time Range Filter */}
        <FormControl sx={{ minWidth: 200 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Time Range
          </Typography>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={selectedTimeRange}
            onChange={handleTimeRangeChange}
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <MenuItem value={TimeRange.THREE_DAYS}>Last 3 Days</MenuItem>
            <MenuItem value={TimeRange.SEVEN_DAYS}>Last 7 Days</MenuItem>
            <MenuItem value={TimeRange.FOURTEEN_DAYS}>Last 14 Days</MenuItem>
            <MenuItem value={TimeRange.THIRTY_DAYS}>Last 30 Days</MenuItem>
          </Select>
        </FormControl>

        {/* Criticality Filters */}
        <FormControl component="fieldset">
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Criticality Levels
          </Typography>
          <Stack direction="row" spacing={1}>
            {Object.values(CriticalityLevel).map((criticality) => (
              <Chip
                key={criticality}
                label={criticality.charAt(0) + criticality.slice(1).toLowerCase()}
                onClick={() => handleCriticalityChange(criticality)}
                color={selectedCriticalities.includes(criticality) ? 'primary' : 'default'}
                variant={selectedCriticalities.includes(criticality) ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: selectedCriticalities.includes(criticality) 
                    ? getCriticalityColor(criticality) 
                    : 'transparent',
                  borderColor: getCriticalityColor(criticality),
                  color: selectedCriticalities.includes(criticality) 
                    ? '#fff' 
                    : theme.palette.mode === 'dark' ? '#fff' : '#333',
                  '&:hover': {
                    backgroundColor: selectedCriticalities.includes(criticality) 
                      ? getCriticalityColor(criticality) 
                      : `${getCriticalityColor(criticality)}22`,
                  }
                }}
              />
            ))}
          </Stack>
        </FormControl>

        {/* Data Series Filters */}
        <FormControl component="fieldset">
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Data Series
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label="CVEs"
              onClick={() => setShowCVEs(!showCVEs)}
              color={showCVEs ? 'error' : 'default'}
              variant={showCVEs ? 'filled' : 'outlined'}
              sx={{
                borderColor: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: showCVEs 
                    ? theme.palette.error.main 
                    : `${theme.palette.error.main}22`,
                }
              }}
            />
            <Chip
              label="Advisories"
              onClick={() => setShowAdvisories(!showAdvisories)}
              color={showAdvisories ? 'warning' : 'default'}
              variant={showAdvisories ? 'filled' : 'outlined'}
              sx={{
                borderColor: theme.palette.warning.main,
                '&:hover': {
                  backgroundColor: showAdvisories 
                    ? theme.palette.warning.main 
                    : `${theme.palette.warning.main}22`,
                }
              }}
            />
          </Stack>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Filters;
