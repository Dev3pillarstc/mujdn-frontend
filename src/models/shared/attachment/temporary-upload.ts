import { formatFileSize } from '@/utils/utils';

/**
 * A file staged in the server's temporary area, waiting to be consumed by the record that
 * is about to be created. Expires on its own after 24h if never consumed or cancelled.
 */
export class TemporaryUpload {
  /** UUID — this is what gets sent as `temporaryUploadIds` on create. */
  declare id: string;
  declare originalFileName: string;
  /** Server-detected, not the browser-declared type. */
  declare contentType: string;
  declare sizeBytes: number;
  declare expiresUtc: string;

  get sizeLabel(): string {
    return formatFileSize(this.sizeBytes);
  }
}

export function toTemporaryUploads(items?: Partial<TemporaryUpload>[] | null): TemporaryUpload[] {
  return (items ?? []).map((item) => Object.assign(new TemporaryUpload(), item));
}
