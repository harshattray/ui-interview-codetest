import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  Card, 
  CardContent,
  Button,
  Avatar
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import type { ApolloError } from '@apollo/client';
import LineChart from '../LineChart';
import Filters from '../Filters';
import { useDashboardData } from '../../hooks/useDashboardData';
import SummaryCard from './SummaryCard';
import ExportButton from './ExportButton';

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
    refetchData 
  } = useDashboardData();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert severity="error">
          Error loading data: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert severity="warning">
          No data available. Please check your filters and try again.
        </Alert>
      </Box>
    );
  }

  const { summary, dataPoints } = data;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: '2px',
          }
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 1
          }}
        >
          Security Metrics Dashboard
        </Typography>
      </Box>
      
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

      <Box 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          mt: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-60px',
            right: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.light}15, ${theme.palette.background.default})`,
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-40px',
            left: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.secondary.light}15, ${theme.palette.background.default})`,
            zIndex: -1,
          }
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid sx={{ gridColumn: 'span 12', '@media (min-width: 600px)': { gridColumn: 'span 6' }, '@media (min-width: 900px)': { gridColumn: 'span 4' }, '@media (min-width: 1200px)': { gridColumn: 'span 3' }, mb: 2 }}>
            <SummaryCard 
              title="CVEs" 
              averageValue={summary.cves.averageValue} 
              delta={summary.cves.delta} 
            />
          </Grid>
          <Grid sx={{ gridColumn: 'span 12', '@media (min-width: 600px)': { gridColumn: 'span 6' }, '@media (min-width: 900px)': { gridColumn: 'span 4' }, '@media (min-width: 1200px)': { gridColumn: 'span 3' }, mb: 2 }}>
            <SummaryCard 
              title="Advisories" 
              averageValue={summary.advisories.averageValue} 
              delta={summary.advisories.delta} 
            />
          </Grid>
          <Grid sx={{ gridColumn: 'span 12', '@media (min-width: 600px)': { gridColumn: 'span 6' }, '@media (min-width: 900px)': { gridColumn: 'span 4' }, '@media (min-width: 1200px)': { gridColumn: 'span 3' }, mb: 2 }}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                borderRadius: 2, 
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0.05) 100%)',
                position: 'relative',
                overflow: 'visible',
                '&:hover': { 
                  transform: 'translateY(-5px)', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
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

          <Grid sx={{ gridColumn: 'span 12', '@media (min-width: 600px)': { gridColumn: 'span 6' }, '@media (min-width: 900px)': { gridColumn: 'span 12' }, '@media (min-width: 1200px)': { gridColumn: 'span 3' }, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <ExportButton dataPoints={dataPoints} />
          </Grid>
        </Grid>
      </Box>

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
            }
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
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,242,245,0.95) 100%)',
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
          }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Security Metrics Over Time
        </Typography>
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 'calc(100% - 40px)',
              width: '100%'
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
              Loading security metrics data...
            </Typography>
          </Box>
        ) : error ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 'calc(100% - 40px)',
              width: '100%'
            }}
          >
            <Alert 
              severity="error" 
              variant="outlined"
              sx={{ 
                width: '80%', 
                display: 'flex', 
                alignItems: 'center',
                '& .MuiAlert-icon': {
                  fontSize: '2rem'
                }
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>Error loading data</Typography>
                <Typography variant="body2">{(error as ApolloError)?.message || 'Failed to fetch data. Please try again.'}</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => refetchData()} 
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Retry
                </Button>
              </Box>
            </Alert>
          </Box>
        ) : !data || !dataPoints || dataPoints.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 'calc(100% - 40px)',
              width: '100%'
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
                  fontSize: '2rem'
                }
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>No data available</Typography>
                <Typography variant="body2">
                  No security metrics data available for the selected filters. 
                  Try adjusting your time range or criticality levels.
                </Typography>
              </Box>
            </Alert>
          </Box>
        ) : (
          <Box sx={{ height: 'calc(100% - 40px)', width: '100%' }}>
            <LineChart 
              data={dataPoints}
              showCVEs={showCVEs}
              showAdvisories={showAdvisories}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
