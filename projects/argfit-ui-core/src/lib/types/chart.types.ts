/**
 * Public chart kinds supported by `<af-chart>`. Internal engines may map each
 * kind to a richer ECharts configuration, but the contract stays vendor-
 * agnostic.
 */
export type AfChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'stacked-bar'
  | 'horizontal-bar'
  | 'sparkline'
  | 'donut'
  | 'gauge'
  | 'radar'
  | 'heatmap'
  | 'boxplot'
  | 'parallel'
  /**
   * Series mixtas sobre ejes cartesianos compartidos.
   *
   * Cada serie declara su `kind` (`bar` o `line`) y, opcionalmente, su `axis`. Es el tipo
   * para magnitudes con unidades distintas: carga en unidades arbitrarias contra un ratio
   * adimensional, por ejemplo.
   */
  | 'combo'
  /** Área apilada: composición de un total a lo largo del eje de categorías. */
  | 'stacked-area'
  /** Barras apiladas sobre coordenadas polares; una rama angular por categoría. */
  | 'polar-stacked'
  /**
   * Matriz simétrica de correlaciones.
   *
   * Usa una escala divergente centrada en cero porque el signo importa tanto como la
   * magnitud: una escala secuencial haría indistinguible −0.6 de +0.6.
   */
  | 'correlation'
  /**
   * Rango por periodo: apertura, cierre, mínimo y máximo.
   *
   * Cada punto es una tupla `[apertura, cierre, mínimo, máximo]`. Muestra la
   * variabilidad dentro del periodo, que una línea de medias esconde por completo.
   */
  | 'candlestick'
  /**
   * Heatmap sobre una cuadrícula de calendario real.
   *
   * Conserva la semana y el mes como ejes, así que revela patrones de periodicidad
   * —descansos dominicales, cargas de fin de semana— que una serie temporal continua
   * deja enterrados.
   */
  | 'calendar'
  /** Flujo de cantidades entre estados sucesivos. Requiere `graph`. */
  | 'sankey'
  /** Jerarquía de proporciones anidadas. Requiere `tree`. */
  | 'treemap'
  /** Red de nodos y vínculos con posiciones declaradas. Requiere `graph`. */
  | 'network'
  /**
   * Valor observado contra su objetivo, una fila por indicador.
   *
   * Lee dos series —la medida y el objetivo— y dibuja la marca del objetivo como una
   * referencia, no como una segunda barra: comparar dos barras invita a leer la
   * diferencia entre ellas en vez del cumplimiento, que es la pregunta.
   */
  | 'bullet'
  /**
   * Descomposición de un cambio en sus contribuciones sucesivas.
   *
   * Los puntos marcados con `total` se apoyan en el eje; el resto flota desde donde
   * quedó el anterior.
   */
  | 'waterfall'
  /**
   * Barras a ambos lados de un cero central.
   *
   * El color codifica el signo, no la categoría: la pregunta es quién está por encima y
   * quién por debajo de la referencia.
   */
  | 'diverging-bar'
  /**
   * Dos momentos por categoría unidos por un segmento.
   *
   * Frente a dos barras agrupadas, deja leer el cambio como longitud del segmento en
   * lugar de obligar a restar dos alturas.
   */
  | 'dumbbell'
  /**
   * Una rejilla de paneles pequeños que comparten escala.
   *
   * Cada serie es un panel. La escala común es lo que hace comparable la rejilla; sin
   * ella, nueve paneles autoescalados sugieren que todos se comportan igual.
   */
  | 'small-multiples'
  /**
   * Dispersión con la distribución de cada variable en su margen.
   *
   * Los histogramas marginales los deriva el propio gráfico de los mismos puntos.
   */
  | 'scatter-marginal'
  /** Bloques con inicio y fin sobre carriles temporales. Requiere `spans`. */
  | 'gantt'
  /** Composición porcentual por fila, con las categorías en el eje vertical. */
  | 'stacked-horizontal-bar'
  /**
   * Distribución de frecuencias sobre un eje continuo.
   *
   * Los datos llegan ya agrupados: cada punto es el centro de su intervalo. Elegir el
   * ancho del intervalo es una decisión de análisis, no de presentación, y cambiarlo
   * cambia las conclusiones.
   */
  | 'histogram'
  /** Jerarquía radial navegable por niveles. Requiere `tree`. */
  | 'sunburst'
  /**
   * Corrientes apiladas que muestran cómo se desplaza el énfasis en el tiempo.
   *
   * A diferencia de un área apilada, no tiene línea base fija: sirve para leer el
   * cambio de composición, no el total acumulado.
   */
  | 'themeriver'
  /**
   * Intercambios entre nodos dispuestos en círculo. Requiere `graph`.
   *
   * Frente a `network`, aquí la posición no significa nada —la fija el círculo— y lo
   * que se lee es el volumen de cada vínculo.
   */
  | 'chord'
  /** Conversión a través de etapas sucesivas. */
  | 'funnel'
  /**
   * Densidades apiladas con desplazamiento vertical, una por grupo.
   *
   * Conserva la forma completa de cada distribución —bimodalidad, colas, asimetría—
   * que un boxplot reduce a cinco números.
   */
  | 'ridgeline'
  /**
   * Observaciones individuales por categoría, separadas lateralmente.
   *
   * Muestra cada sujeto en lugar de un resumen; con planteles de decenas de jugadores,
   * la posición de cada uno es la información.
   */
  | 'beeswarm'
  /** Conteo representado con unidades repetidas sobre su total planificado. */
  | 'pictorial'
  /**
   * Sectores de ángulo constante y radio proporcional.
   *
   * El área codifica la magnitud, así que es legible para conteos por sector; para
   * proporciones de un total, `donut` sigue siendo más directo.
   */
  | 'rose'
  /**
   * Nube de puntos en volumen. Requiere `echarts-gl` instalado.
   *
   * Cada punto lleva `x`, `y`, `z` y un `value` que colorea la tercera relación.
   */
  | 'scatter3d'
  /**
   * Superficie de respuesta sobre una rejilla. Requiere `echarts-gl` instalado.
   *
   * Los datos llegan como rejilla de puntos `x`, `y`, `value`: el modelo lo calcula la
   * aplicación, que es quien sabe qué está ajustando.
   */
  | 'surface'
  /** Matriz de categorías en volumen. Requiere `echarts-gl` instalado. */
  | 'bar3d'
  /** Trayectoria en volumen. Requiere `echarts-gl` instalado. */
  | 'line3d'
  /** Relación entre dos variables continuas. Cada punto usa `x` e `y`. */
  | 'scatter'
  /**
   * Dispersión donde el tamaño del punto codifica una tercera variable.
   *
   * Se lee `z` como magnitud; el radio se escala por raíz cuadrada porque el ojo compara
   * áreas, no radios, y escalar linealmente exagera las diferencias.
   */
  | 'bubble';

