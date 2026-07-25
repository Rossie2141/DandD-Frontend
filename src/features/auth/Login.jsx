import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Error as ErrorOutlineIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Lock,
} from '@mui/icons-material';

const GlassPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(16, 32, 52, 0.7)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(145, 143, 161, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
}));

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('dev@example.com');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const isEmailError = email.length > 0 && !/\S+@\S+\.\S+/.test(email);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEmailError) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#031427',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ maxWidth: '480px !important' }}>
        <GlassPaper elevation={0}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue your coding journey.
            </Typography>
          </Box>

          {/* Social Auth Buttons */}
          <Stack direction="row" spacing={2} sx={{ mb: 3, width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon sx={{ color: '#4285F4' }} />}
              sx={{
                borderColor: '#464555',
                color: 'text.primary',
                textTransform: 'none',
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& .MuiButton-startIcon': { marginRight: 1, marginLeft: 0 },
                '&:hover': { borderColor: '#918fa1', backgroundColor: 'rgba(38, 54, 74, 0.3)' },
              }}
            >
              Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              sx={{
                borderColor: '#464555',
                color: 'text.primary',
                textTransform: 'none',
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& .MuiButton-startIcon': { marginRight: 1, marginLeft: 0 },
                '&:hover': { borderColor: '#918fa1', backgroundColor: 'rgba(38, 54, 74, 0.3)' },
              }}
            >
              GitHub
            </Button>
          </Stack>

          <Box sx={{ my: 2 }}>
            <Divider sx={{ my: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  px: 1,
                }}
              >
                Or continue with
              </Typography>
            </Divider>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
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
                        <ErrorOutlineIcon sx={{ color: '#ffb4ab' }} />
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#102034',
                    '& fieldset': { borderColor: isEmailError ? '#ffb4ab' : '#464555' },
                    '&:hover fieldset': { borderColor: isEmailError ? '#ffb4ab' : '#918fa1' },
                  },
                }}
              />
              {isEmailError && (
                <FormHelperText sx={{ color: '#ffb4ab', mx: 0, mt: 0.5 }}>
                  Please enter a valid email address.
                </FormHelperText>
              )}
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Password
                </Typography>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  underline="hover"
                  sx={{ color: '#c3c0ff', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  Forgot Password?
                </Link>
              </Box>
              <TextField
                fullWidth
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
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#102034',
                    '& fieldset': { borderColor: '#464555' },
                    '&:hover fieldset': { borderColor: '#918fa1' },
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
                  sx={{
                    color: '#464555',
                    '&.Mui-checked': { color: '#4f46e5' },
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Remember me for 30 days
                </Typography>
              }
              sx={{ alignItems: 'center', mt: 0.5 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                backgroundColor: '#4f46e5',
                color: '#dad7ff',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)',
                '&:hover': { backgroundColor: '#6366f1' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#dad7ff' }} /> : 'Login'}
            </Button>
          </Box>

          {/* Router link to Sign Up */}
          <Box sx={{ textAlign: 'center', pt: 3, mt: 3, borderTop: '1px solid rgba(70, 69, 85, 0.2)' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup" underline="hover" sx={{ color: '#c3c0ff', fontWeight: 600 }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </GlassPaper>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mt: 3, opacity: 0.6 }}>
          <Lock sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontSize: '0.625rem',
              fontFamily: 'monospace',
              color: 'text.secondary',
            }}
          >
            Enterprise-grade security encryption
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}