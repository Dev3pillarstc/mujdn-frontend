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

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: any) => {
      const skipKeys = ['VALIDATION_FAILED'];
      const alertService = injector.get(AlertService);
      const translateService = injector.get(TranslateService);

      let messageKey = 'COMMON.UNKNOWN_ERROR';
      let backendError = error?.error?.error;
      if (backendError?.messageKey) {
        messageKey = 'COMMON.' + backendError?.messageKey;

        if (skipKeys.includes(backendError?.messageKey)) {
          return throwError(() => error);
        }
      }

      const message = translateService.instant(messageKey);
      alertService.showErrorMessage({ messages: [message] });

      return throwError(() => error);
    })
  );
};
