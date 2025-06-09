import React from 'react';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Grid,
  useTheme,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LineChart from '../LineChart';
import Filters from '../Filters';
import { useDashboardData } from '../../hooks/useDashboardData';
import SummaryCard from './SummaryCard';
import ExportButton from './ExportButton';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ChartErrorBoundary from '../ErrorBoundary/ChartErrorBoundary';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const {
    loading,
    error,
    data,
    selectedTimeRange,
    setSelectedTimeRange,
    selectedCriticalities,
    setSelectedCriticalities,
    showCVEs,
    setShowCVEs,
    showAdvisories,
    setShowAdvisories,
  } = useDashboardData();

  if (loading) {
    return (
      <ErrorBoundary>
        <Box sx={{ p: 3 }} role="region" aria-label="Security Metrics Dashboard">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(100% - 40px)',
              width: '100%',
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
              Loading security metrics data...
            </Typography>
          </Box>
        </Box>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <Box sx={{ p: 3 }} role="region" aria-label="Security Metrics Dashboard">
          <Alert severity="error" sx={{ mb: 3 }} role="alert">
            <AlertTitle>Error</AlertTitle>
            Failed to load dashboard data. Please try refreshing the page.
            <Typography
              component="pre"
              sx={{
                mt: 2,
                p: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                fontSize: '0.8rem',
                maxHeight: '100px',
                overflow: 'auto',
              }}
            >
              {error?.message || 'An unknown error occurred'}
            </Typography>
          </Alert>
        </Box>
      </ErrorBoundary>
    );
  }

  if (!data) {
    return (
      <ErrorBoundary>
        <Box sx={{ p: 3 }} role="region" aria-label="Security Metrics Dashboard">
          <Paper sx={{ p: 3, textAlign: 'center' }} role="region" aria-label="No data notification">
            <Typography tabIndex={0}>No data available for the selected filters</Typography>
          </Paper>
        </Box>
      </ErrorBoundary>
    );
  }

  const { summary, dataPoints } = data;

  return (
    <ErrorBoundary>
      <Box sx={{ p: 3 }} role="region" aria-label="Security Metrics Dashboard">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          tabIndex={0} // Make heading focusable for screen readers
        >
          Security Metrics Dashboard
        </Typography>
        <Filters
          selectedCriticalities={selectedCriticalities}
          setSelectedCriticalities={setSelectedCriticalities}
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          showCVEs={showCVEs}
          setShowCVEs={setShowCVEs}
          showAdvisories={showAdvisories}
          setShowAdvisories={setShowAdvisories}
        />
        <Grid
          container
          spacing={3}
          sx={{ mb: 4 }}
          role="region"
          aria-label="Security metrics summary"
        >
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 3' }, padding: 1 }}>
            <SummaryCard
              title="CVEs"
              averageValue={summary.cves.averageValue}
              delta={summary.cves.delta}
              aria-label={`CVEs: ${summary.cves.averageValue}`}
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 3' }, padding: 1 }}>
            <SummaryCard
              title="Advisories"
              averageValue={summary.advisories.averageValue}
              delta={summary.advisories.delta}
              aria-label={`Advisories: ${summary.advisories.averageValue}`}
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 3' }, padding: 1 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                background:
                  'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0.05) 100%)',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
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
                    <AssessmentIcon sx={{ fontSize: 24, color: theme.palette.success.main }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Total Alerts
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
                    {Math.round(summary.cves.averageValue + summary.advisories.averageValue)}
                  </Typography>
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
                  Sum of CVEs & Advisories Average
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            sx={{
              gridColumn: 'span 12',
              '@media (min-width: 600px)': { gridColumn: 'span 6' },
              '@media (min-width: 900px)': { gridColumn: 'span 12' },
              '@media (min-width: 1200px)': { gridColumn: 'span 3' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <ExportButton dataPoints={dataPoints} />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: { xs: 4, sm: 5 },
            mb: { xs: 2, sm: 3 },
            position: 'relative',
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              position: 'relative',
              display: 'inline-block',
              px: 2,
              py: 1,
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '8px',
                backgroundColor: `${theme.palette.primary.main}15`,
                borderRadius: '4px',
                zIndex: -1,
              },
            }}
          >
            Security Metrics Visualization
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            height: 500,
            position: 'relative',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,242,245,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Security Metrics Over Time
          </Typography>
          {loading ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', p: 4 }}
              role="status"
              aria-live="polite"
            >
              <CircularProgress aria-label="Loading dashboard data" />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }} role="alert">
              <AlertTitle>Error</AlertTitle>
              Failed to load dashboard data. Please try refreshing the page.
              <Typography
                component="pre"
                sx={{
                  mt: 2,
                  p: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  fontSize: '0.8rem',
                  maxHeight: '100px',
                  overflow: 'auto',
                }}
              >
                {error && typeof error === 'object' && 'message' in error
                  ? error.message
                  : 'An unknown error occurred'}
              </Typography>
            </Alert>
          ) : !dataPoints || dataPoints.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100% - 40px)',
                width: '100%',
              }}
            >
              <Alert
                severity="info"
                variant="outlined"
                sx={{
                  width: '80%',
                  display: 'flex',
                  alignItems: 'center',
                  '& .MuiAlert-icon': {
                    fontSize: '2rem',
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    No data available
                  </Typography>
                  <Typography variant="body2">
                    No security metrics data available for the selected filters. Try adjusting your
                    time range or criticality levels.
                  </Typography>
                </Box>
              </Alert>
            </Box>
          ) : (
            <Box sx={{ height: 'calc(100% - 40px)', width: '100%' }}>
              <ChartErrorBoundary>
                <LineChart data={dataPoints} showCVEs={showCVEs} showAdvisories={showAdvisories} />
              </ChartErrorBoundary>
            </Box>
          )}
        </Paper>
      </Box>
    </ErrorBoundary>
  );
};

export default Dashboard;
