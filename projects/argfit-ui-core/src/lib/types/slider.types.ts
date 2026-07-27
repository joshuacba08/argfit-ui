import type { AfControlSize } from './form-control.types';

export type AfSliderSize = AfControlSize;

export type AfSliderDensity = 'compact' | 'comfortable';

/**
 * Labelled stop shown under the track.
 *
 * Marks are what turn a bare number into a judgement a user can make: on an RPE scale,
 * "6" means nothing until the ends are labelled "Muy suave" and "Máximo".
 */
export interface AfSliderMark {
  readonly value: number;
  readonly label: string;
}

/**
 * How the current value is presented.
 *
 * `none` is for cases where a neighbouring control already shows the number; the value is
 * still announced to assistive technology through the input itself.
 */
export type AfSliderValueDisplay = 'none' | 'inline' | 'tooltip';

/** Clamps a value to the range and snaps it to the nearest step. */
export function afClampToStep(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  const bounded = Math.min(Math.max(value, min), max);

  if (!Number.isFinite(step) || step <= 0) {
    return bounded;
  }

  const steps = Math.round((bounded - min) / step);
  const snapped = min + steps * step;

  // El redondeo binario deja restos como 6.999999999999999; se corta a la precisión
  // del propio paso para que el valor emitido sea el que el usuario ve.
  const decimals = decimalPlaces(step);
  const rounded = Number(snapped.toFixed(decimals));

  return Math.min(Math.max(rounded, min), max);
}

function decimalPlaces(step: number): number {
  const text = String(step);
  const separatorIndex = text.indexOf('.');
  return separatorIndex === -1 ? 0 : text.length - separatorIndex - 1;
}
