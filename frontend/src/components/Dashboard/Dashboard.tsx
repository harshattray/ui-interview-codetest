import React, { useState, useEffect } from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
  Grid,
  Button
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LineChart from '../LineChart';
import Filters from '../Filters';
import { GET_TIME_SERIES_DATA } from '../../graphql/queries';
import type { TimeSeriesResponse } from '../../types';
import { TimeRange, CriticalityLevel } from '../../types';

// Define query variables type
interface QueryVariables {
  timeRange: TimeRange;
  criticalities: CriticalityLevel[] | null;
}

// No need for styled components, we'll use MUI Grid directly

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.SEVEN_DAYS);
  const [selectedCriticalities, setSelectedCriticalities] = useState<CriticalityLevel[]>(
    Object.values(CriticalityLevel)
  );
  const [showCVEs, setShowCVEs] = useState(true);
  const [showAdvisories, setShowAdvisories] = useState(true);

  const { loading, error, data, refetch } = useQuery<TimeSeriesResponse, QueryVariables>(
    GET_TIME_SERIES_DATA,
    {
      variables: {
        timeRange: selectedTimeRange,
        criticalities: selectedCriticalities.length > 0 ? selectedCriticalities : null,
      },
    }
  );

  // Refetch data when filters change
  useEffect(() => {
    refetch({
      timeRange: selectedTimeRange,
      criticalities: selectedCriticalities.length > 0 ? selectedCriticalities : null,
    });
  }, [selectedTimeRange, selectedCriticalities, refetch]);

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

  if (!data || !data.timeSeriesData) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert severity="warning">
          No data available. Please check your filters and try again.
        </Alert>
      </Box>
    );
  }

  const { summary } = data.timeSeriesData;

  const formatDelta = (delta: number) => {
    const formattedValue = Math.abs(delta).toFixed(1);
    return delta >= 0 ? `+${formattedValue}%` : `-${formattedValue}%`;
  };

  const getDeltaColor = (delta: number) => {
    return delta < 0 ? theme.palette.success.main : theme.palette.error.main;
  };

  const getDeltaIcon = (delta: number) => {
    return delta < 0 ? (
      <TrendingDownIcon sx={{ color: theme.palette.success.main }} />
    ) : (
      <TrendingUpIcon sx={{ color: theme.palette.error.main }} />
    );
  };

  const exportDataAsCSV = () => {
    if (!data?.timeSeriesData?.dataPoints || data.timeSeriesData.dataPoints.length === 0) return;
    
    // Format the date and create CSV content
    const csvContent = `Date,CVEs,Advisories\n${data.timeSeriesData.dataPoints.map(point => {
      const date = new Date(point.timestamp).toISOString().split('T')[0];
      return `${date},${point.cves},${point.advisories}`;
    }).join('\n')}`;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `security_metrics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };

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
        {/* CVEs Summary Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                CVEs
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" component="div">
                  {Math.round(summary.cves.averageValue)}
                </Typography>
                <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                  {getDeltaIcon(summary.cves.delta)}
                  <Typography 
                    variant="body2" 
                    sx={{ color: getDeltaColor(summary.cves.delta) }}
                  >
                    {formatDelta(summary.cves.delta)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Average over selected period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Advisories Summary Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Advisories
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" component="div">
                  {Math.round(summary.advisories.averageValue)}
                </Typography>
                <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                  {getDeltaIcon(summary.advisories.delta)}
                  <Typography 
                    variant="body2" 
                    sx={{ color: getDeltaColor(summary.advisories.delta) }}
                  >
                    {formatDelta(summary.advisories.delta)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Average over selected period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Time Range Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Time Range
              </Typography>
              <Typography variant="h5" component="div">
                {selectedTimeRange.replace('_', ' ').toLowerCase()
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedTimeRange === TimeRange.THREE_DAYS ? '3 days' :
                 selectedTimeRange === TimeRange.SEVEN_DAYS ? '7 days' :
                 selectedTimeRange === TimeRange.FOURTEEN_DAYS ? '14 days' : '30 days'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Criticality Levels Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Filters
              </Typography>
              <Typography variant="h5" component="div">
                {selectedCriticalities.length} Criticality Levels
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedCriticalities.length === Object.keys(CriticalityLevel).length 
                  ? 'All levels selected' 
                  : selectedCriticalities
                      .map(c => c.charAt(0) + c.slice(1).toLowerCase())
                      .join(', ')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          Security Metrics Visualization
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={exportDataAsCSV}
          sx={{ textTransform: 'none' }}
        >
          Export Data
        </Button>
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
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </Box>
            </Alert>
          </Box>
        ) : !data || !data.timeSeriesData || !data.timeSeriesData.dataPoints || data.timeSeriesData.dataPoints.length === 0 ? (
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
              data={data.timeSeriesData.dataPoints}
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
