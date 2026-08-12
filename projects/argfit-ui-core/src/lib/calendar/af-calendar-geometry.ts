import type { AfCalendarDensity } from '../types/calendar.types';

import { AF_CALENDAR_SLOT_MINUTES } from './af-calendar-time';

/**
 * Conversión entre minutos y píxeles de la grilla.
 *
 * La altura de slot viene del token de densidad, no de medir el DOM: así el
 * layout es determinista, no necesita `ResizeObserver` y no salta al hidratar.
 */

/** Altura de slot por densidad, en píxeles. Espeja los tokens `--af-calendar-slot-height-*`. */
export const AF_CALENDAR_SLOT_HEIGHT_PX: Readonly<Record<AfCalendarDensity, number>> = {
  compact: 24,
  comfortable: 32,
  touch: 44,
};

export function afCalendarMinutesToPixels(
  minutes: number,
  slotHeightPx: number,
  slotMinutes: number = AF_CALENDAR_SLOT_MINUTES,
): number {
  return (minutes / slotMinutes) * slotHeightPx;
}

export function afCalendarPixelsToMinutes(
  pixels: number,
  slotHeightPx: number,
  slotMinutes: number = AF_CALENDAR_SLOT_MINUTES,
): number {
  if (slotHeightPx <= 0) return 0;
  return (pixels / slotHeightPx) * slotMinutes;
}

export function afCalendarSlotHeight(density: AfCalendarDensity): number {
  return AF_CALENDAR_SLOT_HEIGHT_PX[density];
}
