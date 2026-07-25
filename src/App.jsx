import React, { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoadingFallback from './components/LoadingFallback';

// Native MUI dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Lazy-loaded route components
const Login = lazy(() => import('./features/auth/Login'));
const SignUpForm = lazy(() => import('./features/auth/SignUp'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SignUpForm />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}