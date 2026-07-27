import { Link as RouterLink } from 'react-router';
import { Box, Typography, Link, Divider, Stack } from '@mui/material';

const footerLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Cookie Policy', path: '/cookies' },
  { label: 'Support', path: '/support' },
  { label: 'Status', path: '/status' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        color: '#475569',
        mt: 'auto',
        py: 5,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Brand Info */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '5px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            >
              D&D
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: '#0f172a',
                fontSize: '0.95rem',
                letterSpacing: '-0.01em',
              }}
            >
              CodeForge
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 400, fontSize: '0.875rem' }}>
            Building next-generation developer platforms with high-performance interactive tools.
          </Typography>
        </Box>

        {/* Quick Links */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.5, sm: 3 }}
          sx={{ flexWrap: 'wrap' }}
        >
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              component={RouterLink}
              to={item.path}
              underline="none"
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 400,
                '&:hover': { color: '#0f172a' },
                transition: 'color 0.15s ease-in-out',
              }}
            >
              {item.label}
            </Link>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: '#f1f5f9', mb: 3 }} />

      {/* Bottom Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.5,
        }}
      >
        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} CodeForge Inc. All rights reserved.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            color: '#94a3b8',
            textTransform: 'uppercase',
          }}
        >
          Enterprise Grade Security Encrypted
        </Typography>
      </Box>
    </Box>
  );
}