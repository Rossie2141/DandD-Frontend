import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import MainLayout from './layouts/MainLayout';
import LoadingFallback from './components/LoadingFallback';

import AuthCallback from './pages/AuthCallback';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


// Lazy components
const Login = lazy(() => import('./features/auth/Login'));
const SignUpForm = lazy(() => import('./features/auth/Signup'));
const Home = lazy(() => import('./pages/Home'));



const router = createBrowserRouter([

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


  // OAuth callback
  {
    path: '/auth/callback',
    element: (
      <AuthCallback />
    ),
  },


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

    ],
  },


  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },

]);



export default function App(){

  return (

    <ThemeProvider theme={darkTheme}>

      <CssBaseline />

      <RouterProvider router={router}/>

    </ThemeProvider>

  );

}