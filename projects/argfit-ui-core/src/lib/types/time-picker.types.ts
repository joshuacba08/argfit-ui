import type { AfControlSize } from './form-control.types';

export type AfTimePickerSize = AfControlSize;

export type AfTimePickerDensity = 'compact' | 'comfortable';

/**
 * Civil time as `HH:mm`, 24-hour clock.
 *
 * Deliberately not a timestamp. "La sesión empieza a las 17:30" is a fact about the
 * clock on the wall of the venue; attaching a date and an offset to it would make the
 * value shift when read from another timezone, which is never what a schedule means.
 * Whoever needs an instant combines this with a civil date and the venue's timezone.
 */
export type AfTimePickerValue = string;

/** Minute granularity offered by the picker. */
export type AfTimePickerMinuteStep = 1 | 5 | 10 | 15 | 20 | 30;

const AF_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** `true` when the string is a valid `HH:mm` civil time. */
export function isAfTimeValue(value: string | null | undefined): value is AfTimePickerValue {
  return typeof value === 'string' && AF_TIME_PATTERN.test(value);
}

/** Minutes since midnight, or `null` when the value is not a valid civil time. */
export function afTimeToMinutes(value: string | null | undefined): number | null {
  if (!isAfTimeValue(value)) {
    return null;
  }
  const [hours, minutes] = value.split(':');
  return Number(hours) * 60 + Number(minutes);
}

/** Formats minutes since midnight back to `HH:mm`. Values outside a day return `''`. */
export function afMinutesToTime(minutes: number): AfTimePickerValue {
  if (!Number.isFinite(minutes) || minutes < 0 || minutes > 1439) {
    return '';
  }
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}
