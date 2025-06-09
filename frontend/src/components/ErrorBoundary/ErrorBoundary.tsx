import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            m: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
            maxWidth: '600px',
            mx: 'auto',
          }}
          role="alert"
          aria-live="assertive"
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Something went wrong
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary" align="center">
              {this.state.error?.message ||
                'An unexpected error occurred while rendering this component.'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReset}
            aria-label="Try again"
          >
            Try Again
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
