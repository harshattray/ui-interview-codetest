import type { Theme } from '@mui/material/styles';
import type { DataPoint } from '../types';

export const formatDelta = (delta: number | undefined): string => {
  if (delta === undefined) return '-';
  const formattedValue = Math.abs(delta).toFixed(1);
  return delta >= 0 ? `+${formattedValue}%` : `-${formattedValue}%`;
};

export const getDeltaColor = (delta: number | undefined, theme: Theme): string => {
  if (delta === undefined) return theme.palette.text.secondary;
  return delta < 0 ? theme.palette.success.main : theme.palette.error.main;
};


export const exportDataAsCSV = (dataPoints?: DataPoint[]): void => {
  if (!dataPoints || dataPoints.length === 0) {
    if (typeof alert !== 'undefined') alert('No data to export.');
    return;
  }

  const headers = ['Date', 'CVEs', 'Advisories'];
  
  const escapeCsvCell = (cell: string | number | boolean | null | undefined): string => {
    const cellString = String(cell ?? '');
    if (cellString.includes(',') || cellString.includes('\n') || cellString.includes('"')) {
      return `"${cellString.replace(/"/g, '""')}"`;
    }
    return cellString;
  };

  const rows = dataPoints.map(point => [
    new Date(point.timestamp).toISOString().split('T')[0],
    point.cves,
    point.advisories 
  ].map(escapeCsvCell));

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += headers.map(escapeCsvCell).join(",") + "\r\n";
  csvContent += rows.map(row => row.join(",")).join("\r\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `security_metrics_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