/**
 * Tipos que se dibujan con WebGL y necesitan `echarts-gl` instalado.
 *
 * Se publica como arreglo en tiempo de ejecución —y no sólo como unión de tipos— para
 * que la aplicación pueda decidir antes de renderizar: comprobar la disponibilidad del
 * paquete o degradar a un equivalente en dos dimensiones.
 */
export const AF_CHART_3D_TYPES = ['scatter3d', 'surface', 'bar3d', 'line3d'] as const;

export type AfChart3dType = (typeof AF_CHART_3D_TYPES)[number];

/**
 * Semantic colour tone for a chart series.
 */
export type AfChartTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

/**
 * Visual density of a chart. `compact` is meant for cards/sparklines,
 * `comfortable` for full panels and dashboards.
 */
export type AfChartDensity = 'compact' | 'comfortable';

/**
 * Stability marker used by demos and future advanced chart presets.
 */
export type AfChartStatus = 'stable' | 'planned' | 'experimental';

export type AfChartValue = number | readonly number[];

/**
 * Rich point shape for charts that need labels, tuple values or metadata.
 */
export interface AfChartPoint {
  readonly x?: string | number;
  readonly y?: string | number;
  readonly z?: string | number;
  readonly value: AfChartValue;
  readonly label?: string;
  readonly meta?: string;
  readonly status?: AfChartStatus;
  /**
   * Marca el punto como saldo acumulado en un gráfico de cascada.
   *
   * Un total se apoya en el eje y muestra el valor alcanzado; el resto de puntos son
   * contribuciones que flotan desde donde quedó el anterior.
   */
  readonly total?: boolean;
}

/**
 * Bloque con inicio y fin sobre un carril, para el tipo `gantt`.
 *
 * `from` y `to` se expresan en la unidad del eje —semana de temporada, día del
 * mesociclo—, no en fechas: la periodización se planifica en unidades relativas al
 * calendario de competición, que cambia cada año.
 */
