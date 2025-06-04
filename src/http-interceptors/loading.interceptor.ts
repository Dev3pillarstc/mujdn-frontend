import { SpinnerService } from '@/services/shared/spinner.service';
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, finalize, timeout } from 'rxjs';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  
  const spinnerService = inject(SpinnerService);

  // Skip loading for certain requests (optional)
  if (req.url.includes('/skip-loading') || req.headers.has('X-Skip-Loading')) {
    return next(req);
  }

  spinnerService.show();
  
  return next(req).pipe(
    finalize(() => {
        spinnerService.hide();
    })
  );
};