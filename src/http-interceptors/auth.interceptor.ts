import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { CookieService } from '@/services/shared/cookie.service';
import { COOKIE_ENUM } from '@/enums/cookie-enum';
import { AuthService } from '@/services/auth/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from '@/services/config.service';
import { UrlService } from '@/services/url.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const configService = inject(ConfigService);
  const urlService = inject(UrlService);

  const isExternal =
    (req.url.startsWith('https') || req.url.startsWith('http')) &&
    !req.url.startsWith(urlService.config.BASE_URL);

  const isAsset = /\.(js|css|png|jpg|json|jpeg|svg|ico|woff2?)$/i.test(splitQueryParams(req.url));
  const isApi = req.url.startsWith(configService.CONFIG.BASE_URL);

  function splitQueryParams(url: string): string {
    return url.split('?')[0];
  }
  const excludedAuthPaths = [
    '/auth/login',
    '/auth/forget-password',
    '/auth/new-password',
    '/auth/sent-link',
  ];

  const isExcluded = excludedAuthPaths.some((path) => req.url.includes(path));

  if (isExternal || isAsset || !isApi || isExcluded) {
    return next(req); // 🚫 Skip interceptor logic
  }

  // ✅ Continue with auth handling
  return next(req).pipe(
    tap((response) => {
      if (response instanceof HttpResponse) {
        if (req.url.includes('logout')) {
          authService.setUser(undefined);
          router.navigate(['/login']);
        } else {
          const userDataCookie = cookieService.getCookie(COOKIE_ENUM.USER_DATA);
          if (userDataCookie && userDataCookie.version) {
            if (
              !authService.getUser().value ||
              authService.getUser().value!.version !== userDataCookie.version
            ) {
              authService.setUser(userDataCookie);
            }
          } else {
            authService.setUser(undefined);
            authService.logout().subscribe();
          }
        }
      }
    }),
    catchError((error) => {
      console.error(`[Interceptor Error] ${req.method} ${req.url}`, {
        status: error.status,
        message: error.message,
        error,
      });
      return throwError(() => error);
    })
  );
};
