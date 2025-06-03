import { spinnerService } from '@/services/shared/spinner.service';
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, finalize, timeout } from 'rxjs';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(spinnerService);

  console.log('Interceptor called for URL:', req.url);

  // Skip loading for certain requests (optional)
  if (req.url.includes('/skip-loading') || req.headers.has('X-Skip-Loading')) {
    return next(req);
  }

  loadingService.show();
  
  return next(req).pipe(
    finalize(() => {
        loadingService.hide();
    })
  );
};