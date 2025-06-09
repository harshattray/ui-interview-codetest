import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Specialized error boundary for chart components that provides
 * chart-specific error messaging and retry functionality
 */
class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Chart rendering error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
          role="alert"
          aria-live="polite"
        >
          <BarChartIcon color="warning" sx={{ fontSize: 48 }} />
          <Typography variant="h6" component="h3" align="center">
            Chart Visualization Error
          </Typography>
          <Box sx={{ mb: 2, maxWidth: '80%' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {this.state.error?.message || 'There was a problem rendering the chart data.'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              This could be due to invalid data format or visualization constraints.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleRetry}
            startIcon={<BarChartIcon />}
            aria-label="Retry loading chart"
          >
            Retry Chart
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
