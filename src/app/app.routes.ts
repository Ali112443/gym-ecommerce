import { Routes } from '@angular/router';
import { Auth } from './auth/auth';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((module) => module.Home),
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products-grid/products-grid').then((module) => module.default),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((module) => module.ProductDetail),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/my-wishlist/my-wishlist').then((module) => module.default),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((module) => module.Cart),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout').then((module) => module.Checkout),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/my-profile/my-profile').then((module) => module.default),
  },
  { path: 'sign-in', component: Auth, data: { register: false } },
  { path: 'sign-up', component: Auth, data: { register: true } },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders').then((module) => module.Orders),
  },
  { path: '**', redirectTo: '' },
];
