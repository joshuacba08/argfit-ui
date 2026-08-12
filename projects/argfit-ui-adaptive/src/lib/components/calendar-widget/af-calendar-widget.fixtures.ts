import type { AfCalendarEvent } from '@argfit-ui/core';

/**
 * Semana de ejemplo compartida por las historias de los widgets.
 *
 * Las fechas son fijas y el instante de referencia también: un fixture anclado
 * a «hoy» haría que la puerta visual comparase una captura distinta cada día.
 */
export const AF_CALENDAR_WIDGET_WEEK = [
  '2026-08-10',
  '2026-08-11',
  '2026-08-12',
  '2026-08-13',
  '2026-08-14',
  '2026-08-15',
  '2026-08-16',
] as const;

/** Miércoles de esa semana, 10:00. */
export const AF_CALENDAR_WIDGET_NOW = '2026-08-12T10:00';

const event = (
  id: string,
  dayIndex: number,
  start: string,
  end: string,
  title: string,
  subtitle: string,
  colorToken: AfCalendarEvent['colorToken'],
  over: Partial<AfCalendarEvent> = {},
): AfCalendarEvent => ({
  id,
  date: AF_CALENDAR_WIDGET_WEEK[dayIndex],
  start,
  end,
  kind: 'timed',
  title,
  subtitle,
  colorToken,
  ...over,
});

export const AF_CALENDAR_WIDGET_EVENTS: readonly AfCalendarEvent[] = [
  event('w1', 2, '08:30', '09:15', 'Test de salto', 'Laboratorio · 12 atletas', 'gym'),
  event('w2', 2, '10:00', '12:00', 'Entrenamiento integrado', 'Cancha 1', 'training'),
  event('w3', 2, '13:00', '14:00', 'Reunión de rendimiento', 'Sala 1', 'video'),
  event('w4', 2, '16:30', '17:30', 'Kinesiología', 'Consultorio · 4 jugadores', 'medical'),
  event('w5', 3, '09:00', '10:30', 'Velocidad y aceleración', 'Pista', 'training'),
  event('w6', 3, '17:00', '18:30', 'Rutina de core', 'Gimnasio · Grupo B', 'gym'),
  event('w7', 4, '10:00', '11:00', 'Fútbol reducido', 'Cancha 2', 'training'),
  event('w8', 4, '11:30', '12:15', 'Charla pre-partido', 'Sala 1 · Plantel', 'video'),
  event('w9', 5, '16:00', '18:00', 'Partido vs. Racing', 'Estadio · Fecha 14', 'match'),
  event('w10', 6, '10:00', '11:00', 'Recuperación post-partido', 'Piscina · Plantel', 'medical'),
  event('w11', 0, '08:00', '09:00', 'Activación + movilidad', 'Gimnasio', 'gym'),
  event('w12', 1, '09:00', '10:30', 'Fuerza máxima', 'Gimnasio · Grupo A', 'gym'),
];
