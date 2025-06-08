import React from 'react';
import {
  FormControl,
  Typography,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import { CriticalityLevel } from '../../types';
import { getCriticalityColor } from '../../utils/colorUtils';

interface CriticalitySelectorProps {
  selectedCriticalities: CriticalityLevel[];
  onCriticalityChange: (criticality: CriticalityLevel) => void;
}

const CriticalitySelector: React.FC<CriticalitySelectorProps> = ({
  selectedCriticalities,
  onCriticalityChange,
}) => {
  const theme = useTheme();

  return (
    <FormControl component="fieldset">
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        Criticality Levels
      </Typography>
      <Stack direction="row" spacing={1}>
        {Object.values(CriticalityLevel).map((criticality) => (
          <Chip
            key={criticality}
            label={criticality.charAt(0) + criticality.slice(1).toLowerCase()}
            onClick={() => onCriticalityChange(criticality)}
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
              },
            }}
          />
        ))}
      </Stack>
    </FormControl>
  );
};

export default CriticalitySelector;
