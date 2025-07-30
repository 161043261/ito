import { lazy } from 'react';
import { WithGuard } from './guard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

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
    element: WithGuard(lazy(() => import('@/pages/Home'))), // component
    children: [
      {
        key: 'Chat',
        path: 'chat',
        element: WithGuard(lazy(() => import('@/pages/Home'))),
      },
      {
        key: 'Contact',
        path: 'contact', // 通讯录
        element: WithGuard(lazy(() => import('@/pages/Home'))),
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
    element: lazy(() => import('@/pages/Fallback')),
    redirect: '/',
  },
];
