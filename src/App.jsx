import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import MainLayout from './layouts/MainLayout';
import LoadingFallback from './components/LoadingFallback';
import AuthCallback from './pages/AuthCallback';

const appTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Lazy loaded components
const Login = lazy(() => import('./features/auth/Login'));
const SignUpForm = lazy(() => import('./features/auth/Signup'));
const Home = lazy(() => import('./pages/Home'));
const Problems = lazy(() => import('./pages/ProblemPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProblemSolver=lazy(()=>import('./pages/ProblemSolver'));

const ProtectedRoute = () => {
  // Check common keys where tokens or user sessions are stored
  const token = 
    localStorage.getItem('token') || 
    localStorage.getItem('accessToken') || 
    localStorage.getItem('user');

  console.log('Protected Route Check Token:', token); // Temporary debug log

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  // Public Auth Routes
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
    path: '/auth/callback',
    element: <AuthCallback />,
  },

  // Routes inside MainLayout (Header + Footer)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },
      // Protected Routes requiring Login
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: 'problems',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Problems />
              </Suspense>
            ),
          },
          {
            path: 'solver',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProblemSolver />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // Fallback Catch-all
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}