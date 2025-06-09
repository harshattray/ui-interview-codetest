import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SecurityIcon from '@mui/icons-material/Security';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { formatDelta, getDeltaColor } from '../../utils/dashboardUtils';

interface SummaryCardProps {
  title: string;
  averageValue: number;
  delta: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, averageValue, delta }) => {
  const theme = useTheme();

  const getGradientColors = () => {
    if (title === 'CVEs') {
      return 'linear-gradient(135deg, rgba(244,67,54,0.15) 0%, rgba(244,67,54,0.05) 100%)';
    } else if (title === 'Advisories') {
      return 'linear-gradient(135deg, rgba(33,150,243,0.15) 0%, rgba(33,150,243,0.05) 100%)';
    } else {
      return 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0.05) 100%)';
    }
  };

  // Get appropriate icon based on title
  const getIcon = () => {
    if (title === 'CVEs') {
      return <SecurityIcon sx={{ fontSize: 24, color: theme.palette.error.main }} />;
    } else if (title === 'Advisories') {
      return <AnnouncementIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />;
    } else {
      return <SecurityIcon sx={{ fontSize: 24, color: theme.palette.success.main }} />;
    }
  };

  // Get delta icon based on value
  const getDeltaIcon = () => {
    if (delta === undefined) return null;
    if (delta < 0) {
      return <TrendingDownIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />;
    } else {
      return <TrendingUpIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />;
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        background: getGradientColors(),
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 20px rgba(0,0,0,0.1)`,
        },
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.background.paper,
              width: 40,
              height: 40,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              mr: 1.5,
            }}
          >
            {getIcon()}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: theme.palette.text.primary,
            }}
          >
            {Math.round(averageValue)}
          </Typography>

          <Box
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
              px: 1,
              py: 0.5,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            {getDeltaIcon()}
            <Typography
              variant="body2"
              sx={{
                color: getDeltaColor(delta, theme),
                ml: 0.5,
                fontWeight: 600,
              }}
            >
              {formatDelta(delta)}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            opacity: 0.8,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Average over selected period
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
