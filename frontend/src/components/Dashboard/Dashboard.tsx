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
  Button
} from '@mui/material';
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

  if (!data) { // data from useDashboardData is already data.timeSeriesData or undefined
    return (
      <Box sx={{ m: 2 }}>
        <Alert severity="warning">
          No data available. Please check your filters and try again.
        </Alert>
      </Box>
    );
  }

  const { summary, dataPoints } = data; // data from useDashboardData is already data.timeSeriesData

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <SummaryCard 
          title="CVEs" 
          averageValue={summary.cves.averageValue} 
          delta={summary.cves.delta} 
        />
        <SummaryCard 
          title="Advisories" 
          averageValue={summary.advisories.averageValue} 
          delta={summary.advisories.delta} 
        />
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 2, transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: theme.shadows[6] }, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Total Alerts
              </Typography>
              <Typography variant="h4" component="div">
                {Math.round(summary.cves.averageValue + summary.advisories.averageValue)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sum of CVEs & Advisories Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Grid item for Export Button - simplified and corrected */}
        <Grid item xs={12} md={12} lg={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <ExportButton dataPoints={dataPoints} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          Security Metrics Visualization
        </Typography>
        {/* The ExportButton component is now used above, so this manual button is removed 
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={exportDataAsCSV}
          sx={{ textTransform: 'none' }}
        >
          Export Data
        </Button>*/}
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          height: 500,
          position: 'relative'
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
              height={400}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
