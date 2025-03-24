import { lazy } from 'react';
import { withGuard } from './guard';

export interface IRoute {
  key: string;
  path: string;
  element: React.FC;
  children?: IRoute[];
}

export const routes: IRoute[] = [
  {
    key: 'Home',
    path: '/',
    element: withGuard(lazy(() => import('@/pages/home'))),
  },
];
