import type { AfCalendarLabels } from '../types/calendar.types';

/**
 * Textos por defecto en español rioplatense.
 *
 * Son el valor inicial del input `labels`: la librería no toma dependencia de
 * i18n y el producto sobrescribe lo que necesite, entero o por campo.
 */
export const AF_CALENDAR_DEFAULT_LABELS: AfCalendarLabels = {
  weekdaysLong: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthsShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  today: 'Hoy',
  previous: 'Anterior',
  next: 'Siguiente',
  allDay: 'Todo el día',
  noEvents: 'Sin actividades',
  moreTemplate: '+{count} más',
  nowIndicator: 'Hora actual',
  moveMode: 'Modo mover activo',
  moveAnnouncement: '{title} movido a {day} {start}',
  loading: 'Cargando actividades',
  offline: 'Sin conexión',
  partial: 'Datos parciales del rango',
  retry: 'Reintentar',
  create: 'Crear',
  viewLabels: {
    day: 'Día',
    'three-day': '3 días',
    week: 'Semana',
    'work-week': 'Semana laboral',
    month: 'Mes',
    agenda: 'Agenda',
    resources: 'Recursos',
  },
  stateLabels: {
    normal: 'Confirmada',
    tentative: 'Tentativa',
    pending: 'Pendiente',
    syncing: 'Sincronizando',
    conflict: 'En conflicto',
    cancelled: 'Cancelada',
    readonly: 'Solo lectura',
    error: 'Con error',
  },
};
