import type { AfControlSize } from './form-control.types';

export type AfFileUploadSize = AfControlSize;

export type AfFileUploadDensity = 'compact' | 'comfortable';

/**
 * Why a file was refused.
 *
 * Rejections are reported as data rather than swallowed: a file that silently fails to
 * attach is indistinguishable from one that worked, and the user only finds out later.
 */
export type AfFileRejectionReason = 'type' | 'size' | 'count';

export interface AfFileRejection {
  readonly file: File;
  readonly reason: AfFileRejectionReason;
  /** Human-readable explanation, already localized by the component. */
  readonly message: string;
}

/** Emitted whenever the accepted selection changes. */
export interface AfFileUploadChange {
  readonly files: readonly File[];
  readonly rejected: readonly AfFileRejection[];
}

/**
 * Progress of an upload the host application is performing.
 *
 * The component does not upload anything — transport, retries and authentication belong
 * to the application. It only renders the state the application reports, so the same
 * control works with presigned URLs, a proxy or a queued background job.
 */
export interface AfFileUploadProgress {
  readonly fileName: string;
  /** 0–100. `undefined` renders an indeterminate state. */
  readonly percent?: number;
  readonly status: 'pending' | 'uploading' | 'done' | 'error';
  readonly message?: string;
}

/** Formats a byte count for display. Used for size limits and per-file captions. */
export function afFormatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '—';
  }

  const units = ['B', 'kB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const rounded = value >= 10 || unitIndex === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

/**
 * `true` when the file matches an `accept` list.
 *
 * Accepts the same syntax as the native attribute —extensions, exact MIME types and
 * wildcards like `image/*`— so a consumer can reuse what it already passes to `<input>`.
 * An empty list accepts everything.
 */
export function afMatchesAccept(file: File, accept: string | undefined): boolean {
  const patterns = (accept ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (patterns.length === 0) {
    return true;
  }

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) {
      return fileName.endsWith(pattern);
    }
    if (pattern.endsWith('/*')) {
      return fileType.startsWith(pattern.slice(0, -1));
    }
    return fileType === pattern;
  });
}
