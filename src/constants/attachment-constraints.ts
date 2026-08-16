/**
 * Mirrors the backend `AttachmentStorage` configuration. The server re-validates every
 * file (magic bytes, image/PDF decode) regardless of what the browser reports, so these
 * are a fast-fail UX aid only — never the source of truth.
 */
export const ATTACHMENT_CONSTRAINTS = {
  /** Files per upload batch, and per owning record. */
  MAX_FILES: 3,
  /** 5 MiB. */
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  /** 15 MiB — combined size of a single upload batch. */
  MAX_BATCH_SIZE_BYTES: 15 * 1024 * 1024,
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png'] as readonly string[],
  ALLOWED_CONTENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'] as readonly string[],
} as const;

/** Value for an `<input type="file">` `accept` attribute. */
export const ATTACHMENT_ACCEPT_ATTRIBUTE = [
  ...ATTACHMENT_CONSTRAINTS.ALLOWED_EXTENSIONS,
  ...ATTACHMENT_CONSTRAINTS.ALLOWED_CONTENT_TYPES,
].join(',');
