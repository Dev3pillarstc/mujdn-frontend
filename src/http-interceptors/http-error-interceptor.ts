import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject, Injector } from '@angular/core';
import { AlertService } from '@/services/shared/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '@/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: any) => {
      const notAuthorizedErrorKey = 'AUTH_FORBIDDEN_ACCESS';
      const skipKeys = ['VALIDATION_FAILED', notAuthorizedErrorKey];
      const alertService = injector.get(AlertService);
      const translateService = injector.get(TranslateService);
      const router = injector.get(Router);
      const authService = injector.get(AuthService);
      const matDialog = injector.get(MatDialog);

      let messageKey = 'COMMON.UNKNOWN_ERROR';
      let backendError = error?.error?.error;

      if (backendError?.messageKey == notAuthorizedErrorKey && authService.isAuthenticated) {
        matDialog.closeAll();
        router.navigate(['/403']);
      }

      if (backendError?.messageKey) {
        messageKey = 'COMMON.' + backendError?.messageKey;

        if (skipKeys.includes(backendError?.messageKey)) {
          return throwError(() => error);
        }
      }

      const message = translateService.instant(messageKey);

      return throwError(() => error);
    })
  );
};
