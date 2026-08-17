import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { UrlService } from '@/services/url.service';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { ResponseData } from '@/models/shared/response/response-data';
import { TemporaryUpload, toTemporaryUploads } from '@/models/shared/attachment/temporary-upload';
import { ATTACHMENT_CONSTRAINTS } from '@/constants/attachment-constraints';
import { SKIP_ERROR_ALERT } from '@/http-interceptors/http-error-interceptor';
import { SKIP_LOADING } from '@/http-interceptors/loading.interceptor';

/** A failed client-side pre-check, as a translation key plus its placeholder values. */
export interface AttachmentValidationError {
  messageKey: string;
  params?: Record<string, string | number>;
}

export interface AttachmentValidationOptions {
  maxFiles?: number;
  maxFileSizeBytes?: number;
  maxBatchSizeBytes?: number;
  allowedExtensions?: readonly string[];
  /** How many files are already staged; the count limit applies to the total. */
  alreadyStagedCount?: number;
}

/**
 * Feature-agnostic attachment plumbing, shared by every screen that uploads files.
 *
 * Staging is a two-step flow: files are uploaded to a temporary area first and the
 * returned UUIDs are submitted with the record that owns them, so the record and its
 * attachments are created in one transaction. Files staged but never submitted are
 * cancelled explicitly (or expire server-side after 24h).
 *
 * Downloading is left generic: the URL belongs to the owning feature's route, so each
 * feature service builds it and calls {@link downloadContent}.
 */
@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private http = inject(HttpClient);
  private urlService = inject(UrlService);

  private get temporaryUploadsUrl(): string {
    return this.urlService.URLS.TEMPORARY_UPLOADS;
  }

  /**
   * Stages files in the server's temporary area and returns their short-lived handles.
   * No `Content-Type` is set on purpose — the browser has to add the multipart boundary.
   */
  upload(files: File[]): Observable<TemporaryUpload[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));

    return this.http
      .post<ListResponseData<TemporaryUpload>>(this.temporaryUploadsUrl, formData, {
        withCredentials: true,
      })
      .pipe(map((response) => toTemporaryUploads(response.data)));
  }

  /** Releases a staged file. Idempotent server-side: cancelling twice is not an error. */
  cancelUpload(id: string): Observable<void> {
    return this.http
      .delete<ResponseData<string>>(`${this.temporaryUploadsUrl}/${id}`, {
        withCredentials: true,
      })
      .pipe(map(() => undefined));
  }

  /**
   * Best-effort release of files the user abandoned. Runs quietly: the user has already
   * moved on, and anything that slips through expires server-side within 24h anyway.
   */
  releaseUploads(ids: string[]): void {
    const context = new HttpContext().set(SKIP_ERROR_ALERT, true).set(SKIP_LOADING, true);

    ids.forEach((id) => {
      this.http
        .delete<ResponseData<string>>(`${this.temporaryUploadsUrl}/${id}`, {
          withCredentials: true,
          context,
        })
        .pipe(catchError(() => of(undefined)))
        .subscribe();
    });
  }

  /**
   * Fetches the raw bytes of a stored attachment. The error body of a blob request is
   * itself a blob, which the global error interceptor cannot read, so the alert is
   * suppressed and the caller reports the failure instead.
   */
  downloadContent(url: string): Observable<Blob> {
    return this.http.get(url, {
      withCredentials: true,
      responseType: 'blob',
      context: new HttpContext().set(SKIP_ERROR_ALERT, true),
    });
  }

  /**
   * Client-side pre-check, so obviously-invalid files fail instantly instead of after a
   * round trip. Returns every problem found, not just the first.
   */
  validateFiles(files: File[], options: AttachmentValidationOptions = {}) {
    const maxFiles = options.maxFiles ?? ATTACHMENT_CONSTRAINTS.MAX_FILES;
    const maxFileSizeBytes = options.maxFileSizeBytes ?? ATTACHMENT_CONSTRAINTS.MAX_FILE_SIZE_BYTES;
    const maxBatchSizeBytes =
      options.maxBatchSizeBytes ?? ATTACHMENT_CONSTRAINTS.MAX_BATCH_SIZE_BYTES;
    const allowedExtensions =
      options.allowedExtensions ?? ATTACHMENT_CONSTRAINTS.ALLOWED_EXTENSIONS;
    const alreadyStagedCount = options.alreadyStagedCount ?? 0;

    const errors: AttachmentValidationError[] = [];

    if (alreadyStagedCount + files.length > maxFiles) {
      errors.push({ messageKey: 'ATTACHMENTS.TOO_MANY_FILES', params: { max: maxFiles } });
    }

    const batchSize = files.reduce((total, file) => total + file.size, 0);
    if (batchSize > maxBatchSizeBytes) {
      errors.push({
        messageKey: 'ATTACHMENTS.BATCH_TOO_LARGE',
        params: { size: this.toMegabytes(maxBatchSizeBytes) },
      });
    }

    files.forEach((file) => {
      if (!allowedExtensions.includes(this.getExtension(file.name))) {
        errors.push({
          messageKey: 'ATTACHMENTS.TYPE_NOT_ALLOWED',
          params: { name: file.name, types: allowedExtensions.join(', ') },
        });
      }
      if (file.size > maxFileSizeBytes) {
        errors.push({
          messageKey: 'ATTACHMENTS.FILE_TOO_LARGE',
          params: { name: file.name, size: this.toMegabytes(maxFileSizeBytes) },
        });
      }
      if (file.size === 0) {
        errors.push({ messageKey: 'ATTACHMENTS.EMPTY_FILE', params: { name: file.name } });
      }
    });

    return errors;
  }

  private getExtension(fileName: string): string {
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
  }

  private toMegabytes(bytes: number): number {
    return Math.round(bytes / (1024 * 1024));
  }
}