export interface AfChartSpan {
  /** Carril al que pertenece. Debe coincidir con una de las `categories`. */
  readonly lane: string;
  readonly from: number;
  readonly to: number;
  readonly label?: string;
  readonly tone?: AfChartTone;
  readonly color?: string;
}

/**
 * Radar axis metadata. Kept generic so consumers can describe athlete
 * comparison axes without importing ECharts types.
 */
export interface AfChartIndicator {
  readonly name: string;
  readonly max: number;
  readonly min?: number;
}

/**
 * Eje al que se ancla una serie en un gráfico de ejes duales.
 *
 * `secondary` dibuja la serie contra el eje derecho, que tiene su propia escala.
 */
export type AfChartAxisRole = 'primary' | 'secondary';

/**
 * Trazo de una serie de línea.
 *
 * `dashed` señala referencia o ajuste, no medición; `dotted` queda para la serie
 * auxiliar que acompaña sin ser el objeto del gráfico.
 */
export type AfChartLineStyle = 'solid' | 'dashed' | 'dotted';

/**
 * Escala de un eje de valores.
 *
 * `log` es necesaria cuando el dominio abarca varios órdenes de magnitud —una curva de
 * potencia crítica de 1 s a 1800 s, por ejemplo—: en escala lineal el 95% de los puntos
 * se apelmaza contra el origen.
 */
export type AfChartAxisScale = 'linear' | 'log';

/**
 * Configuración explícita de un eje de valores.
 *
 * Todos los campos son opcionales: sin ellos el gráfico deduce el dominio de los datos.
 */
export interface AfChartAxis {
  /** Unidad o magnitud del eje, p. ej. `UA`, `ms`, `W·kg⁻¹`. */
  readonly name?: string;
  readonly min?: number;
  readonly max?: number;
  readonly scale?: AfChartAxisScale;
  /** Líneas de grilla propias del eje. Útil apagarlas en el eje secundario. */
  readonly splitLine?: boolean;
}

/**
 * Banda de dispersión alrededor de una serie: intervalo de confianza, ±1 DE o rango
 * mínimo–máximo.
 *
 * Se declara aparte de las series porque no es una medición independiente sino la
 * incertidumbre de otra; no debe aparecer en la leyenda ni en la tabla de datos como
 * si fuera una serie más.
 */
export interface AfChartBand {
  readonly name: string;
  /**
   * Límites de la banda.
   *
   * `null` deja el tramo sin banda. Es lo que permite que un intervalo de confianza
   * exista sólo sobre el horizonte proyectado: dibujarlo también sobre lo observado
   * sugeriría incertidumbre en datos que ya se midieron.
   */
  readonly lower: readonly (number | null)[];
  readonly upper: readonly (number | null)[];
  readonly tone?: AfChartTone;
  readonly color?: string;
  /** Eje contra el que se dibuja la banda. Por defecto, el primario. */
  readonly axis?: AfChartAxisRole;
}

/**
 * Franja de referencia sombreada sobre el área de trazado, p. ej. la zona óptima de un
 * ratio agudo:crónico.
 */
export interface AfChartRegion {
  /**
   * Extremos del rango.
   *
   * Sobre un eje de categorías se indica la categoría misma —`'450'`—, no su posición:
   * un número se interpretaría como índice y la franja saltaría a otro tramo en cuanto
   * cambie la cantidad de categorías.
   */
  readonly from: number | string;
  readonly to: number | string;
  /** Eje sobre el que se mide el rango. Por defecto `y`. */
  readonly axis?: 'x' | 'y';
  /**
   * Eje de valores al que pertenece el rango en un gráfico de ejes duales.
   *
   * Sin esto, una franja expresada en las unidades del eje derecho —un ratio entre 0.8
   * y 1.3— se dibujaría contra la escala del izquierdo, donde cae fuera de vista.
   */
  readonly role?: AfChartAxisRole;
  readonly label?: string;
  readonly tone?: AfChartTone;
  readonly color?: string;
}

/**
 * Línea de umbral: un valor de corte clínico o de decisión sobre uno de los ejes.
 */
export interface AfChartThreshold {
  readonly value: number;
  /** Eje sobre el que se ancla el umbral. Por defecto `y`. */
  readonly axis?: 'x' | 'y';
  /** Eje de valores al que pertenece el umbral en un gráfico de ejes duales. */
  readonly role?: AfChartAxisRole;
  readonly label?: string;
  readonly tone?: AfChartTone;
  readonly color?: string;
}

