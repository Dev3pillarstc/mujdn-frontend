import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@/services/auth/auth.service';
import { of } from 'rxjs';

export const chooseSystemResolver: ResolveFn<true | null> = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated) {
    if (!authService.hasVisitsAccess) {
      router.navigate(['/attendance/home']);
    }
    return of(true);
  } else {
    return of(null);
  }
};
