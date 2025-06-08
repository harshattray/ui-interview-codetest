import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { CriticalityLevel, TimeRange } from '../../types';

import TimeRangeSelector from './TimeRangeSelector';
import CriticalitySelector from './CriticalitySelector';
import DataSeriesToggle from './DataSeriesToggle';

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
        alignItems: { xs: 'flex-start', md: 'flex-end' } // Or 'center' or 'stretch' depending on desired alignment of new components
      }}>
        <TimeRangeSelector 
          selectedTimeRange={selectedTimeRange} 
          onChangeTimeRange={handleTimeRangeChange} 
        />
        <CriticalitySelector 
          selectedCriticalities={selectedCriticalities} 
          onCriticalityChange={handleCriticalityChange} 
        />
        <DataSeriesToggle 
          showCVEs={showCVEs} 
          onToggleCVEs={() => setShowCVEs(!showCVEs)} 
          showAdvisories={showAdvisories} 
          onToggleAdvisories={() => setShowAdvisories(!showAdvisories)} 
        />
      </Box>
    </Paper>
  );
};

export default Filters;
