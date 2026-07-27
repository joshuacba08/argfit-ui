import type { AfControlSize } from './form-control.types';

export type AfDatePickerSize = AfControlSize;

export type AfDatePickerDensity = 'compact' | 'comfortable';

export type AfDatePickerValue = string;

/**
 * Inclusive period between two civil dates, both `YYYY-MM-DD`.
 *
 * The type and its validator ship ahead of a range-capable control: applications already
 * express periods with two `AfDatePicker` fields, and this gives them one definition of
 * what a valid period is instead of re-checking `from <= to` at every call site.
 *
 * A `selectionMode="range"` on the control itself is not part of this release: only one of
 * the two platform renderers can express a range today, and a control that behaves
 * differently depending on the platform defeats what the adaptive layer is for.
 */
export interface AfDateRange {
  readonly from: string;
  readonly to: string;
}

const AF_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** `true` when the string is a well-formed civil date that actually exists. */
export function isAfDateValue(value: string | null | undefined): value is string {
  if (typeof value !== 'string' || !AF_DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  // Descarta 2026-02-31 y compañía: `Date` los desborda al mes siguiente en silencio.
  return (
    parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day
  );
}

/** `true` when both ends are valid dates and `from` is not after `to`. */
export function isAfDateRange(value: AfDateRange | null | undefined): value is AfDateRange {
  if (!value) {
    return false;
  }
  return isAfDateValue(value.from) && isAfDateValue(value.to) && value.from <= value.to;
}
