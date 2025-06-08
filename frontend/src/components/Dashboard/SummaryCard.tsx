import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Grid
} from '@mui/material';
import { formatDelta, getDeltaColor /*, getDeltaIcon*/ } from '../../utils/dashboardUtils';

interface SummaryCardProps {
  title: string;
  averageValue: number;
  delta: number;
  gridSize?: { xs?: number; md?: number; lg?: number };
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  averageValue,
  delta,
  gridSize = { xs: 12, md: 6, lg: 3 }
}) => {
  const theme = useTheme();

  return (
    <Grid xs={gridSize.xs} md={gridSize.md} lg={gridSize.lg}>
      <Card
        elevation={3}
        sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[6],
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h4" component="div">
              {Math.round(averageValue)}
            </Typography>
            <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
              {/*getDeltaIcon(delta, theme)*/}
              <Typography
                variant="body2"
                sx={{ color: getDeltaColor(delta, theme), ml: 0.5 }}
              >
                {formatDelta(delta)}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Average over selected period
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SummaryCard;
