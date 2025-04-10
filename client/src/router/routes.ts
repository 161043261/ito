import { lazy } from 'react';
import { WithGuard } from './guard';
import Login from '@/pages/login';
import Register from '@/pages/register';

export interface IRoute {
  key: string; // name
  path: string; // relative path
  element: React.FC; // component
  children?: IRoute[];
  redirect?: string;
}

export const routes: IRoute[] = [
  {
    key: 'Home', // name
    path: '/',
    element: WithGuard(lazy(() => import('@/pages/home'))), // component
    children: [
      {
        key: 'Chat',
        path: 'chat',
        element: WithGuard(lazy(() => import('@/pages/home'))),
      },
      {
        key: 'Contact',
        path: 'contact', // 通讯录
        element: WithGuard(lazy(() => import('@/pages/home'))),
      },
    ],
  },
  {
    key: 'Login',
    path: '/login',
    element: Login,
  },
  {
    key: 'Register',
    path: '/register',
    element: Register,
  },
  {
    key: 'Fallback',
    path: '*',
    element: lazy(() => import('@/pages/fallback')),
    redirect: '/',
  },
];
