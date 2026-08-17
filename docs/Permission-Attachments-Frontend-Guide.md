# Permission Attachments — Angular Frontend Guide

## Purpose

Employees can attach up to three supporting files (PDF or image) to a permission request. This guide covers everything the Angular app needs: the upload flow, the changed create-permission contract, how attachments come back on the list screens, and how to download one.

> **Breaking change — read this first.** `POST /api/Permissions` no longer accepts a full `PermissionModel` body. It now accepts a small create-request object, and the API rejects any property it does not recognise. See [4. Create the Permission](#4-create-the-permission).

## Table of Contents

1. [How the flow works](#how-the-flow-works)
2. [Limits and rules](#limits-and-rules)
3. [Authentication and shared contracts](#authentication-and-shared-contracts)
4. [1. Upload files to staging](#1-upload-files-to-staging)
5. [2. Remove a staged file](#2-remove-a-staged-file)
6. [3. Data contracts](#3-data-contracts)
7. [4. Create the Permission](#4-create-the-permission)
8. [5. Read attachments on the list screens](#5-read-attachments-on-the-list-screens)
9. [6. Download an attachment](#6-download-an-attachment)
10. [Angular implementation](#angular-implementation)
11. [Error keys for i18n](#error-keys-for-i18n)
12. [Behaviour you must design around](#behaviour-you-must-design-around)

---

## How the flow works

Files are **not** sent with the permission form. They are uploaded first to a temporary staging area, which returns a UUID per file. Those UUIDs are then submitted with the permission, and the backend converts them into permanent attachments inside the same database transaction as the permission insert.

```mermaid
sequenceDiagram
    participant U as User
    participant A as Angular
    participant API as Backend

    U->>A: picks file(s)
    A->>API: POST /api/temporary-uploads (multipart)
    API-->>A: 201 [{ id: uuid, originalFileName, contentType, sizeBytes, expiresUtc }]
    Note over A: hold the UUIDs in form state
    U->>A: removes a file before saving
    A->>API: DELETE /api/temporary-uploads/{uuid}
    U->>A: submits the form
    A->>API: POST /api/Permissions { ..., temporaryUploadIds: [uuid] }
    API-->>A: 200 PermissionModel (with attachments[])
```

Why two steps: the user gets immediate per-file validation feedback (wrong type, too large) while still filling in the form, and the permission is never half-created with unusable files. A staged file that is never submitted is cleaned up automatically after 24 hours.

---

## Limits and rules

Enforce these client-side too, so the user gets instant feedback instead of a round-trip.

| Rule | Value | Notes |
|---|---|---|
| Max files per permission | **3** | Applies both to one upload call and to the total `temporaryUploadIds` sent on create |
| Max size per file | **5 MiB** (5,242,880 bytes) | |
| Max total size per upload call | **15 MiB** (15,728,640 bytes) | |
| Hard request limit | **20 MiB** | Transport ceiling; you should never reach it if you enforce the above |
| Allowed types | `.pdf`, `.jpg`, `.jpeg`, `.png` | |
| Max image dimensions | 10,000 × 10,000 and 40 MP total | PDFs are exempt |
| Staged file lifetime | **24 hours** | After that the UUID is dead and create will fail |
| Empty files | Rejected | |

The server does not trust the file extension or the browser's `Content-Type`. It reads the file's magic bytes and parses the PDF/image structure. A `.pdf` that is actually a renamed `.exe` is rejected with `ATTACHMENT_SIGNATURE_INVALID`, and a truncated or corrupt image is rejected with `ATTACHMENT_CONTENT_MALFORMED`. Client-side extension checks are a convenience, not a guarantee — always handle these errors.

---

## Authentication and shared contracts

Auth is a **`HttpOnly` cookie** (`access_token`), not a header you control. Every request in this guide must be sent with credentials:

```ts
this.http.post(url, body, { withCredentials: true });
```

If you have a global `withCredentials` interceptor, these calls are already covered. **Do not** set `Content-Type` manually on the upload call — the browser must generate the `multipart/form-data` boundary itself.

Every JSON endpoint returns the standard envelope:

```ts
interface ApiResponse<T> {
  data?: T;
  error: {
    messageKey: string;                    // stable i18n key — switch on this
    message: string;                       // English fallback, for debugging only
    details?: Record<string, string[]>;    // present on validation failures
  } | null;
}
```

Always branch on `error.messageKey`, never on `error.message`.

---

## 1. Upload files to staging

```http
POST /api/temporary-uploads
Content-Type: multipart/form-data
```

The form field name must be exactly **`files`**, repeated once per file.

**Response `201 Created`**

```json
{
  "data": [
    {
      "id": "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
      "originalFileName": "medical-report.pdf",
      "contentType": "application/pdf",
      "sizeBytes": 148213,
      "expiresUtc": "2026-08-17T09:14:22.113Z"
    }
  ],
  "error": null
}
```

**The batch is atomic.** If any file in the call fails validation, the whole call fails and *no* UUIDs are returned — the files that did pass are discarded server-side. Upload files **one per call** if you want per-file error reporting in the UI; that also makes a single bad file easy to flag without forcing the user to re-pick the others.

---

## 2. Remove a staged file

Call this when the user removes a file from the form *before* submitting, so the file does not sit on disk for 24 hours.

```http
DELETE /api/temporary-uploads/{temporaryUploadId}
```

Returns `200` with `data` set to a confirmation string. Notable responses:

| Status | `messageKey` | When |
|---|---|---|
| 404 | `TEMPORARY_UPLOAD_NOT_FOUND` | Unknown UUID, or it belongs to another user |
| 409 | `TEMPORARY_UPLOAD_ALREADY_CONSUMED` | The permission was already created with it |

Cancelling an already-cancelled or expired upload succeeds silently, so this is safe to fire-and-forget. If the user abandons the whole form, cancelling is polite but not required — the cleanup job handles it.

---

## 3. Data contracts

```ts
/** Returned by POST /api/temporary-uploads. Lives for 24h until consumed. */
interface TemporaryUpload {
  id: string;              // UUID — this is what you send on create
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  expiresUtc: string;      // ISO-8601 UTC
}

/** A saved attachment, as returned on PermissionModel. */
interface PermissionAttachment {
  id: number;              // attachment id — use this in the download URL
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
}

/** Request body for POST /api/Permissions. These five fields and nothing else. */
interface CreatePermissionRequest {
  permissionDate: string;          // "YYYY-MM-DD"
  fkReasonId: number;              // >= 1
  fkPermissionTypeId: number;      // >= 1
  description: string;             // required, max 250 chars
  temporaryUploadIds: string[];    // 0–3 UUIDs; send [] when there are no files
}
```

> The three ID types are easy to confuse. `TemporaryUpload.id` is a **UUID** and is only valid before create. `PermissionAttachment.id` is an **integer** and is what the download URL takes. Neither is the underlying stored-file id, which is never exposed.

---

## 4. Create the Permission

```http
POST /api/Permissions
Content-Type: application/json
```

```json
{
  "permissionDate": "2026-08-20",
  "fkReasonId": 3,
  "fkPermissionTypeId": 1,
  "description": "Medical appointment",
  "temporaryUploadIds": ["3f2504e0-4f89-11d3-9a0c-0305e82c3301"]
}
```

### ⚠️ The body must contain these five fields and no others

The API is configured to **reject unknown JSON properties**. If you keep the old habit of posting a whole `PermissionModel` — with `id`, `fkStatusId`, `status`, `creationUser`, `canTakeAction`, and so on — the request fails with `400 VALIDATION_FAILED` before any business logic runs. Build a dedicated `CreatePermissionRequest` object; do not reuse the grid's row model.

`description` is required and cannot be empty. `temporaryUploadIds` must be present; send `[]` when the user attached nothing.

**Response `200 OK`** returns the created `PermissionModel`, whose `attachments` array reflects what was saved. Use it to update the grid without a refetch.

### Failure responses

| Status | `messageKey` | Meaning and what to show |
|---|---|---|
| 400 | `VALIDATION_FAILED` | Malformed body or an unknown property. Inspect `error.details`. This is a bug in your payload, not user error |
| 400 | `DAILY_PERMISSION_LIMIT_EXCEEDED` | The user already has a permission that day |
| 400 | `MONTHLY_PERMISSION_LIMIT_EXCEEDED` | Monthly quota reached |
| 400 | `ATTACHMENT_TOO_MANY_FILES` | More than 3 UUIDs sent |
| 400 | `TEMPORARY_UPLOAD_IDS_INVALID` | Empty-GUID or duplicate entries in the array |
| 404 | `TEMPORARY_UPLOAD_NOT_FOUND` | A UUID is unknown, or was uploaded by a different user |
| 409 | `TEMPORARY_UPLOAD_NOT_AVAILABLE` | A UUID expired (>24h) or was already used |

**Nothing is partially saved.** All of it — the permission row and the attachment links — commits or rolls back together. If create fails, the staged UUIDs are still valid (unless they expired), so the user can fix the form and resubmit with the same IDs. Do not clear the attachment list from your form state on a failed submit.

---

## 5. Read attachments on the list screens

Both paginated endpoints now return an `attachments` array on every row. No request change is needed.

```http
POST /api/Permissions/GetWithPaging                        # my permissions
POST /api/Permissions/GetDepartmentPermissionsWithPaging   # department permissions
```

```json
{
  "data": {
    "list": [
      {
        "id": 512,
        "permissionDate": "2026-08-20",
        "description": "Medical appointment",
        "fkStatusId": 1,
        "canTakeAction": false,
        "attachments": [
          {
            "id": 87,
            "originalFileName": "medical-report.pdf",
            "contentType": "application/pdf",
            "sizeBytes": 148213
          }
        ]
      }
    ],
    "paginationInfo": { "currentPage": 1, "pageSize": 10, "totalPages": 4, "totalItems": 34 }
  },
  "error": null
}
```

The array is always present and is `[]` when there are no attachments — no null check needed. It is ordered oldest-first and excludes files that are pending deletion, so anything listed is downloadable.

Approvers see attachments on the department grid, which is the point: they can review the evidence before accepting or rejecting.

---

## 6. Download an attachment

```http
GET /api/Permissions/{permissionId}/attachments/{attachmentId}/content
```

`attachmentId` is `attachments[].id` from the row. Both IDs are checked together — an attachment id that belongs to a different permission returns 404.

Three things to get right:

**Use `responseType: 'blob'` with credentials.** Do not build a plain `<a href>` or `window.open` — a denied or missing file returns a JSON error body, which would open a blank tab or download a file full of JSON instead of showing an error.

**Take the filename from the row, not the response.** The server sends `Content-Disposition`, but CORS does not expose that header to JavaScript, so `Content-Disposition` will read as `null` in the browser. Use the `originalFileName` you already have on `attachments[]`.

**Treat 404 as "not available".** Authorization failures deliberately return `404 RESOURCE_NOT_FOUND` rather than 403, so the API never reveals whether a permission exists to someone who may not see it. Show a neutral "attachment is not available" message; do not word it as a permissions error.

Who can download: the employee who filed the permission, an HR officer within their department scope, and a department manager for their own and descendant departments (excluding managers they only temporarily cover). This mirrors the visibility of the department grid, so in practice anyone who can see the row can open its attachments.

---

## Angular implementation

### Service

```ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export const ATTACHMENT_LIMITS = {
  maxFiles: 3,
  maxFileSizeBytes: 5 * 1024 * 1024,
  maxBatchSizeBytes: 15 * 1024 * 1024,
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
} as const;

@Injectable({ providedIn: 'root' })
export class PermissionAttachmentService {
  private readonly http = inject(HttpClient);

  /** Upload a single file. Call once per file so each can fail independently. */
  upload(file: File): Observable<TemporaryUpload> {
    const form = new FormData();
    form.append('files', file, file.name);   // field name must be "files"

    // No Content-Type header — the browser sets the multipart boundary.
    return this.http
      .post<ApiResponse<TemporaryUpload[]>>('/api/temporary-uploads', form, {
        withCredentials: true,
      })
      .pipe(map(res => res.data![0]));
  }

  cancel(temporaryUploadId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<string>>(`/api/temporary-uploads/${temporaryUploadId}`, {
        withCredentials: true,
      })
      .pipe(map(() => void 0));
  }

  createPermission(request: CreatePermissionRequest): Observable<PermissionModel> {
    // Send exactly this shape. Extra properties are rejected by the API.
    return this.http
      .post<ApiResponse<PermissionModel>>('/api/Permissions', request, {
        withCredentials: true,
      })
      .pipe(map(res => res.data!));
  }

  download(permissionId: number, attachment: PermissionAttachment): Observable<void> {
    return this.http
      .get(`/api/Permissions/${permissionId}/attachments/${attachment.id}/content`, {
        responseType: 'blob',
        withCredentials: true,
      })
      .pipe(map(blob => this.saveAs(blob, attachment.originalFileName)));
  }

  /** Filename comes from the row: CORS does not expose Content-Disposition. */
  private saveAs(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

### Client-side pre-validation

Catching these before the request saves a round-trip, but keep the server error handling — only the server checks the file's actual content.

```ts
function validate(file: File, alreadyStaged: TemporaryUpload[]): string | null {
  if (alreadyStaged.length >= ATTACHMENT_LIMITS.maxFiles) return 'ATTACHMENT_TOO_MANY_FILES';
  if (file.size === 0) return 'ATTACHMENT_EMPTY_FILE';
  if (file.size > ATTACHMENT_LIMITS.maxFileSizeBytes) return 'ATTACHMENT_FILE_TOO_LARGE';

  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ATTACHMENT_LIMITS.allowedExtensions.includes(extension as never)) {
    return 'ATTACHMENT_TYPE_NOT_ALLOWED';
  }

  const total = alreadyStaged.reduce((sum, f) => sum + f.sizeBytes, file.size);
  if (total > ATTACHMENT_LIMITS.maxBatchSizeBytes) return 'ATTACHMENT_BATCH_TOO_LARGE';

  return null;
}
```

Reuse the same `messageKey` strings your error interceptor already translates, so pre-validation and server rejections render identically.

### Form component sketch

```ts
readonly staged = signal<TemporaryUpload[]>([]);

onFilesPicked(files: FileList): void {
  for (const file of Array.from(files)) {
    const clientError = validate(file, this.staged());
    if (clientError) { this.toast.error(this.i18n.translate(clientError)); continue; }

    this.attachments.upload(file).subscribe({
      next: staged => this.staged.update(list => [...list, staged]),
      error: (err: HttpErrorResponse) =>
        this.toast.error(this.i18n.translate(err.error?.error?.messageKey ?? 'SERVER_ERROR')),
    });
  }
}

removeStaged(upload: TemporaryUpload): void {
  this.staged.update(list => list.filter(x => x.id !== upload.id));
  this.attachments.cancel(upload.id).subscribe({ error: () => {} }); // best-effort
}

submit(): void {
  const request: CreatePermissionRequest = {
    permissionDate: this.form.value.permissionDate,
    fkReasonId: this.form.value.fkReasonId,
    fkPermissionTypeId: this.form.value.fkPermissionTypeId,
    description: this.form.value.description,
    temporaryUploadIds: this.staged().map(x => x.id),
  };

  this.attachments.createPermission(request).subscribe({
    next: created => { this.staged.set([]); this.dialogRef.close(created); },
    // Keep this.staged() intact — the UUIDs are still usable on retry.
    error: (err: HttpErrorResponse) =>
      this.toast.error(this.i18n.translate(err.error?.error?.messageKey ?? 'SERVER_ERROR')),
  });
}
```

---

## Error keys for i18n

Add these to the translation files. All arrive as `error.messageKey`.

| Key | Suggested English | Suggested Arabic |
|---|---|---|
| `ATTACHMENT_FILES_REQUIRED` | At least one file is required. | يجب إرفاق ملف واحد على الأقل. |
| `ATTACHMENT_TOO_MANY_FILES` | You can attach up to 3 files. | يمكنك إرفاق ٣ ملفات كحد أقصى. |
| `ATTACHMENT_FILE_TOO_LARGE` | Each file must be 5 MB or smaller. | يجب ألا يتجاوز حجم الملف ٥ ميجابايت. |
| `ATTACHMENT_BATCH_TOO_LARGE` | Total attachment size must be 15 MB or smaller. | يجب ألا يتجاوز إجمالي حجم المرفقات ١٥ ميجابايت. |
| `ATTACHMENT_EMPTY_FILE` | The file is empty. | الملف فارغ. |
| `ATTACHMENT_TYPE_NOT_ALLOWED` | Only PDF, JPEG, and PNG files are allowed. | يُسمح فقط بملفات PDF و JPEG و PNG. |
| `ATTACHMENT_SIGNATURE_INVALID` | The file content could not be verified. | تعذر التحقق من محتوى الملف. |
| `ATTACHMENT_EXTENSION_MISMATCH` | The file extension does not match its content. | امتداد الملف لا يطابق محتواه. |
| `ATTACHMENT_CONTENT_MALFORMED` | The file is corrupt or unreadable. | الملف تالف أو غير قابل للقراءة. |
| `ATTACHMENT_IMAGE_DIMENSIONS_EXCEEDED` | The image dimensions are too large. | أبعاد الصورة كبيرة جدًا. |
| `ATTACHMENT_FILE_NAME_INVALID` | The file name is invalid. | اسم الملف غير صالح. |
| `ATTACHMENT_STORAGE_UNAVAILABLE` | File storage is temporarily unavailable. | خدمة تخزين الملفات غير متاحة مؤقتًا. |
| `TEMPORARY_UPLOAD_NOT_FOUND` | The uploaded file is no longer available. | الملف المرفوع لم يعد متاحًا. |
| `TEMPORARY_UPLOAD_NOT_AVAILABLE` | An attachment expired. Please upload it again. | انتهت صلاحية أحد المرفقات. يرجى رفعه مرة أخرى. |
| `TEMPORARY_UPLOAD_ALREADY_CONSUMED` | The attachment is already linked to a request. | المرفق مرتبط بالفعل بطلب. |
| `TEMPORARY_UPLOAD_FILE_NOT_AVAILABLE` | An attachment is no longer available. Please upload it again. | أحد المرفقات لم يعد متاحًا. يرجى رفعه مرة أخرى. |
| `TEMPORARY_UPLOAD_IDS_INVALID` | Invalid attachment references. | مراجع المرفقات غير صالحة. |
| `RESOURCE_NOT_FOUND` | The attachment is not available. | المرفق غير متاح. |
| `VALIDATION_FAILED` | Please check the entered data. | يرجى التحقق من البيانات المدخلة. |

`ATTACHMENT_STORAGE_UNAVAILABLE` returns HTTP 503 and means the file server is down, not that the user did anything wrong — word it as a retry-later message.

---

## Behaviour you must design around

**Attachments are set at creation only.** There is no endpoint to add or remove an attachment on an existing permission. `PUT /api/Permissions` ignores attachments entirely; editing a permission leaves its files untouched. The edit dialog should render existing attachments read-only (name, size, download) with no add or delete control. If the user needs different files, they delete the permission and create a new one — which is only possible while the status is New.

**Deleting a permission removes its attachments.** Only permissions in status New can be deleted (`CANNOT_BE_DELETE` otherwise). The files then enter a 30-day retention window before permanent removal, but they disappear from the API immediately. No extra call is needed.

**Staged UUIDs are single-use and user-scoped.** Once consumed they cannot be reused; a second create with the same UUID fails with `TEMPORARY_UPLOAD_NOT_FOUND`. They are also tied to the uploading user, so they cannot be shared across sessions or users.

**Watch the 24-hour clock on long-lived forms.** A draft left open overnight will hold expired UUIDs and fail on submit with `TEMPORARY_UPLOAD_NOT_AVAILABLE`. If a form can stay open that long, compare `expiresUtc` before submitting and prompt the user to re-upload.

**The upload call is the slow one.** Show a per-file progress indicator (`reportProgress: true` with `observe: 'events'`) and disable the submit button while any upload is in flight, so the user cannot submit with a UUID that has not arrived yet.

---

## Related documents

- `Docs/Attachment-Integration-Guide.md` — backend guide for adding attachments to another entity.
- `Docs/Staged-Leave-Attachment-Implementation.md` — the original design, including the full validation and security model.
- Leave requests use the identical flow with the same staging endpoint; only the create route and the attachment sub-route differ (`/api/leaves/{leaveId}/attachments/{attachmentId}/content`).
