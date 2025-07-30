import { createBrowserRouter, Navigate } from 'react-router';
import { WithGuard } from './guard';
import { lazy } from 'react';
import Register from '@/pages/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: WithGuard(lazy(() => import('@/pages/Home'))),
    children: [
      {
        path: 'chat', // '/chat',
        Component: WithGuard(lazy(() => import('@/pages/Home'))),
      },
      {
        path: 'contact', // /'contact',
        Component: WithGuard(lazy(() => import('@/pages/Home'))),
      },
    ],
  },
  {
    path: '/login',
    Component: lazy(() => import('@/pages/Login')),
  },
  {
    path: '/register',
    // Component: Register,
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
