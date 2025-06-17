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

  // ✅ Optional filter: skip non-API or external requests
  const isExternal =
    (req.url.startsWith('https') || req.url.startsWith('http')) &&
    !req.url.startsWith(urlService.config.BASE_URL);
  const isAsset = /\.(js|css|png|jpg|json|jpeg|svg|ico|woff2?)$/i.test(req.url);
  const isApi = req.url.startsWith(configService.CONFIG.BASE_URL); // adjust to your API base

  if (isExternal || isAsset || !isApi) {
    return next(req); // 🚫 skip processing
  }

  return next(req).pipe(
    tap((response) => {
      if (response instanceof HttpResponse) {
        if (req.url.includes('logout')) {
          authService.setUser(null);
          router.navigate(['/login']);
          return; // ✅ optional, now safely exits from this block
        } else {
          const userDataCookie = cookieService.getCookie(COOKIE_ENUM.USER_DATA);
          if (userDataCookie && userDataCookie.version) {
            if (
              !authService.getUser().value ||
              !(authService.getUser().value!.version == userDataCookie.version)
            ) {
              authService.setUser(userDataCookie);
            }
          } else {
            authService.setUser(null);
            authService.logout();
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
