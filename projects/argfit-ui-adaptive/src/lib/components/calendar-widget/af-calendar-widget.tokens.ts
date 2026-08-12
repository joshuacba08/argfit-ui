import type { AfCalendarEvent, AfIconName } from '@argfit-ui/core';

/**
 * Piezas compartidas por los widgets de calendario.
 *
 * Los seis widgets son superficies distintas sobre el mismo modelo; lo único
 * que comparten de verdad es cómo eligen el icono de una ocurrencia. Vive acá
 * para que no se copie seis veces.
 */

const EVENT_ICON: Readonly<Record<string, AfIconName>> = {
  training: 'activity',
  match: 'trophy',
  gym: 'dumbbell',
  video: 'video',
  medical: 'stethoscope',
  neutral: 'calendar',
};

export function afCalendarWidgetIcon(event: AfCalendarEvent): AfIconName {
  return EVENT_ICON[event.colorToken] ?? 'calendar';
}
