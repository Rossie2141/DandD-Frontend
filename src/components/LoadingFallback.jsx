import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function LoadingFallback() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#031427',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ color: '#4f46e5' }} size={40} />
    </Box>
  );
}