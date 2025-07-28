import React from 'react';
import { Box, Typography } from '@mui/material';
import BatteryIcon from '../assets/battery.svg'; // Adjust path as needed

interface BatteryDisplayProps {
  percentage: number;
}

const BatteryDisplay: React.FC<BatteryDisplayProps> = ({ percentage }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <img src={BatteryIcon} alt="Battery" style={{ width: '24px', height: '24px' }} />
      <Typography variant="body1" sx={{ color: 'white' }}>
        {percentage}%
      </Typography>
    </Box>
  );
};

export default BatteryDisplay;
