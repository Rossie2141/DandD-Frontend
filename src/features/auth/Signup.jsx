import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import {
  Typography,
  Button,
  Box,
  Container,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  GitHub,
  Google,
} from '@mui/icons-material';

const GlassPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius * 2.5,
  padding: theme.spacing(4),
  boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.01)',
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
    zIndex: 0,
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '3px',
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius * 2.5 - 3,
    zIndex: 1,
  },
}));

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    const fieldName = id || name;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sign up failed');
      }

      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/google/login';
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/github/login';
  };

  // Reusable input style to force dark text across all state contexts
  const inputStyleProps = {
    htmlInput: {
      style: {
        color: '#0f172a',
        WebkitTextFillColor: '#0f172a',
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        py: 4,
        px: 2,
        '@keyframes rotateGradient': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      <Container maxWidth="xs" sx={{ maxWidth: '480px !important' }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box
            sx={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '24px',
              overflow: 'hidden',
              filter: 'blur(18px)',
              opacity: 0.65,
              zIndex: 0,
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

          <GlassPaper elevation={0}>
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5, color: '#0f172a', fontSize: '1.75rem' }}>
                  Create an account
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Join the D&D community of high-performance developers.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mb: 3, width: '100%' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  startIcon={<Google />}
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#334155',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    '& .MuiButton-startIcon': { marginRight: 1, marginLeft: 0 },
                    '&:hover': { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
                  }}
                >
                  Google
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGithubLogin}
                  startIcon={<GitHub sx={{ color: '#0f172a' }} />}
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#334155',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    '& .MuiButton-startIcon': { marginRight: 1, marginLeft: 0 },
                    '&:hover': { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
                  }}
                >
                  GitHub
                </Button>
              </Stack>

              <Box sx={{ my: 2 }}>
                <Divider sx={{ my: 2, borderColor: '#f1f5f9' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      fontFamily: 'monospace',
                      px: 1,
                      fontSize: '0.75rem',
                    }}
                  >
                    Or continue with
                  </Typography>
                </Divider>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    id="fullName"
                    placeholder="Alan Turing"
                    value={formData.fullName}
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                    required
                    slotProps={inputStyleProps}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#cbd5e1' },
                        '&:hover fieldset': { borderColor: '#94a3b8' },
                        '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1px' },
                      },
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                        WebkitTextFillColor: '#0f172a !important',
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    id="email"
                    type="email"
                    placeholder="dev@dd-interactive.com"
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                    required
                    slotProps={inputStyleProps}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#cbd5e1' },
                        '&:hover fieldset': { borderColor: '#94a3b8' },
                        '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1px' },
                      },
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                        WebkitTextFillColor: '#0f172a !important',
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                    required
                    slotProps={{
                      ...inputStyleProps,
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
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#cbd5e1' },
                        '&:hover fieldset': { borderColor: '#94a3b8' },
                        '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1px' },
                      },
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                        WebkitTextFillColor: '#0f172a !important',
                      },
                    }}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        color: '#cbd5e1',
                        '&.Mui-checked': { color: '#0f172a' },
                        paddingTop: '2px',
                        paddingBottom: 0,
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontSize: '0.8125rem',
                        lineHeight: 1.4,
                      }}
                    >
                      I agree to the{' '}
                      <Link component={RouterLink} to="/terms" underline="hover" sx={{ color: '#0f172a', fontWeight: 500 }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link component={RouterLink} to="/privacy" underline="hover" sx={{ color: '#0f172a', fontWeight: 500 }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{
                    alignItems: 'flex-start',
                    mt: 0.5,
                    mx: 0,
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.3,
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#1e293b',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Create Account'}
                </Button>
              </Box>

              <Box sx={{ textAlign: 'center', pt: 2.5, mt: 3, borderTop: '1px solid #f1f5f9' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" underline="hover" sx={{ color: '#0f172a', fontWeight: 600 }}>
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </GlassPaper>
        </Box>
      </Container>
    </Box>
  );
}