/**
 * Anotación puntual sobre una coordenada concreta del gráfico.
 *
 * Marca el hallazgo —el umbral estimado, el récord, el punto de ruptura— que el lector
 * debería llevarse aunque no interrogue el gráfico. Es distinto de un umbral: un umbral
 * es un criterio fijo; una anotación señala un valor observado.
 */
export interface AfChartAnnotation {
  readonly x: number | string;
  readonly y: number;
  readonly label?: string;
  readonly tone?: AfChartTone;
  readonly color?: string;
}

/**
 * Rango de fechas de un gráfico de calendario, en formato `YYYY-MM` o `YYYY-MM-DD`.
 *
 * Se declara aparte de los datos porque la cuadrícula debe existir aunque falten días:
 * deducir el rango de las observaciones borraría precisamente los huecos —descansos,
 * bajas— que el gráfico existe para mostrar.
 */
export interface AfChartDateRange {
  readonly from: string;
  readonly to: string;
}

/**
 * Nodo de un grafo: un estado en un diagrama de flujo o un puesto en una red de pases.
 */
export interface AfChartNode {
  /** Identificador usado por los vínculos. También es la etiqueta si no hay `label`. */
  readonly id: string;
  readonly label?: string;
  /** Tamaño del símbolo en una red. El sankey deduce el suyo de los vínculos. */
  readonly value?: number;
  /**
   * Posición en una rejilla de 0 a 100, sólo para `network`.
   *
   * Una red con posiciones declaradas dice algo que un layout automático no puede: en
   * una red de pases, el lugar del nodo *es* la posición media del jugador en el campo.
   */
  readonly x?: number;
  readonly y?: number;
  readonly tone?: AfChartTone;
  readonly color?: string;
}

/** Vínculo dirigido entre dos nodos, con su magnitud. */
export interface AfChartLink {
  readonly from: string;
  readonly to: string;
  readonly value: number;
}

/** Grafo completo consumido por `sankey` y `network`. */
export interface AfChartGraph {
  readonly nodes: readonly AfChartNode[];
  readonly links: readonly AfChartLink[];
}

/**
 * Nodo de una jerarquía de proporciones para `treemap`.
 *
 * Las hojas llevan `value`; las ramas lo agregan de sus hijos.
 */
export interface AfChartTreeNode {
  readonly name: string;
  readonly value?: number;
  readonly children?: readonly AfChartTreeNode[];
  readonly tone?: AfChartTone;
  readonly color?: string;
}

/**
 * Herramientas interactivas disponibles sobre el lienzo.
 *
 * Son controles de exploración del gráfico, no acciones de producto: no descargan
 * informes ni navegan.
 */
export type AfChartToolboxFeature =
  /** Selección de un área para ampliar, con vuelta atrás. */
  | 'zoom'
  /** Alterna entre línea, barra y apilado sobre los mismos datos. */
  | 'magic'
  | 'restore'
  /** Tabla editable nativa de ECharts con los datos de la serie. */
  | 'data-view'
  | 'save-image';

/**
 * A single data series of an `AfChart`.
 */
export interface AfChartSeries {
  readonly name: string;
  /**
   * Observaciones de la serie.
   *
   * `null` es un hueco —no se midió— y se dibuja como interrupción del trazo. No es
   * intercambiable con cero: en una serie de carga, cero afirma que no se entrenó.
   */
  readonly data: readonly (number | null | AfChartPoint)[];
  readonly tone?: AfChartTone;
  readonly color?: string;
  readonly kind?: AfChartType;
  readonly status?: AfChartStatus;
  /** Eje de valores contra el que se dibuja. Sólo lo lee el tipo `combo`. */
  readonly axis?: AfChartAxisRole;
  /** Trazo de la línea. `dashed` marca una serie de referencia o un ajuste. */
  readonly lineStyle?: AfChartLineStyle;
  /** Rellena el área bajo la línea. */
  readonly area?: boolean;
  /** Suaviza la línea. Por defecto sigue el criterio del tipo de gráfico. */
  readonly smooth?: boolean;
  /** Oculta los símbolos de punto y deja sólo el trazo. */
  readonly showSymbol?: boolean;
}

/**
 * Payload emitted when the consumer selects a point/bar/segment on a chart.
 */
export interface AfChartPointEvent {
  readonly seriesName: string;
  readonly dataIndex: number;
  readonly value: AfChartValue;
  readonly category?: string;
  readonly point?: AfChartPoint;
}
