import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#031427' }}>
      
      {/* Top Navigation Bar */}
      {/* <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#031427',
          borderBottom: '1px solid #26364a',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ fontWeight: 'bold', color: '#c3c0ff', textDecoration: 'none' }}
            >
              D&D
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {['Explore', 'Practice', 'Contests', 'Discuss'].map((item) => (
                <Link
                  key={item}
                  component={RouterLink}
                  to={`/${item.toLowerCase()}`}
                  underline="none"
                  color="text.secondary"
                  sx={{ '&:hover': { color: 'text.primary' }, transition: 'color 0.2s' }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant={isLoginPage ? 'contained' : 'text'}
              sx={{
                color: isLoginPage ? '#dad7ff' : '#c3c0ff',
                backgroundColor: isLoginPage ? '#4f46e5' : 'transparent',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': { backgroundColor: isLoginPage ? '#6366f1' : 'rgba(38, 54, 74, 0.5)' },
              }}
            >
              Sign In
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              variant={!isLoginPage ? 'contained' : 'text'}
              sx={{
                color: !isLoginPage ? '#dad7ff' : '#c3c0ff',
                backgroundColor: !isLoginPage ? '#4f46e5' : 'transparent',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': { backgroundColor: !isLoginPage ? '#6366f1' : 'rgba(38, 54, 74, 0.5)' },
              }}
            >
              Join Now
            </Button>
          </Box>
        </Toolbar>
      </AppBar> */}

      {/* Dynamic Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 12,
          pb: 8,
          px: 2,
        }}
      >
        <Outlet />
      </Box>

      {/* Shared Footer */}
      {/* <Box
        component="footer"
        sx={{
          backgroundColor: '#000f21',
          borderTop: '1px solid #26364a',
          py: 3,
          px: { xs: 2, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 1 }}>
            D&D INTERACTIVE
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
            © 2026 D&D Interactive. All rights reserved.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support', 'Status'].map((text) => (
            <Link
              key={text}
              component={RouterLink}
              to={`/${text.toLowerCase().replace(/\s+/g, '-')}`}
              underline="none"
              variant="body2"
              color="text.secondary"
              sx={{ '&:hover': { color: '#c3c0ff' } }}
            >
              {text}
            </Link>
          ))}
        </Box>
      </Box> */}
    </Box>
  );
}