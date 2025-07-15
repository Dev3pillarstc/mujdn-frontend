import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '@/services/auth/auth.service';
import { AlertService } from '@/services/shared/alert.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const expectedRoles = route.data?.['roles'] as string[] | undefined;

  console.log('Activated Route:', route.routeConfig?.path);
  console.log('Full URL:', state.url);

  return authService.refreshToken().pipe(
    switchMap(() => {
      return authService.getUser().pipe(
        map((user) => {
          if (!user) {
            alertService.showErrorMessage({ messages: ['COMMON.NOT_AUTHORIZED'] });
            return router.createUrlTree(['/login']);
          }

          if (!expectedRoles || expectedRoles.length === 0) {
            return true;
          }

          const userHasRole = user.roles.some((role) => expectedRoles.includes(role));
          if (!userHasRole) {
            return router.createUrlTree(['/404']);
          }

          return true;
        })
      );
    })
  );
};
