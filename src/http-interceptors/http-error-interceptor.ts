import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError, timer } from 'rxjs';
import { inject, Injector } from '@angular/core';
import { AlertService } from '@/services/shared/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '@/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { BACKEND_ERROR_ENUM } from '@/enums/backend-error-enum';
import { buildTranslationParams } from '@/utils/general-helper';

// const excludedErrorPaths = [
//   '/PasswordReset/request',
//   '/PasswordReset/verify',
//   '/PasswordReset/reset',
// ];

// function isExcludedErrorUrl(url: string): boolean {
//   const cleanUrl = url.split('?')[0];
//   return excludedErrorPaths.some((path) => cleanUrl.includes(path));
// }

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const injector = inject(Injector);
  return next(req).pipe(
    catchError((error: any) => {
      const notAuthorizedErrorKey = BACKEND_ERROR_ENUM.NOT_AUTHORIZED;
      const validationFailedErrorKey = BACKEND_ERROR_ENUM.VALIDATION_FAILED;
      const forbiddenActionErrorKey = BACKEND_ERROR_ENUM.FORBIDDEN_ACTION;
      const skipKeys = [validationFailedErrorKey, notAuthorizedErrorKey, forbiddenActionErrorKey];

      const alertService = injector.get(AlertService);
      const translateService = injector.get(TranslateService);
      const router = injector.get(Router);
      const authService = injector.get(AuthService);
      const matDialog = injector.get(MatDialog);

      let messageKey = 'COMMON.UNKNOWN_ERROR';
      let backendError = error?.error?.error;

      if (backendError?.messageKey === notAuthorizedErrorKey && authService.isAuthenticated) {
        matDialog.closeAll();
        router.navigate(['/403']);
      }

      // In http-error-interceptor.ts
      if (backendError?.messageKey === forbiddenActionErrorKey) {
        // Show error message
        const dialogRef = alertService.showErrorMessageWithRedirect({
          messages: ['COMMON.' + forbiddenActionErrorKey],
        });

        // After dialog closes, close all dialogs and reload
        dialogRef.afterClosed().subscribe(() => {
          matDialog.closeAll();
          timer(100).subscribe(() => window.location.reload());
        });

        return throwError(() => error);
      }

      if (backendError?.messageKey) {
        messageKey = 'COMMON.' + backendError?.messageKey;

        if (skipKeys.includes(backendError?.messageKey)) {
          return throwError(() => error);
        }

        if (backendError?.details) {
          const translationParams = buildTranslationParams(backendError.details, translateService);
          const message = translateService.instant(messageKey, translationParams);
          alertService.showErrorMessage({ messages: [message] });
          return throwError(() => error);
        }
      }

      const message = translateService.instant(messageKey);
      alertService.showErrorMessage({ messages: [message] });
      return throwError(() => error);
    })
  );
};
