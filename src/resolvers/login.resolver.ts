import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '@/services/auth/auth.service';

export const loginResolver: ResolveFn<true | null> = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated) {
    router.navigate(['/home']);
    return of(true);
  } else {
    return of(null);
  }
};
