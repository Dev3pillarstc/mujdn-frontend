import {
  Component,
  forwardRef,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EMPTY, finalize, Observable } from 'rxjs';
import { Attachment } from '@/models/shared/attachment/attachment';
import {
  AttachmentSelection,
  EMPTY_ATTACHMENT_SELECTION,
} from '@/models/shared/attachment/attachment-selection';
import { TemporaryUpload } from '@/models/shared/attachment/temporary-upload';
import { AttachmentService } from '@/services/shared/attachment.service';
import {
  ATTACHMENT_ACCEPT_ATTRIBUTE,
  ATTACHMENT_CONSTRAINTS,
} from '@/constants/attachment-constraints';
import { AttachmentListComponent } from '@/views/shared/attachment-list/attachment-list.component';

let nextInputId = 0;

/**
 * Reusable attachment editor. Bind it like any other form control — its value is an
 * {@link AttachmentSelection}: the stored attachments the record should keep, plus the files
 * staged during this session.
 *
 *   <app-attachment-upload formControlName="attachmentSelection" [download]="downloadAttachment" />
 *
 * The same control serves create and edit. On create the selection starts empty and only
 * `staged` ever fills up. On edit it is seeded from the record's `attachments`, and the user
 * changes a file by removing the old one and picking a new one — which is exactly the shape
 * the update endpoint wants (`keptAttachmentIds` + `temporaryUploadIds`).
 *
 * The two halves are removed very differently, and mixing them up is the easy bug here:
 *
 * - a **staged** file is released immediately via `DELETE /temporary-uploads/{uuid}`, because
 *   it belongs to nothing and would otherwise sit on disk for 24h;
 * - a **stored** attachment is only dropped from the local keep-list. Nothing is sent until
 *   save, so cancelling the dialog — or a submit that fails validation — leaves the file
 *   exactly where it was.
 *
 * Files upload as soon as they are picked, so invalid ones are rejected before the user fills
 * in the rest of the form. The control reports itself invalid while an upload is in flight,
 * which keeps a submit from racing the staging call.
 *
 * Anything still staged when the control is destroyed is released, unless the host called
 * {@link markAsConsumed} after a save that consumed it.
 */
