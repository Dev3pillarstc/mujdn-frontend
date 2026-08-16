import { Component, inject, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, Observable } from 'rxjs';
import { Attachment } from '@/models/shared/attachment/attachment';
import { AlertService } from '@/services/shared/alert.service';
import { downloadBlobData } from '@/utils/utils';

/**
 * Read-only list of a record's stored attachments, with a download button per file.
 *
 * The URL of an attachment belongs to the feature that owns it, so the host passes the
 * request in and this component owns everything around it — busy state, empty-blob guard,
 * file naming and failure reporting:
 *
 *   <app-attachment-list [attachments]="model.attachments" [download]="downloadAttachment" />
 *
 *   downloadAttachment = (attachment: Attachment) =>
 *     this.service.downloadAttachment(this.model.id, attachment.id);
 */
@Component({
  selector: 'app-attachment-list',
  imports: [TranslatePipe],
  templateUrl: './attachment-list.component.html',
})
export class AttachmentListComponent {
  attachments = input<Attachment[]>([]);
  download = input.required<(attachment: Attachment) => Observable<Blob>>();
  labelKey = input<string>('ATTACHMENTS.ATTACHMENTS');

  private alertService = inject(AlertService);

  downloadingId = signal<number | undefined>(undefined);

  downloadAttachment(attachment: Attachment): void {
    if (this.downloadingId() !== undefined) return;

    this.downloadingId.set(attachment.id);
    this.download()(attachment)
      .pipe(finalize(() => this.downloadingId.set(undefined)))
      .subscribe({
        next: (blob) => {
          if (!blob || blob.size === 0) {
            this.showDownloadError();
            return;
          }
          downloadBlobData(blob, attachment.originalFileName);
        },
        // A blob request's error body is itself a blob, which the global error interceptor
        // cannot read — hence SKIP_ERROR_ALERT there and a plain message here. A 404 means
        // "not accessible" rather than "missing", and is not worth a retry either way.
        error: () => this.showDownloadError(),
      });
  }

  private showDownloadError(): void {
    this.alertService.showErrorMessage({ messages: ['ATTACHMENTS.DOWNLOAD_FAILED'] });
  }
}
