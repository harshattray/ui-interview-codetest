import React from 'react';
import { Button, useTheme, Paper } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportDataAsCSV } from '../../utils/dashboardUtils';
import type { DataPoint } from '../../types';

interface ExportButtonProps {
  dataPoints?: DataPoint[];
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ dataPoints, disabled = false }) => {
  const theme = useTheme();
  
  const handleExport = () => {
    if (dataPoints) {
      exportDataAsCSV(dataPoints);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(156,39,176,0.15) 0%, rgba(156,39,176,0.05) 100%)',
        border: '1px solid',
        borderColor: 'divider',
        p: 2
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        startIcon={<FileDownloadIcon sx={{ fontSize: 20 }} />}
        onClick={handleExport}
        disabled={disabled || !dataPoints || dataPoints.length === 0}
        sx={{ 
          py: 1.5,
          px: 3,
          borderRadius: 8,
          fontWeight: 600,
          letterSpacing: '0.5px',
          boxShadow: '0 4px 10px rgba(156,39,176,0.3)',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          fontSize: '1rem',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 15px rgba(156,39,176,0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 5px rgba(156,39,176,0.3)',
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled,
            boxShadow: 'none'
          }
        }}
      >
        EXPORT DATA
      </Button>
    </Paper>
  );
};

export default ExportButton;
