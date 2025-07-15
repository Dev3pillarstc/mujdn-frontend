import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '@/services/auth/auth.service';
import { AlertService } from '@/services/shared/alert.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const expectedRoles = route.data?.['roles'] as string[] | undefined;

  return authService.getUser().pipe(
    map((user) => {
      if (!user) {
        // ✅ RETURN a redirect UrlTree, instead of navigate()
        alertService.showErrorMessage({ messages: ['COMMON.NOT_AUTHORIZED'] });
        return router.createUrlTree(['/login']);
      }

      if (!expectedRoles || expectedRoles.length === 0) {
        return true;
      }

      const userHasRole = user.roles.some((role) => expectedRoles.includes(role));
      if (!userHasRole) {
        alertService.showErrorMessage({ messages: ['COMMON.NOT_AUTHORIZED'] });
        return router.createUrlTree(['/login']);
      }

      return true;
    })
  );
};
