import { type NavItem } from '../types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: 'billing',
    label: 'transaction',
  },
  {
    title: 'Funds',
    href: '/funds',
    icon: 'pizza',
    label: 'fund',
  },
  {
    title: 'Cài đặt',
    href: '/manage',
    icon: 'settings',
    label: 'settings',
  },
];
