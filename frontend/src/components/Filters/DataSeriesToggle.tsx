import React from 'react';
import { FormControl, Typography, Chip, Stack, useTheme } from '@mui/material';

interface DataSeriesToggleProps {
  showCVEs: boolean;
  onToggleCVEs: () => void;
  showAdvisories: boolean;
  onToggleAdvisories: () => void;
}

const DataSeriesToggle: React.FC<DataSeriesToggleProps> = ({
  showCVEs,
  onToggleCVEs,
  showAdvisories,
  onToggleAdvisories,
}) => {
  const theme = useTheme();

  return (
    <FormControl component="fieldset">
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        Data Series
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="CVEs"
          onClick={onToggleCVEs}
          color={showCVEs ? 'error' : 'default'}
          variant={showCVEs ? 'filled' : 'outlined'}
          sx={{
            borderColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: showCVEs
                ? theme.palette.error.main
                : `${theme.palette.error.main}22`,
            },
          }}
        />
        <Chip
          label="Advisories"
          onClick={onToggleAdvisories}
          color={showAdvisories ? 'warning' : 'default'}
          variant={showAdvisories ? 'filled' : 'outlined'}
          sx={{
            borderColor: theme.palette.warning.main,
            '&:hover': {
              backgroundColor: showAdvisories
                ? theme.palette.warning.main
                : `${theme.palette.warning.main}22`,
            },
          }}
        />
      </Stack>
    </FormControl>
  );
};

export default DataSeriesToggle;
