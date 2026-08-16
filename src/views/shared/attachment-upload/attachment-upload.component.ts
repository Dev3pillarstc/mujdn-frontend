import { Component, forwardRef, inject, input, OnDestroy, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { TemporaryUpload } from '@/models/shared/attachment/temporary-upload';
import { AttachmentService } from '@/services/shared/attachment.service';
import {
  ATTACHMENT_ACCEPT_ATTRIBUTE,
  ATTACHMENT_CONSTRAINTS,
} from '@/constants/attachment-constraints';

let nextInputId = 0;

/**
 * Reusable file-staging control. Bind it like any other form control — its value is the
 * list of {@link TemporaryUpload}s the user has staged, which the owning model turns into
 * the `temporaryUploadIds` the create endpoint expects:
 *
 *   <app-attachment-upload formControlName="temporaryUploads" />
 *
 * Files upload as soon as they are picked, so invalid ones are rejected before the user
 * fills in the rest of the form. The control reports itself invalid while an upload is in
 * flight, which keeps a submit from racing the staging call.
 *
 * Anything still staged when the control is destroyed is released server-side, unless the
 * host called {@link markAsConsumed} after a save that consumed it.
 */
@Component({
  selector: 'app-attachment-upload',
  imports: [TranslatePipe],
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
export class AttachmentUploadComponent implements ControlValueAccessor, Validator, OnDestroy {
  titleKey = input<string>('ATTACHMENTS.UPLOAD_TITLE');
  maxFiles = input<number>(ATTACHMENT_CONSTRAINTS.MAX_FILES);
  maxFileSizeBytes = input<number>(ATTACHMENT_CONSTRAINTS.MAX_FILE_SIZE_BYTES);
  allowedExtensions = input<readonly string[]>(ATTACHMENT_CONSTRAINTS.ALLOWED_EXTENSIONS);

  private attachmentService = inject(AttachmentService);
  private translateService = inject(TranslateService);

  readonly inputId = `attachment-upload-${nextInputId++}`;
  readonly acceptAttribute = ATTACHMENT_ACCEPT_ATTRIBUTE;

  uploads = signal<TemporaryUpload[]>([]);
  errors = signal<string[]>([]);
  isUploading = signal(false);
  isDisabled = signal(false);
  /** Set once the staged files belong to a saved record and must not be released. */
  private isConsumed = false;

  private onChange: (value: TemporaryUpload[]) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  get canAddMore(): boolean {
    return !this.isDisabled() && !this.isUploading() && this.uploads().length < this.maxFiles();
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
      alreadyStagedCount: this.uploads().length,
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
        next: (staged) => this.setValue([...this.uploads(), ...staged]),
        // The failure has already been reported by the global error interceptor, which
        // maps the server's ATTACHMENT_* messageKey to a translated message.
        error: () => {},
      });
  }

  removeUpload(upload: TemporaryUpload): void {
    if (this.isDisabled()) return;

    this.setValue(this.uploads().filter((staged) => staged.id !== upload.id));
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
    this.attachmentService.releaseUploads(this.uploads().map((upload) => upload.id));
  }

  // --- ControlValueAccessor ---

  writeValue(value: TemporaryUpload[] | null): void {
    this.uploads.set(value ?? []);
  }

  registerOnChange(fn: (value: TemporaryUpload[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // --- Validator ---

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.isUploading() ? { attachmentsUploading: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private setValue(uploads: TemporaryUpload[]): void {
    this.uploads.set(uploads);
    this.onChange(uploads);
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
