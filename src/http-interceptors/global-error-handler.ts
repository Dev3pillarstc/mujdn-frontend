import { ErrorHandler, inject } from '@angular/core';
import { AlertService } from '@/services/shared/alert.service';
import { TranslateService } from '@ngx-translate/core';

export function globalErrorHandler() {
  return {
    provide: ErrorHandler,
    useFactory: () => {
      const alertService = inject(AlertService);
      const translateService = inject(TranslateService);

      return {
        handleError: (error: any) => {
          let messageKey = 'COMMON.UNKNOWN_ERROR';
          if (error?.messageKey) {
            messageKey = 'COMMON.' + error?.messageKey;
          }
          const message = translateService.instant(messageKey);
          alertService.showErrorMessage({ messages: [message] });
        },
      };
    },
  };
}
