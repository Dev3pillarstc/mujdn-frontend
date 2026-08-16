import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Attachment } from '@/models/shared/attachment/attachment';
import { TemporaryUpload } from '@/models/shared/attachment/temporary-upload';

/**
 * What the record's attachments should look like once the form is saved — the value of the
 * attachment form control, in both create and edit mode.
 *
 * The two halves map straight onto the two fields the API expects:
 *
 * - `kept` — stored attachments the user has *not* removed. Their ids go out as
 *   `keptAttachmentIds`, which is a **keep-list, not a delete-list**: anything currently on
 *   the record and missing from that array is deleted server-side. Removing one here is a
 *   local edit only; nothing reaches the server until save, so cancelling the dialog or a
 *   failed submit leaves the file untouched.
 * - `staged` — files uploaded to the temporary area during this session. Their UUIDs go out
 *   as `temporaryUploadIds` and are consumed in the same transaction as the record.
 *
 * Keeping both in one control value is what lets a single validator reason about the total:
 * the 3-file cap and the "at least one file" rule both apply to kept + staged combined.
 */
export interface AttachmentSelection {
  kept: Attachment[];
  staged: TemporaryUpload[];
}

/** Shared empty value — also the probe passed to {@link attachmentsRequired}. */
export const EMPTY_ATTACHMENT_SELECTION: AttachmentSelection = { kept: [], staged: [] };

/**
 * Seeds a form control from a record. `kept` is copied rather than aliased so removing an
 * attachment in the dialog cannot mutate the grid row behind it.
 *
 * Also the fallback in `send()` for an update that never went through the attachment editor:
 * because the keep-list is authoritative, an absent selection has to mean "keep what is
 * already there" — sending `[]` instead would silently delete every file on the record.
 */
export function toAttachmentSelection(attachments?: Attachment[] | null): AttachmentSelection {
  return { kept: [...(attachments ?? [])], staged: [] };
}

export function selectedAttachmentCount(selection?: AttachmentSelection | null): number {
  return (selection?.kept?.length ?? 0) + (selection?.staged?.length ?? 0);
}

/** `keptAttachmentIds` for an update body. Deduped — the API rejects repeated ids. */
export function keptAttachmentIds(selection?: AttachmentSelection | null): number[] {
  return [...new Set((selection?.kept ?? []).map((attachment) => attachment.id))];
}

/** `temporaryUploadIds` for a create or update body. Deduped for the same reason. */
export function temporaryUploadIds(selection?: AttachmentSelection | null): string[] {
  return [...new Set((selection?.staged ?? []).map((upload) => upload.id))];
}

/**
 * "At least one file" over kept + staged, for features whose API demands an attachment.
 *
 * It reports the plain `required` key so the existing marker directive, validation messages
 * and the uploader's own error line all keep working. Angular's `Validators.required` cannot
 * be used instead: it only sees the control value as a whole, and would demand a *new* upload
 * on an edit where the user is quite reasonably keeping the file that is already there.
 *
 * `control` is not always a real AbstractControl — RequiredMarkerDirective probes composed
 * validators by calling them with a bare `{}` — so every access here stays optional.
 */
export const attachmentsRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const selection = control?.value as AttachmentSelection | null | undefined;
  return selectedAttachmentCount(selection) > 0 ? null : { required: true };
};
