import { SpinnerService } from '@/services/shared/spinner.service';
import {
  HttpContextToken,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';

/**
 * Per-request context token. Set to `true` to silently bypass the global
 * loading spinner for a specific HTTP request without affecting any other
 * concurrent requests.
 *
 * Usage:
 *   const ctx = new HttpContext().set(SKIP_LOADING, true);
 *   this.http.get('/api/...', { context: ctx });
 */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const spinnerService = inject(SpinnerService);

  // Skip spinner when the request carries the SKIP_LOADING context token,
  // or the legacy header/URL markers (kept for backwards compatibility).
  if (
    req.context.get(SKIP_LOADING) ||
    req.url.includes('/skip-loading') ||
    req.headers.has('X-Skip-Loading')
  ) {
    return next(req);
  }

  spinnerService.show();

  return next(req).pipe(
    finalize(() => {
      setTimeout(() => {
        spinnerService.hide();
      }, 123);
    })
  );
};
