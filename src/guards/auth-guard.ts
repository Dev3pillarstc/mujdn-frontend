import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '@/services/auth/auth.service';
import { AlertService } from '@/services/shared/alert.service';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const expectedRoles = route.data?.['roles'] as string[] | undefined;

  /** Function to check if user has required roles */
  const checkRoles = (user: any) => {
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }
    const userHasRole = user.roles.some((role: string) => expectedRoles.includes(role));
    if (!userHasRole) {
      return router.createUrlTree(['/403']);
    }
    return true;
  };

  return authService.getUser().pipe(
    switchMap((user) => {
      if (!user) {
        alertService.showErrorMessage({ messages: ['COMMON.NOT_AUTHORIZED'] });
        return of(router.createUrlTree(['/login']));
      }
      // User exists, so refresh token
      return authService.refreshToken().pipe(
        switchMap(() => authService.getUser()),
        map((loggedInUser) => {
          if (!loggedInUser) {
            alertService.showErrorMessage({ messages: ['COMMON.NOT_AUTHORIZED'] });
            return router.createUrlTree(['/login']);
          }
          return checkRoles(loggedInUser);
        })
      );
    })
  );
};
