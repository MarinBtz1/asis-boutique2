import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    const isAdmin = await auth.isAdmin();
    if (isAdmin) return true;
  } catch {}

  return router.parseUrl('/login');
};
