import { Box, CircularProgress } from '@mui/material';

export default function LoadingFallback() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ color: 'black' }} size={40} />
    </Box>
  );
}