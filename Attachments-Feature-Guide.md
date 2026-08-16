# Adding Attachments to a Feature

How to give any entity (visits, permissions, work missions, …) file attachments using the
shared attachment layer. Nothing in that layer knows about leaves — leaves are just the
first consumer, and this guide uses **Visit** as the worked example so you can see which
parts are yours and which are already built.

Budget: ~40 lines of your own code across 5 files, plus translations.

---

## 1. What already exists

| Piece                       | Path                                           | What it does                                                                                           |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `AttachmentService`         | `services/shared/attachment.service.ts`        | Staging upload, cancel, blob download, client-side pre-check                                           |
| `AttachmentUploadComponent` | `views/shared/attachment-upload/`              | `ControlValueAccessor` — pick, validate, stage, remove                                                 |
| `AttachmentListComponent`   | `views/shared/attachment-list/`                | Read-only list + per-file download button                                                              |
| `Attachment`                | `models/shared/attachment/attachment.ts`       | Stored file: `id`, `originalFileName`, `contentType`, `sizeBytes`, `sizeLabel`, `isPdf()`, `isImage()` |
| `TemporaryUpload`           | `models/shared/attachment/temporary-upload.ts` | Staged file: `id` (UUID), `originalFileName`, `sizeBytes`, `sizeLabel`, `expiresUtc`                   |
| `ATTACHMENT_CONSTRAINTS`    | `constants/attachment-constraints.ts`          | 3 files, 5 MiB each, 15 MiB batch, `.pdf/.jpg/.jpeg/.png`                                              |
| `SKIP_ERROR_ALERT`          | `http-interceptors/http-error-interceptor.ts`  | Per-request opt-out of the global error dialog                                                         |

You do **not** add an endpoint, a service, or an upload component. You only connect your
entity to them.

---

## 2. The backend contract this assumes

The shared layer implements the staging flow described in
[`Leave-Attachments-Frontend-API.md`](./Leave-Attachments-Frontend-API.md). Before you
start, confirm with the backend that your feature follows the same shape:

1. **`POST /temporary-uploads`** (already wired) returns short-lived UUIDs.
2. **Your create endpoint accepts `temporaryUploadIds: string[]`** and consumes them in the
   same transaction as the record.
3. **Your read endpoints embed `attachments: []`** in every record — there is no
   "get attachments for record X" endpoint, and you should not ask for one.
4. **`GET /<your-route>/{id}/attachments/{attachmentId}/content`** streams the bytes.

