import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportDataAsCSV } from '../../utils/dashboardUtils';
import type { DataPoint } from '../../types';

interface ExportButtonProps {
  dataPoints?: DataPoint[];
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ dataPoints, disabled = false }) => {
  const handleExport = () => {
    if (dataPoints) {
      exportDataAsCSV(dataPoints);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<FileDownloadIcon />}
      onClick={handleExport}
      disabled={disabled || !dataPoints || dataPoints.length === 0}
      sx={{ 
        transition: 'transform 0.2s ease, background-color 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: 'secondary.dark',
        }
      }}
    >
      Export Data
    </Button>
  );
};

export default ExportButton;
