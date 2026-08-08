import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Problems', path: '/problems' },
  { label: 'Explore', path: '/explore' },
  { label: 'Contests', path: '/contests' },
  { label: 'Discuss', path: '/discuss' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return { username: 'User' };
      }
    }
    return null;
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Listen to auth-change events to sync user state
  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser({ username: 'User' });
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e2e8f0',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          justifyContent: 'space-between',
          width: '100%',
          px: { xs: 2, sm: 4, md: 6 },
          minHeight: { xs: '56px', sm: '64px' },
        }}
      >
        {/* Brand Logo & Desktop Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              D&D
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#0f172a',
                fontSize: '0.95rem',
                letterSpacing: '-0.01em',
              }}
            >
              Do and Discover
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3.5 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  underline="none"
                  sx={{
                    color: isActive ? '#0f172a' : '#64748b',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.875rem',
                    position: 'relative',
                    py: 0.5,
                    '&:hover': { color: '#0f172a' },
                    transition: 'color 0.15s ease-in-out',
                    '&::after': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: -18,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: '#0f172a',
                          borderRadius: '2px 2px 0 0',
                        }
                      : {},
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </Box>
        </Box>

        {/* Desktop Right Action Area */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
          {user ? (
            /* Logged In State */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                onClick={handleProfileMenuOpen}
                disableRipple
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  textTransform: 'none',
                  p: 0.5,
                  pr: 1.5,
                  borderRadius: '24px',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                <Avatar
                  alt={user.username || user.email || 'User'}
                  src={user.avatarUrl}
                  sx={{
                    width: 34,
                    height: 34,
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user.username || user.email)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#0f172a',
                    fontSize: '0.875rem',
                  }}
                >
                  {user.username || user.email?.split('@')[0] || 'User'}
                </Typography>
              </Button>

              {/* Profile Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      mt: 1.5,
                      minWidth: 190,
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                      overflow: 'visible',
                      p: 0.75,
                      '& .MuiMenuItem-root': {
                        borderRadius: '8px',
                        py: 1,
                        px: 1.5,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#334155',
                        gap: 1.5,
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          color: '#0f172a',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => navigate('/admin/new-problem')}>
                  <ListItemIcon sx={{ minWidth: 'auto !important' }}>
                    <AddBoxOutlinedIcon fontSize="small" sx={{ color: '#64748b' }} />
                  </ListItemIcon>
                  Add Problem
                </MenuItem>
                <MenuItem onClick={() => navigate('/dashboard')}>
                  <ListItemIcon sx={{ minWidth: 'auto !important' }}>
                    <DashboardOutlinedIcon fontSize="small" sx={{ color: '#64748b' }} />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => navigate('/profile')}>
                  <ListItemIcon sx={{ minWidth: 'auto !important' }}>
                    <PersonOutlinedIcon fontSize="small" sx={{ color: '#64748b' }} />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider sx={{ my: 0.75, borderColor: '#f1f5f9' }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: '#ef4444 !important',
                    '&:hover': {
                      backgroundColor: '#fef2f2 !important',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto !important' }}>
                    <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            /* Logged Out State */
            <>
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                disableRipple
                sx={{
                  color: '#475569',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  px: 2,
                  py: 0.75,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  px: 2.25,
                  py: 0.75,
                  '&:hover': {
                    backgroundColor: '#1e293b',
                  },
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Toggle Button */}
        <IconButton
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{
            display: { md: 'none' },
            color: '#334155',
            p: 1,
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#f1f5f9' },
          }}
        >
          {mobileOpen ? <CloseIcon sx={{ fontSize: 22 }} /> : <MenuIcon sx={{ fontSize: 22 }} />}
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        SlotProps={{
          paper: {
            sx: {
              width: '100%',
              backgroundColor: '#ffffff',
              backgroundImage: 'none',
              pt: 7,
              pb: 3,
              px: 2.5,
              borderBottom: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
            },
          },
        }}
      >
        <List sx={{ py: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    backgroundColor: isActive ? '#f8fafc' : 'transparent',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          color: isActive ? '#0f172a' : '#475569',
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '0.9rem',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          {user ? (
            /* Mobile Logged In Actions */
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  mb: 1,
                }}
              >
                <Avatar
                  alt={user.username || user.email || 'User'}
                  src={user.avatarUrl}
                  sx={{ width: 36, height: 36, backgroundColor: '#0f172a', fontSize: '0.85rem' }}
                >
                  {getInitials(user.username || user.email)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {user.username || 'User'}
                  </Typography>
                  {user.email && (
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {user.email}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Button
                fullWidth
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                variant="outlined"
                color="error"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  py: 1,
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            /* Mobile Logged Out Actions */
            <>
              <Button
                fullWidth
                component={RouterLink}
                to="/login"
                onClick={() => setMobileOpen(false)}
                variant="outlined"
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#334155',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  py: 1,
                  '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
                }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                component={RouterLink}
                to="/signup"
                onClick={() => setMobileOpen(false)}
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  py: 1,
                  '&:hover': { backgroundColor: '#1e293b' },
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}