/**
 * Acciones del menú de opciones de una `AfChartCard`.
 *
 * El conjunto es cerrado a propósito: son operaciones sobre el gráfico que ya está en
 * pantalla. Cualquier acción de producto —compartir, guardar en un informe, abrir la
 * ficha del jugador— pertenece a la aplicación y se compone fuera de la card.
 */
export type AfChartCardAction =
  /**
   * Solicitud de desanclar el gráfico a una ventana o vista propia.
   *
   * La card sólo emite la intención: abrir una ventana, una ruta o un diálogo es
   * navegación, y la navegación es de la aplicación.
   */
  | 'pop-out'
  | 'fullscreen'
  | 'download-image'
  | 'download-csv'
  /** Muestra la tabla accesible con los mismos datos del lienzo. */
  | 'toggle-table'
  /** Deshace zoom y filtros de leyenda y vuelve al encuadre inicial. */
  | 'reset';

/**
 * Evento emitido cuando alguien elige una acción del menú.
 *
 * `handled` indica si la card ya la resolvió por su cuenta. Una acción con
 * `handled: false` —hoy sólo `pop-out`— no tiene efecto salvo que la aplicación
 * la implemente.
 */
export interface AfChartCardActionEvent {
  readonly action: AfChartCardAction;
  readonly handled: boolean;
}

/**
 * Textos visibles del encabezado y del menú de una `AfChartCard`.
 *
 * Se pasan como datos —no como constantes internas— para que la aplicación pueda
 * traducirlos sin bifurcar el componente.
 */
export interface AfChartCardLabels {
  /** Nombre accesible del botón que abre el menú. */
  readonly menu: string;
  /** Encabezado del propio menú, que agrupa las acciones bajo un título. */
  readonly menuHeading: string;
  readonly popOut: string;
  readonly fullscreen: string;
  readonly fullscreenExit: string;
  readonly downloadImage: string;
  readonly downloadCsv: string;
  readonly showTable: string;
  readonly hideTable: string;
  readonly reset: string;
}

export const AF_CHART_CARD_DEFAULT_LABELS: AfChartCardLabels = {
  menu: 'Opciones del gráfico',
  menuHeading: 'Opciones del gráfico',
  popOut: 'Abrir en ventana aparte',
  fullscreen: 'Pantalla completa',
  fullscreenExit: 'Salir de pantalla completa',
  downloadImage: 'Descargar PNG',
  downloadCsv: 'Descargar datos (CSV)',
  showTable: 'Ver tabla de datos',
  hideTable: 'Ocultar tabla de datos',
  reset: 'Restablecer vista',
};

/**
 * Entrada resuelta del menú, tal como la pintan los renderers.
 *
 * La fachada adaptativa la calcula a partir de las acciones habilitadas y las etiquetas
 * vigentes; los renderers no deciden qué se ofrece, sólo cómo se ve.
 */
export interface AfChartCardMenuItem {
  readonly action: AfChartCardAction;
  readonly label: string;
  /** Separador visual antes de esta entrada. */
  readonly startsGroup?: boolean;
}
