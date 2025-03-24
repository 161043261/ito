import { lazy } from 'react';
import { withGuard } from './guard';

export interface IRoute {
  key?: string; // name
  path: string; // relative path
  element: React.FC; // component
  children?: IRoute[];
  redirect?: string
}

export const routes: IRoute[] = [
  {
    key: 'Home',
    path: '/',
    element: withGuard(lazy(() => import('@/pages/home'))),
    children: [
      {
        key: 'Chat',
        path: 'chat',
        element: withGuard(lazy(() => import('@/pages/home'))),
      },
      {
        key: 'Contact',
        path: 'contact',
        element: withGuard(lazy(() => import('@/pages/home'))),
      },
    ],
  },
];
