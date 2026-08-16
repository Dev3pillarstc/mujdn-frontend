import { formatFileSize } from '@/utils/utils';

/**
 * A file already stored against a record (leave, visit, ...). The owning feature builds the
 * download URL from its own route plus {@link Attachment.id}.
 */
export class Attachment {
  declare id: number;
  declare originalFileName: string;
  declare contentType: string;
  declare sizeBytes: number;

  get extension(): string {
    const dotIndex = this.originalFileName?.lastIndexOf('.') ?? -1;
    return dotIndex >= 0 ? this.originalFileName.slice(dotIndex).toLowerCase() : '';
  }

  get sizeLabel(): string {
    return formatFileSize(this.sizeBytes);
  }

  isPdf(): boolean {
    return this.contentType === 'application/pdf';
  }

  isImage(): boolean {
    return !!this.contentType?.startsWith('image/');
  }
}

export function toAttachments(items?: Partial<Attachment>[] | null): Attachment[] {
  return (items ?? []).map((item) => Object.assign(new Attachment(), item));
}
