import { Outlet } from 'react-router';
import { Box } from '@mui/material';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#031427',
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}