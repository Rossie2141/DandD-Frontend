import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Lock,
  GitHub,
  Google,
} from '@mui/icons-material';

const GlassPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(16, 32, 52, 0.7)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(145, 143, 161, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
}));

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    navigate('/login');
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Create an account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join the D&D community of high-performance developers.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mb: 3, width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
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
              startIcon={<GitHub />}
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

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#102034',
                    '& fieldset': { borderColor: '#464555' },
                    '&:hover fieldset': { borderColor: '#918fa1' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#102034',
                    '& fieldset': { borderColor: '#464555' },
                    '&:hover fieldset': { borderColor: '#918fa1' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
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
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  size="small"
                  sx={{ color: '#464555', '&.Mui-checked': { color: '#4f46e5' } }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the{' '}
                  <Link component={RouterLink} to="/terms" underline="hover" sx={{ color: '#c3c0ff' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link component={RouterLink} to="/privacy" underline="hover" sx={{ color: '#c3c0ff' }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ alignItems: 'flex-start', mt: 0.5 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
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
              Create Account
            </Button>
          </Box>

          {/* Router link to Login */}
          <Box sx={{ textAlign: 'center', pt: 3, mt: 3, borderTop: '1px solid rgba(70, 69, 85, 0.2)' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover" sx={{ color: '#c3c0ff', fontWeight: 600 }}>
                Log in
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