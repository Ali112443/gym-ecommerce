import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreService } from './store.service';

export const authGuard: CanActivateFn = () => {
  const store = inject(StoreService);
  const router = inject(Router);
  return store.isLoggedIn() ? true : router.createUrlTree(['/sign-in']);
};