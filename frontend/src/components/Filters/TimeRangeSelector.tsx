import React from 'react';
import {
  FormControl,
  Typography,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { TimeRange } from '../../types';

interface TimeRangeSelectorProps {
  selectedTimeRange: TimeRange;
  onChangeTimeRange: (event: SelectChangeEvent<TimeRange>) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedTimeRange,
  onChangeTimeRange,
}) => {
  const theme = useTheme();

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        Time Range
      </Typography>
      <Select
        labelId="time-range-label"
        id="time-range-select"
        value={selectedTimeRange}
        onChange={onChangeTimeRange}
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
  );
};

export default TimeRangeSelector;
