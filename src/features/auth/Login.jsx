import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import {
  Typography,
  Button,
  Box,
  Container,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Error as ErrorOutlineIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  LockOutlined,
} from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [apiError, setApiError] = useState('');

  // Email format regex validation
  const isValidEmail = (emailStr) => /\S+@\S+\.\S+/.test(emailStr);
  const isEmailError = email.length > 0 && !isValidEmail(email);

  // Social Auth Handlers
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/google/login';
  };

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/github/login';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    if (!email.trim() || !password.trim() || isEmailError) {
      setApiError('Please fill in all required fields with a valid email.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem("access_token", data.access_token);
        window.dispatchEvent(new Event('auth-change'));
      }

      navigate("/home");
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        py: 6,
        px: 2,
        '@keyframes rotateGradient': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      <Container maxWidth="xs" sx={{ maxWidth: '420px !important' }}>
        {/* Brand Header */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.25,
            mb: 3.5,
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            D&D
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#0f172a',
              fontSize: '1.1rem',
              letterSpacing: '-0.01em',
            }}
          >
            CodeForge
          </Typography>
        </Box>

        {/* Outer Wrapper */}
        <Box sx={{ position: 'relative', width: '100%' }}>
          {/* Ambient Soft Outer Glow */}
          <Box
            sx={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '24px',
              overflow: 'hidden',
              filter: 'blur(16px)',
              opacity: 0.6,
              pointerEvents: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background:
                  'conic-gradient(transparent 0deg 240deg, #ff0080 275deg, #7928ca 305deg, #0070f3 330deg, #00dfd8 360deg)',
                animation: 'rotateGradient 7s linear infinite',
              },
            }}
          />

          {/* Animated Border Container */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '20px',
              padding: '2px',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background:
                  'conic-gradient(transparent 0deg 240deg, #ff0080 275deg, #7928ca 305deg, #0070f3 330deg, #00dfd8 360deg)',
                animation: 'rotateGradient 4s linear infinite',
              },
            }}
          >
            {/* Main Content Card */}
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                p: { xs: 3, sm: 4 },
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5, fontSize: '1.35rem' }}
                >
                  Welcome back
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Sign in to continue your coding journey.
                </Typography>
              </Box>

              {/* API Failure Alert Banner */}
              {apiError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.8125rem' }}>
                  {apiError}
                </Alert>
              )}

              {/* Social Auth */}
              <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, width: '100%' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  startIcon={<GoogleIcon sx={{ fontSize: '18px !important' }} />}
                  disableRipple
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#334155',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    py: 1,
                    borderRadius: '8px',
                    '&:hover': { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
                  }}
                >
                  Google
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGitHubLogin}
                  startIcon={<GitHubIcon sx={{ fontSize: '18px !important', color: '#0f172a' }} />}
                  disableRipple
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#334155',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    py: 1,
                    borderRadius: '8px',
                    '&:hover': { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
                  }}
                >
                  GitHub
                </Button>
              </Stack>

              <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem', px: 1 }}>
                  or continue with email
                </Typography>
              </Divider>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: '#334155', fontWeight: 500, mb: 0.75, display: 'block', fontSize: '0.8rem' }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={isEmailError}
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: {
                        endAdornment: isEmailError ? (
                          <InputAdornment position="end">
                            <ErrorOutlineIcon fontSize="small" sx={{ color: '#ef4444' }} />
                          </InputAdornment>
                        ) : null,
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        '& input': { color: '#0f172a' },
                        '& fieldset': { borderColor: isEmailError ? '#ef4444' : '#cbd5e1' },
                        '&:hover fieldset': { borderColor: isEmailError ? '#ef4444' : '#94a3b8' },
                        '&.Mui-focused fieldset': { borderColor: isEmailError ? '#ef4444' : '#0f172a', borderWidth: '1px' },
                      },
                    }}
                  />
                  {isEmailError && (
                    <FormHelperText sx={{ color: '#ef4444', mx: 0, mt: 0.5, fontSize: '0.75rem' }}>
                      Please enter a valid email address.
                    </FormHelperText>
                  )}
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8rem' }}>
                      Password
                    </Typography>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      underline="hover"
                      sx={{ color: '#0f172a', fontSize: '0.75rem', fontWeight: 500 }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                  <TextField
                    fullWidth
                    required
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              sx={{ color: '#64748b' }}
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        '& input': { color: '#0f172a' },
                        '& fieldset': { borderColor: '#cbd5e1' },
                        '&:hover fieldset': { borderColor: '#94a3b8' },
                        '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1px' },
                      },
                    }}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      size="small"
                      sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0f172a' } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                      Remember me for 30 days
                    </Typography>
                  }
                  sx={{ alignItems: 'center', my: 0.25 }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={loading}
                  sx={{
                    mt: 0.5,
                    py: 1.2,
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#1e293b',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Sign In'}
                </Button>
              </Box>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: 'center', pt: 2.5, mt: 3, borderTop: '1px solid #f1f5f9' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" underline="hover" sx={{ color: '#0f172a', fontWeight: 600 }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.75, mt: 3 }}>
          <LockOutlined sx={{ fontSize: 13, color: '#94a3b8' }} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.675rem',
              letterSpacing: '0.05em',
              color: '#94a3b8',
              textTransform: 'uppercase',
            }}
          >
            Enterprise-grade security encryption
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}