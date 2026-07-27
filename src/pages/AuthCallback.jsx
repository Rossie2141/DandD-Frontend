import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getCurrentUser } from '../services/authService';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Parse token from window.location directly to avoid React Router searchParams race conditions on initial render
      const urlParams = new URLSearchParams(window.location.search);
      let token = urlParams.get('token') || urlParams.get('access_token');

      // If not in query params, check hash fragment
      if (!token && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        token = hashParams.get('token') || hashParams.get('access_token');
      }

      if (!token) {
        navigate('/login');
        return;
      }

      // Store access token
      localStorage.setItem('access_token', token);

      try {
        // Fetch current user details from backend
        const userData = await getCurrentUser();

        if (userData) {
          // Extract user object, supporting both direct and nested formats
          const userObj = userData.user ? userData.user : userData;
          localStorage.setItem('user', JSON.stringify(userObj));
          window.dispatchEvent(new Event('auth-change'));
          navigate('/home');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to authenticate:', err);
        navigate('/login');
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: '#0f172a' }} />
      <Typography variant="body2" sx={{ color: '#64748b' }}>
        Authenticating profile...
      </Typography>
    </Box>
  );
}