If your feature differs — e.g. attachments can be added _after_ create — see
[§9 Variants](#9-variants).

---

## 3. Step 1 — Model

Add both sides to your model. They are asymmetric on purpose: one is read-only, the other
is write-once.

```ts
// models/features/visit/visit.ts
import { Attachment } from '@/models/shared/attachment/attachment';
import { TemporaryUpload } from '@/models/shared/attachment/temporary-upload';

export class Visit extends BaseCrudModel<Visit, VisitService> {
  // ... existing fields

  // Files already stored against this record; read-only, never sent back
  attachments: Attachment[] = [];
  // Files staged for a record that does not exist yet; write-once, create only
  temporaryUploads: TemporaryUpload[] = [];

  buildForm() {
    const { visitDate, temporaryUploads } = this;
    return {
      // ... existing controls
      temporaryUploads: [temporaryUploads ?? []],
    };
  }
}
```

Use **field initializers, not `declare`** for these two. `declare` emits no runtime field, so
a `new Visit()` would start with `undefined` and the template would break before the first
API response lands.

---

## 4. Step 2 — Interceptor

`receive` turns the plain JSON into `Attachment` instances so `sizeLabel` / `isPdf()` work in
templates. `send` converts staged uploads into the ids the API wants — **on create only**.

```ts
// model-interceptors/features/visit/visit-interceptor.ts
import { toAttachments } from '@/models/shared/attachment/attachment';

export class VisitInterceptor implements ModelInterceptorContract<Visit> {
  receive(model: Visit): Visit {
    // ... existing date conversions
    model.attachments = toAttachments(model.attachments);
    return model;
  }

  send(model: Partial<Visit>): Partial<Visit> {
    const payload: VisitRequestPayload = {
      /* ... existing fields */
    };

    if (model.id) {
      payload.id = model.id;
      payload.concurrencyUpdateVersion = model.concurrencyUpdateVersion;
    } else {
      // Deduped: the API rejects a list naming the same upload twice.
      payload.temporaryUploadIds = [
        ...new Set((model.temporaryUploads ?? []).map((upload) => upload.id)),
      ];
    }

    return payload as unknown as Partial<Visit>;
  }
}
```

Declare the wire shape as a local interface rather than leaning on `Partial<Visit>` — the
payload is deliberately narrower than the model, and several of these APIs reject unknown
JSON properties outright (`UnmappedMemberHandling.Disallow`). Sending `attachments` or
`temporaryUploads` back would fail the whole request.

---

## 5. Step 3 — Service

One method. The URL belongs to your feature's route, which is exactly why the shared service
does not build it for you.

```ts
// services/features/visit/visit.service.ts
import { AttachmentService } from '@/services/shared/attachment.service';

export class VisitService extends BaseCrudService<Visit, number> {
  private attachmentService = inject(AttachmentService);

  downloadAttachment(visitId: number, attachmentId: number): Observable<Blob> {
    return this.attachmentService.downloadContent(
      `${this.getUrlSegment()}/${visitId}/attachments/${attachmentId}/content`
    );
  }
}
```

Do not add `@CastResponse()` here — the response is a blob, not a model.

---

## 6. Step 4 — The create form

### Component

```ts
import { AttachmentUploadComponent } from '@/views/shared/attachment-upload/attachment-upload.component';

@Component({
  imports: [/* ... */ AttachmentUploadComponent],
})
export class VisitAddEditPopupComponent extends BasePopupComponent<Visit> {
  @ViewChild(AttachmentUploadComponent) attachmentUpload?: AttachmentUploadComponent;

  beforeSave(model: Visit, form: FormGroup) {
    // Submitting mid-upload would save the record without the file just picked.
    if (this.temporaryUploadsControl?.hasError('attachmentsUploading')) {
      this.alertService.showErrorMessage({ messages: ['ATTACHMENTS.WAIT_FOR_UPLOAD'] });
      return false;
    }
    return form.valid;
  }

  afterSave() {
    // The record now owns the staged files, so closing must not cancel them.
    this.attachmentUpload?.markAsConsumed();
    this.alertService.showSuccessMessage({ messages: ['COMMON.SAVED_SUCCESSFULLY'] });
  }

  get temporaryUploadsControl() {
    return this.form.get('temporaryUploads') as FormControl | null;
  }
}
```

### Template

Must be inside the `<form [formGroup]="form">`.

```html
@if (isCreateMode) {
  <app-attachment-upload
    formControlName="temporaryUploads"
    titleKey="VISITS_PAGE.UPLOAD_ATTACHMENT"
  />
}
```

That is the whole upload feature. Picking files uploads them immediately, invalid files are
rejected inline before the user fills in the rest of the form, removing a file releases it
server-side, and abandoning the form releases everything still staged.

> **`markAsConsumed()` is not optional.** The uploader cancels its staged files when it is
> destroyed, which is what makes an abandoned form clean up after itself. Skip the call and
> a successful save will immediately delete the files it just attached. Call it in
> `afterSave` — or wherever your feature learns the save succeeded — _before_ the view is
> torn down.

---

## 7. Step 5 — Showing and downloading

`AttachmentListComponent` renders nothing when the list is empty, so it needs no `@if`
around it. Pass the request in as an arrow function; the component owns the busy state,
the empty-blob guard, the filename and the error message.

```ts
import { AttachmentListComponent } from '@/views/shared/attachment-list/attachment-list.component';

@Component({ imports: [/* ... */ AttachmentListComponent] })
export class VisitViewPopupComponent {
  /** Bound as a value, so it has to stay an arrow to keep `this`. */
  downloadAttachment = (attachment: Attachment): Observable<Blob> =>
    this.service.downloadAttachment(this.model.id, attachment.id);
}
```

```html
<app-attachment-list
  [attachments]="model.attachments"
  [download]="downloadAttachment"
  labelKey="VISITS_PAGE.ATTACHMENTS"
/>
```

A **method** here (`downloadAttachment(a) { ... }`) will throw on `this` — the component
calls the input as a bare function. Keep the arrow-property form.

Put this on every screen that shows the record: the view popup, and any add/edit popup in a
view-only or approval mode, where a reviewer needs to open the file before deciding.

---

## 8. Step 6 — Translations

Add two keys to your feature's section of `public/assets/i18n/{ar,en}.json`:

```json
"VISITS_PAGE": {
  "UPLOAD_ATTACHMENT": "Upload Visit Attachment",
  "ATTACHMENTS": "Visit Attachments"
}
```

Everything else is already translated. The generic `ATTACHMENTS.*` section covers the
uploader's own labels and client-side errors, and all 21 backend `ATTACHMENT_*` /
`TEMPORARY_UPLOAD_*` `messageKey`s are in `COMMON`, so server-side validation failures
surface translated through the global error interceptor with no work from you.

Both `titleKey` and `labelKey` are optional — omit them for the generic
"Upload Attachment" / "Attachments" wording.

---

## 9. Variants

### Different limits

```ts
readonly pdfOnly = ['.pdf'];
readonly twoMegabytes = 2 * 1024 * 1024;
```

```html
<app-attachment-upload
  formControlName="temporaryUploads"
  [maxFiles]="1"
  [maxFileSizeBytes]="twoMegabytes"
  [allowedExtensions]="pdfOnly"
/>
```

Bind a field rather than an inline `['.pdf']` literal — a literal builds a new array on
every change-detection pass, and these are signal inputs, so each new reference counts as a
change.

The three inputs drive validation _and_ the hint text _and_ the `accept` attribute together.
They do not change what the server accepts: tightening them past the backend's config is
fine, loosening them just means the server rejects the file one round trip later.

### Attachments editable after create

The shared layer supports this; the leave API does not, which is why the leave form is
create-only. If your endpoint accepts `temporaryUploadIds` on update too:

- render `<app-attachment-upload>` in edit mode as well,
- send `temporaryUploadIds` from the `if (model.id)` branch of `send()` too,
- and render `<app-attachment-list>` alongside it so the user sees existing files while
  adding new ones.

You will also need a "delete stored attachment" endpoint — `AttachmentService.cancelUpload`
only releases _staged_ files, never stored ones.

### Outside a reactive form

Use the service directly; it has no dependency on the component.

```ts
const errors = this.attachmentService.validateFiles(files, { maxFiles: 1 });
if (errors.length) {
  // { messageKey, params } — translate, then substitute {name}/{size}/{max}/{types}
  return;
}
this.attachmentService.upload(files).subscribe((staged) => (this.staged = staged));
// and when the user walks away:
this.attachmentService.releaseUploads(this.staged.map((upload) => upload.id));
```

You then own the cleanup that the component would have done for you.

---

## 10. Rules worth not relearning

- **Never set `Content-Type` on an upload.** The browser has to add the multipart boundary.
  The shared service already gets this right; only relevant if you hand-roll a call.
- **Client-side validation is UX, not security.** The server re-checks magic bytes and
  decodes the image/PDF regardless. A renamed `.txt` gets past the browser and is rejected
  by the API — that is working as intended.
- **A 404 from the download endpoint means "not accessible", not "missing".** It is
  deliberate: the API hides whether the record exists from callers who cannot see it. Do not
  retry, and do not word the message as "file not found".
- **Blob requests carry `SKIP_ERROR_ALERT`.** The error body of a blob response is itself a
  blob, which the global interceptor cannot parse — it would show "unknown error". Report
  the failure at the call site instead. `AttachmentListComponent` already does.
- **Staged files expire after 24h.** Cancellation is a courtesy to storage, not a
  correctness requirement — which is why `releaseUploads()` is fire-and-forget and never
  shows the user an error.

---

## 11. Checklist

- [ ] Model: `attachments` + `temporaryUploads` as initialized fields, control in `buildForm()`
- [ ] Interceptor `receive`: `toAttachments(model.attachments)`
- [ ] Interceptor `send`: `temporaryUploadIds` on the create branch only, deduped
- [ ] Service: `downloadAttachment(recordId, attachmentId)`
- [ ] Create form: `<app-attachment-upload formControlName="temporaryUploads" />` inside the `formGroup`
- [ ] `beforeSave` guards on `attachmentsUploading`
- [ ] `afterSave` calls `markAsConsumed()`
- [ ] Every read screen: `<app-attachment-list>` with an **arrow-property** download
- [ ] Two i18n keys per locale
- [ ] Verified: upload → save → reopen shows the file → download returns the right bytes
- [ ] Verified: upload → cancel the form → the staged file is gone server-side