@Component({
  selector: 'app-attachment-upload',
  imports: [TranslatePipe, AttachmentListComponent],
  templateUrl: './attachment-upload.component.html',
  styleUrl: './attachment-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttachmentUploadComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AttachmentUploadComponent),
      multi: true,
    },
  ],
})
export class AttachmentUploadComponent
  implements ControlValueAccessor, Validator, OnInit, OnDestroy
{
  titleKey = input<string>('ATTACHMENTS.UPLOAD_TITLE');
  /** Heading above the files the record already has. Only shown when there are any. */
  keptLabelKey = input<string>('ATTACHMENTS.CURRENT_FILES');
  maxFiles = input<number>(ATTACHMENT_CONSTRAINTS.MAX_FILES);
  maxFileSizeBytes = input<number>(ATTACHMENT_CONSTRAINTS.MAX_FILE_SIZE_BYTES);
  allowedExtensions = input<readonly string[]>(ATTACHMENT_CONSTRAINTS.ALLOWED_EXTENSIONS);
  /**
   * Lets the user open a stored attachment before deciding whether to replace it. Optional:
   * a create form has nothing stored, so nothing to download.
   */
  download = input<(attachment: Attachment) => Observable<Blob>>(() => EMPTY);

  private attachmentService = inject(AttachmentService);
  private translateService = inject(TranslateService);
  private injector = inject(Injector);

  readonly inputId = `attachment-upload-${nextInputId++}`;
  readonly acceptAttribute = ATTACHMENT_ACCEPT_ATTRIBUTE;

  /** Stored attachments the record should still have after the save. */
  kept = signal<Attachment[]>([]);
  /** Files staged in this session, not yet linked to anything. */
  staged = signal<TemporaryUpload[]>([]);
  errors = signal<string[]>([]);
  isUploading = signal(false);
  isDisabled = signal(false);
  /** Set once the staged files belong to a saved record and must not be released. */
  private isConsumed = false;
  /** The control this is bound to, if any — see {@link ngOnInit}. */
  private ngControl: NgControl | null = null;

  private onChange: (value: AttachmentSelection) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  /**
   * Resolved here rather than injected: this component provides its own NG_VALUE_ACCESSOR,
   * so asking for NgControl at construction time is a circular dependency.
   */
  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { optional: true });
  }

  /** Stored + staged. Every limit applies to the record, not to one upload call. */
  get totalCount(): number {
    return this.kept().length + this.staged().length;
  }

  /**
   * Read off the bound control rather than a separate input, so the asterisk can never
   * disagree with the validator that actually blocks the save. The rule spans kept + staged,
   * so it cannot be Angular's `Validators.required` and is probed rather than looked up by
   * reference.
   */
  get isRequired(): boolean {
    const validator = this.ngControl?.control?.validator;
    if (!validator) return false;
    return (
      validator({ value: EMPTY_ATTACHMENT_SELECTION } as AbstractControl)?.['required'] === true
    );
  }

  get showRequiredError(): boolean {
    const control = this.ngControl?.control;
    return !!control?.touched && control.hasError('required');
  }

  get canAddMore(): boolean {
    return !this.isDisabled() && !this.isUploading() && this.totalCount < this.maxFiles();
  }

  get canRemove(): boolean {
    return !this.isDisabled();
  }

  get hint(): string {
    return this.translateService
      .instant('ATTACHMENTS.UPLOAD_HINT')
      .replace('{max}', `${this.maxFiles()}`)
      .replace('{size}', `${Math.round(this.maxFileSizeBytes() / (1024 * 1024))}`)
      .replace('{types}', this.allowedExtensions().join(', '));
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    // Free the picker straight away so re-picking the same file still fires a change event.
    input.value = '';
    this.onTouched();

    if (!files.length) return;

    const validationErrors = this.attachmentService.validateFiles(files, {
      maxFiles: this.maxFiles(),
      maxFileSizeBytes: this.maxFileSizeBytes(),
      allowedExtensions: this.allowedExtensions(),
      // Counts what the record already has too: on edit, three stored files leave no room.
      alreadyStagedCount: this.totalCount,
    });

    if (validationErrors.length) {
      this.errors.set(
        validationErrors.map((error) => this.formatMessage(error.messageKey, error.params))
      );
      return;
    }

    this.errors.set([]);
    this.setUploading(true);
    this.attachmentService
      .upload(files)
      .pipe(finalize(() => this.setUploading(false)))
      .subscribe({
        next: (staged) => this.setValue(this.kept(), [...this.staged(), ...staged]),
        // The failure has already been reported by the global error interceptor, which
        // maps the server's ATTACHMENT_* messageKey to a translated message.
        error: () => {},
      });
  }

  /**
   * Drops a stored attachment from the keep-list. Deliberately makes no request: the removal
   * travels with the save, so abandoning the dialog or a failed submit costs the user nothing.
   */
  removeExisting(attachment: Attachment): void {
    if (!this.canRemove) return;

    this.setValue(
      this.kept().filter((existing) => existing.id !== attachment.id),
      this.staged()
    );
    this.errors.set([]);
    this.onTouched();
  }

  /** Drops a staged file and releases it server-side — it belongs to no record yet. */
  removeUpload(upload: TemporaryUpload): void {
    if (!this.canRemove) return;

    this.setValue(
      this.kept(),
      this.staged().filter((staged) => staged.id !== upload.id)
    );
    this.errors.set([]);
    this.onTouched();
    this.attachmentService.releaseUploads([upload.id]);
  }

  /**
   * Tells the control its staged files now belong to a saved record, so destroying it must
   * not cancel them. Call this from the host's post-save hook.
   */
  markAsConsumed(): void {
    this.isConsumed = true;
  }

  ngOnDestroy(): void {
    if (this.isConsumed) return;
    // Only staged files: a stored attachment is not this control's to delete.
    this.attachmentService.releaseUploads(this.staged().map((upload) => upload.id));
  }

  // --- ControlValueAccessor ---

  writeValue(value: AttachmentSelection | null): void {
    this.kept.set(value?.kept ?? []);
    this.staged.set(value?.staged ?? []);
  }

  registerOnChange(fn: (value: AttachmentSelection) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // --- Validator ---

  // Never read `control` here: RequiredMarkerDirective probes composed validators by
  // calling them with a bare `{}`, so it is not always a real AbstractControl.
  validate(_control: AbstractControl): ValidationErrors | null {
    return this.isUploading() ? { attachmentsUploading: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private setValue(kept: Attachment[], staged: TemporaryUpload[]): void {
    this.kept.set(kept);
    this.staged.set(staged);
    this.onChange({ kept, staged });
  }

  private setUploading(isUploading: boolean): void {
    this.isUploading.set(isUploading);
    this.onValidatorChange();
  }

  private formatMessage(messageKey: string, params?: Record<string, string | number>): string {
    const message: string = this.translateService.instant(messageKey);
    return Object.entries(params ?? {}).reduce(
      (text, [key, value]) => text.replace(`{${key}}`, `${value}`),
      message
    );
  }
}
