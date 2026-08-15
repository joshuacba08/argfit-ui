import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfChartComponent } from './af-chart.component';
import {
  AF_CHART_ATTENDANCE_PLANNED,
  AF_CHART_ATTENDANCE_PLAYERS,
  AF_CHART_ATTENDANCE_SERIES,
  AF_CHART_CONTENT_TREE,
  AF_CHART_DISTANCE_SERIES,
  AF_CHART_FIELD_SECTORS,
  AF_CHART_FIELD_SERIES,
  AF_CHART_FUNNEL_SERIES,
  AF_CHART_FUNNEL_STAGES,
  AF_CHART_LINES_GRAPH,
  AF_CHART_RESPONSE_SURFACE,
  AF_CHART_RIVER_SERIES,
  AF_CHART_RIVER_WEEKS,
  AF_CHART_SPEED_DENSITY,
  AF_CHART_SPRINT_PATH,
  AF_CHART_TRIAD_SERIES,
  AF_CHART_VOLUME_DAYS,
  AF_CHART_VOLUME_SERIES,
} from './af-chart-volume.fixtures';
import {
  AF_CHART_BATTERY_SERIES,
  AF_CHART_BATTERY_TESTS,
  AF_CHART_CMJ_MEAN,
  AF_CHART_CMJ_P10,
  AF_CHART_CMJ_P90,
  AF_CHART_CMJ_RANGE,
  AF_CHART_CMJ_SERIES,
  AF_CHART_CURRENT_WEEK,
  AF_CHART_DEVIATION_PLAYERS,
  AF_CHART_DEVIATION_SERIES,
  AF_CHART_FORECAST_BANDS,
  AF_CHART_FORECAST_LAST_VALUE,
  AF_CHART_FORECAST_LAST_WEEK,
  AF_CHART_FORECAST_SERIES,
  AF_CHART_FORECAST_START_WEEK,
  AF_CHART_FORECAST_WEEKS,
  AF_CHART_MARGINAL_SERIES,
  AF_CHART_MULTIPLES_DAYS,
  AF_CHART_MULTIPLES_SERIES,
  AF_CHART_PARETO_CAUSES,
  AF_CHART_PARETO_SERIES,
  AF_CHART_SEASON_LANES,
  AF_CHART_SEASON_SPANS,
  AF_CHART_SESSION_THRESHOLD,
  AF_CHART_SHARE_POSITIONS,
  AF_CHART_SHARE_SERIES,
  AF_CHART_TARGET_INDICATORS,
  AF_CHART_TARGET_SERIES,
  AF_CHART_WATERFALL_SERIES,
  AF_CHART_WATERFALL_STEPS,
} from './af-chart-panel.fixtures';
import {
  AF_CHART_BLAND_BIAS,
  AF_CHART_BLAND_LOWER,
  AF_CHART_BLAND_SERIES,
  AF_CHART_BLAND_UPPER,
  AF_CHART_BODY_WEIGHT_NEWTONS,
  AF_CHART_FORCE_TIME_SERIES,
  AF_CHART_LACTATE_SERIES,
  AF_CHART_MUSCLE_TREE,
  AF_CHART_PASSING_NETWORK,
  AF_CHART_RAMP_SERIES,
  AF_CHART_RAMP_TIMES,
  AF_CHART_ROC_SERIES,
  AF_CHART_RSA_BEST,
  AF_CHART_RSA_SERIES,
  AF_CHART_RSA_SPRINTS,
  AF_CHART_SEASON_RANGE,
  AF_CHART_SEASON_SERIES,
  AF_CHART_SQUAD_FLOW,
  AF_CHART_WEIGHT_SERIES,
  AF_CHART_WEIGHT_WEEKS,
  AF_CHART_WORKLOAD_SERIES,
} from './af-chart-lab.fixtures';
import {
  AF_CHART_ASYMMETRY_SERIES,
  AF_CHART_ASYMMETRY_TESTS,
  AF_CHART_AVAILABILITY_SERIES,
  AF_CHART_BOXPLOT_SERIES,
  AF_CHART_COMPOSITION_SERIES,
  AF_CHART_COMPOSITION_WEEKS,
  AF_CHART_CORRELATION_SERIES,
  AF_CHART_CORRELATION_VARIABLES,
  AF_CHART_CRITICAL_POWER_SERIES,
  AF_CHART_DAYS,
  AF_CHART_FV_SERIES,
  AF_CHART_HEATMAP_SERIES,
  AF_CHART_HRV_BANDS,
  AF_CHART_HRV_DAYS,
  AF_CHART_HRV_SERIES,
  AF_CHART_LOAD_SERIES,
  AF_CHART_LOAD_WEEKS,
  AF_CHART_PARALLEL_INDICATORS,
  AF_CHART_PARALLEL_SERIES,
  AF_CHART_RADAR_INDICATORS,
  AF_CHART_RADAR_SERIES,
  AF_CHART_SPRINT_DISTANCES,
  AF_CHART_SPRINT_SERIES,
  AF_CHART_ZONE_SERIES,
} from './af-chart.fixtures';

const meta: Meta<AfChartComponent> = {
  title: 'Data/Chart',
  component: AfChartComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfChart',
      useWhen: [
        'Para comparar tendencias o distribuciones de datos cuantitativos.',
        'Para relacionar magnitudes con unidades distintas en un mismo eje temporal.',
      ],
      avoidWhen: [
        'Para un único valor destacado; usa AfMetricCard.',
        'Para el encabezado, el menú y la exportación de un gráfico; usa AfChartCard.',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: [
        '--af-chart-primary',
        '--af-chart-accent',
        '--af-chart-scale-3',
        '--af-chart-tooltip-text',
        '--af-bg-surface',
      ],
      related: ['AfChartCard', 'AfAnalyticsCard', 'AfMetricCard'],
    },
    docs: {
      description: {
        component:
          'Visualización adaptativa con series vendor-neutral, leyenda y tabla accesible. Cubre series cartesianas, distribuciones, matrices y perfiles multivariable con los tokens `--af-chart-*`.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'line',
        'area',
        'bar',
        'stacked-bar',
        'stacked-area',
        'horizontal-bar',
        'combo',
        'sparkline',
        'donut',
        'gauge',
        'radar',
        'heatmap',
        'correlation',
        'boxplot',
        'parallel',
        'polar-stacked',
        'scatter',
        'bubble',
        'candlestick',
        'calendar',
        'sankey',
        'treemap',
        'network',
        'bullet',
        'waterfall',
        'diverging-bar',
        'dumbbell',
        'small-multiples',
        'scatter-marginal',
        'gantt',
        'stacked-horizontal-bar',
        'histogram',
        'sunburst',
        'themeriver',
        'chord',
        'funnel',
        'ridgeline',
        'beeswarm',
        'pictorial',
        'rose',
        'scatter3d',
        'surface',
        'bar3d',
        'line3d',
      ],
    },
    tone: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    legend: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    dataTable: { control: 'boolean' },
    showPoints: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  // Los booleanos se declaran aquí porque el template los enlaza siempre: un arg sin
  // valor llega como `undefined` y `booleanAttribute` lo convierte en `false`, que
  // apagaría la leyenda y la grilla de toda historia que no los repita.
  args: {
    // Las colecciones se declaran igual que los booleanos: el template las enlaza
    // siempre, y un arg ausente llega como `undefined` en vez de como lista vacía.
    categories: [],
    series: [],
    indicators: [],
    bands: [],
    regions: [],
    thresholds: [],
    toolbox: [],
    annotations: [],
    tree: [],
    spans: [],
    tone: 'default',
    density: 'comfortable',
    legend: true,
    showGrid: true,
    showPoints: false,
    dataTable: false,
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: `<af-chart
      [title]="title"
      [description]="description"
      [type]="type"
      [tone]="tone"
      [density]="density"
      [categories]="categories"
      [series]="series"
      [indicators]="indicators"
      [bands]="bands"
      [regions]="regions"
      [thresholds]="thresholds"
      [xAxis]="xAxis"
      [yAxis]="yAxis"
      [secondaryAxis]="secondaryAxis"
      [toolbox]="toolbox"
      [showPoints]="showPoints"
      [annotations]="annotations"
      [graph]="graph"
      [tree]="tree"
      [dateRange]="dateRange"
      [spans]="spans"
      [webglMessage]="webglMessage"
      [height]="height"
      [legend]="legend"
      [showGrid]="showGrid"
      [dataTable]="dataTable"
      [loading]="loading"
      [ariaLabel]="ariaLabel"
      (pointSelect)="pointSelect($event)"
    />`,
  }),
};

export default meta;
type Story = StoryObj<AfChartComponent>;

export const Default: Story = {
  args: {
    title: 'Carga semanal',
    description: 'Unidades de carga por microciclo.',
    type: 'line',
    categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    series: [{ name: 'Carga', data: [42, 68, 55, 74, 61, 88, 35], tone: 'primary' }],
    legend: true,
    dataTable: true,
    pointSelect: fn(),
  },
};

export const Loading: Story = {
  args: { loading: true },
};

/**
 * Barras y línea sobre el mismo eje temporal, cada una con su escala.
 *
 * Las unidades arbitrarias de carga y un ratio adimensional no comparten dominio: sin
 * el eje secundario, el ratio quedaría aplastado contra el cero.
 */
export const ComboEjesDuales: Story = {
  args: {
    type: 'combo',
    title: 'Carga aguda y ratio A:C',
    categories: AF_CHART_LOAD_WEEKS,
    series: AF_CHART_LOAD_SERIES,
    yAxis: { name: 'UA' },
    secondaryAxis: { name: 'ACWR', min: 0.4, max: 1.8 },
    regions: [{ from: 0.8, to: 1.3, role: 'secondary', tone: 'success', label: 'zona óptima' }],
    thresholds: [{ value: 1.3, role: 'secondary', tone: 'warning', label: '1.30' }],
    height: 320,
    pointSelect: fn(),
  },
};

/** Serie temporal con la dispersión dibujada como banda alrededor de la media móvil. */
export const BandaDeDispersion: Story = {
  args: {
    type: 'line',
    title: 'Variabilidad de la frecuencia cardíaca',
    categories: AF_CHART_HRV_DAYS,
    series: AF_CHART_HRV_SERIES,
    bands: AF_CHART_HRV_BANDS,
    yAxis: { name: 'ms', min: 40 },
    secondaryAxis: { name: 'lpm', min: 40, max: 65 },
    height: 300,
    pointSelect: fn(),
  },
};

/** Nube de ensayos con la recta que define el perfil fuerza–velocidad. */
export const DispersionConAjuste: Story = {
  args: {
    type: 'scatter',
    title: 'Perfil fuerza–velocidad',
    series: AF_CHART_FV_SERIES,
    xAxis: { name: 'v (m·s⁻¹)', min: 0, max: 2.4 },
    yAxis: { name: 'F (N·kg⁻¹)', min: 0, max: 160 },
    height: 300,
    pointSelect: fn(),
  },
};

/**
 * Escala logarítmica en el eje de tiempo.
 *
 * El esfuerzo va de 1 s a 1800 s: en escala lineal, dos tercios de los puntos se
 * amontonarían en el primer píxel del eje.
 */
export const EscalaLogaritmica: Story = {
  args: {
    type: 'scatter',
    title: 'Curva de potencia crítica',
    series: AF_CHART_CRITICAL_POWER_SERIES,
    // El máximo se fija en el último esfuerzo medido: en escala logarítmica, dejar que
    // el eje redondee a la década siguiente añadiría un quinto de ancho sin datos.
    xAxis: { name: 't (s)', scale: 'log', max: 1800 },
    yAxis: { name: 'W' },
    height: 300,
    pointSelect: fn(),
  },
};

/** Composición de un total a lo largo del tiempo. */
export const AreaApilada: Story = {
  args: {
    type: 'stacked-area',
    title: 'Composición del entrenamiento',
    categories: AF_CHART_COMPOSITION_WEEKS,
    series: AF_CHART_COMPOSITION_SERIES,
    yAxis: { name: 'min' },
    height: 320,
    pointSelect: fn(),
  },
};

/** Distribución cíclica: cada rama es una sesión del microciclo. */
export const PolarApilado: Story = {
  args: {
    type: 'polar-stacked',
    title: 'Zonas de velocidad',
    categories: [...AF_CHART_DAYS],
    series: AF_CHART_ZONE_SERIES,
    height: 320,
    pointSelect: fn(),
  },
};

/** Matriz simétrica con escala divergente y el coeficiente rotulado en cada celda. */
export const MatrizDeCorrelacion: Story = {
  args: {
    type: 'correlation',
    title: 'Correlaciones carga–rendimiento',
    categories: AF_CHART_CORRELATION_VARIABLES,
    series: AF_CHART_CORRELATION_SERIES,
    height: 320,
    pointSelect: fn(),
  },
};

/** Cajas con las observaciones crudas detrás, que revelan la forma real de cada grupo. */
export const BoxplotConPuntos: Story = {
  args: {
    type: 'boxplot',
    title: 'Potencia relativa por posición',
    series: AF_CHART_BOXPLOT_SERIES,
    showPoints: true,
    yAxis: { name: 'W·kg⁻¹' },
    legend: false,
    height: 300,
    pointSelect: fn(),
  },
};

/** Carga individual por día del microciclo. */
export const Heatmap: Story = {
  args: {
    type: 'heatmap',
    title: 'Carga por jugador',
    categories: [...AF_CHART_DAYS],
    series: AF_CHART_HEATMAP_SERIES,
    height: 320,
    pointSelect: fn(),
  },
};

/** Déficit por extremidad, con el umbral clínico marcado. */
export const BarrasHorizontales: Story = {
  args: {
    type: 'horizontal-bar',
    title: 'Asimetría bilateral',
    categories: AF_CHART_ASYMMETRY_TESTS,
    series: AF_CHART_ASYMMETRY_SERIES,
    xAxis: { name: '% déficit', max: 14 },
    thresholds: [{ value: 10, axis: 'x', tone: 'danger', label: 'umbral 10%' }],
    height: 300,
    pointSelect: fn(),
  },
};

/** Parciales y velocidad instantánea de un sprint de 40 m. */
export const SplitsDeSprint: Story = {
  args: {
    type: 'combo',
    title: 'Splits de sprint',
    categories: AF_CHART_SPRINT_DISTANCES,
    series: AF_CHART_SPRINT_SERIES,
    xAxis: { name: 'm' },
    yAxis: { name: 's', max: 1.2 },
    secondaryAxis: { name: 'm·s⁻¹', min: 4, max: 10 },
    height: 300,
    pointSelect: fn(),
  },
};

/** Perfil normalizado del jugador contra la media del plantel. */
export const Radar: Story = {
  args: {
    type: 'radar',
    title: 'Perfil físico comparado',
    indicators: AF_CHART_RADAR_INDICATORS,
    series: AF_CHART_RADAR_SERIES,
    height: 320,
    pointSelect: fn(),
  },
};

/** Cada línea es un jugador-día; sirve para detectar perfiles atípicos. */
export const CoordenadasParalelas: Story = {
  args: {
    type: 'parallel',
    title: 'Estado del jugador',
    indicators: AF_CHART_PARALLEL_INDICATORS,
    series: AF_CHART_PARALLEL_SERIES,
    height: 320,
    pointSelect: fn(),
  },
};

/** Un único indicador acotado, con su valor legible sin recurrir a la leyenda. */
export const Gauge: Story = {
  args: {
    type: 'gauge',
    title: 'Disponibilidad',
    series: AF_CHART_AVAILABILITY_SERIES,
    indicators: [{ name: 'Disponibilidad', min: 0, max: 100 }],
    legend: false,
    height: 280,
    pointSelect: fn(),
  },
};

/**
 * Herramientas de exploración sobre el lienzo.
 *
 * Se activan una a una: un gráfico embebido en una tarjeta de resumen no debería ofrecer
 * controles que compiten con la lectura.
 */
export const ConToolbox: Story = {
  args: {
    type: 'combo',
    title: 'Carga aguda y ratio A:C',
    categories: AF_CHART_LOAD_WEEKS,
    series: AF_CHART_LOAD_SERIES,
    yAxis: { name: 'UA' },
    secondaryAxis: { name: 'ACWR', min: 0.4, max: 1.8 },
    toolbox: ['zoom', 'magic', 'restore', 'data-view', 'save-image'],
    height: 340,
    pointSelect: fn(),
  },
};

/* ── Set II · Fisiología, testing y análisis de juego ──────────────── */

/**
 * Test incremental con dos magnitudes sobre un eje de velocidad continuo.
 *
 * El umbral marca el criterio fijo de 4 mmol·L⁻¹; la anotación, la velocidad observada
 * a la que este atleta lo cruza. Son cosas distintas y por eso se declaran aparte.
 */
export const TestDeLactato: Story = {
  args: {
    type: 'scatter',
    title: 'Test incremental de lactato',
    series: AF_CHART_LACTATE_SERIES,
    xAxis: { name: 'velocidad (km·h⁻¹)', min: 7, max: 21 },
    yAxis: { name: 'mmol·L⁻¹', max: 10 },
    secondaryAxis: { name: 'lpm', min: 110, max: 200 },
    thresholds: [{ value: 4, tone: 'warning', label: 'LT2 (4 mmol)' }],
    annotations: [{ x: 18.4, y: 4, label: '18.4', tone: 'warning' }],
    height: 300,
    pointSelect: fn(),
  },
};

/** Cinética respiratoria con la ventana del segundo umbral ventilatorio sombreada. */
export const TestDeRampa: Story = {
  args: {
    type: 'line',
    title: 'Test de rampa · intercambio gaseoso',
    categories: AF_CHART_RAMP_TIMES,
    series: AF_CHART_RAMP_SERIES,
    xAxis: { name: 'tiempo (s)' },
    yAxis: { name: 'mL·kg⁻¹·min⁻¹' },
    secondaryAxis: { name: 'L·min⁻¹' },
    regions: [{ from: '450', to: '690', axis: 'x', tone: 'warning', label: 'zona VT2' }],
    height: 300,
    pointSelect: fn(),
  },
};

/**
 * Registro de plataforma de fuerza con las fases del gesto anotadas.
 *
 * Las franjas nombran cada tramo y la línea de referencia es el peso corporal: sin ella,
 * no se distingue la descarga excéntrica del vuelo.
 */
export const CurvaFuerzaTiempo: Story = {
  args: {
    type: 'scatter',
    title: 'Curva fuerza–tiempo del CMJ',
    series: AF_CHART_FORCE_TIME_SERIES,
    xAxis: { name: 'tiempo (ms)', min: 0, max: 1200 },
    // Sin máximo explícito: fijarlo en 2600 hace que ECharts rotule el tope además del
    // último paso natural de la escala, y las dos etiquetas se pisan en la esquina.
    yAxis: { name: 'Fuerza vertical (N)', min: 0 },
    regions: [
      { from: 200, to: 480, axis: 'x', tone: 'primary', label: 'Excéntrica' },
      { from: 480, to: 780, axis: 'x', tone: 'success', label: 'Concéntrica' },
      { from: 780, to: 960, axis: 'x', label: 'Vuelo' },
      { from: 960, to: 1200, axis: 'x', tone: 'warning', label: 'Aterrizaje' },
    ],
    thresholds: [{ value: AF_CHART_BODY_WEIGHT_NEWTONS, label: 'peso corporal' }],
    legend: false,
    height: 360,
    pointSelect: fn(),
  },
};

/** Ocho sprints con el decremento respecto al mejor tiempo. */
export const SprintsRepetidos: Story = {
  args: {
    type: 'combo',
    title: 'Sprints repetidos',
    categories: AF_CHART_RSA_SPRINTS,
    series: AF_CHART_RSA_SERIES,
    xAxis: { name: 'n.º de sprint' },
    yAxis: { name: 's', min: 3.9, max: 4.8 },
    // El mínimo se declara: sin él, ECharts elige el origen del eje derecho para cuadrar
    // los pasos con el izquierdo y recorta los primeros sprints, que son justamente los
    // que valen cero por definición.
    secondaryAxis: { name: '%', min: 0, max: 14 },
    thresholds: [
      {
        value: AF_CHART_RSA_BEST,
        tone: 'success',
        label: `mejor ${AF_CHART_RSA_BEST.toFixed(2)} s`,
      },
    ],
    height: 360,
    pointSelect: fn(),
  },
};

/**
 * Concordancia entre dos métodos de medición.
 *
 * Se grafica la diferencia contra la media, no un método contra el otro: una nube sobre
 * la diagonal parece acuerdo aunque haya un sesgo sistemático, que es exactamente lo que
 * este gráfico existe para revelar.
 */
export const BlandAltman: Story = {
  args: {
    type: 'scatter',
    title: 'Concordancia GPS vs LPS',
    series: AF_CHART_BLAND_SERIES,
    xAxis: { name: 'media de ambos métodos (m·s⁻¹)', min: 5.5, max: 11.5 },
    yAxis: { name: 'diferencia (m·s⁻¹)', min: -1, max: 1 },
    thresholds: [
      { value: AF_CHART_BLAND_BIAS, tone: 'success', label: `sesgo ${AF_CHART_BLAND_BIAS}` },
      { value: AF_CHART_BLAND_UPPER, tone: 'danger', label: '+1.96 DE' },
      { value: AF_CHART_BLAND_LOWER, tone: 'danger', label: '−1.96 DE' },
    ],
    legend: false,
    height: 300,
    pointSelect: fn(),
  },
};

/** Capacidad discriminante de un test de campo, con la diagonal del azar como contraste. */
export const CurvaRoc: Story = {
  args: {
    type: 'scatter',
    title: 'Capacidad discriminante del test',
    series: AF_CHART_ROC_SERIES,
    xAxis: { name: '1 − especificidad', min: 0, max: 1 },
    yAxis: { name: 'sensibilidad', min: 0, max: 1 },
    height: 300,
    pointSelect: fn(),
  },
};

/** Tres variables por punto: volumen, intensidad y minutos jugados en el diámetro. */
export const Burbujas: Story = {
  args: {
    type: 'bubble',
    title: 'Volumen frente a intensidad',
    series: AF_CHART_WORKLOAD_SERIES,
    xAxis: { name: 'distancia total (m)', min: 5000, max: 12500 },
    yAxis: { name: 'dist. alta intensidad (m)', min: 200, max: 1400 },
    height: 300,
    pointSelect: fn(),
  },
};

/**
 * Apertura, cierre y extremos de cada semana.
 *
 * Una línea de medias semanales escondería el rango, que aquí es el dato clínico: dos
 * semanas con la misma media pueden tener oscilaciones muy distintas.
 */
export const RangoDePeso: Story = {
  args: {
    type: 'candlestick',
    title: 'Rango de peso corporal',
    categories: AF_CHART_WEIGHT_WEEKS,
    series: AF_CHART_WEIGHT_SERIES,
    yAxis: { name: 'kg' },
    legend: false,
    height: 300,
    pointSelect: fn(),
  },
};

/** Carga diaria sobre la cuadrícula real del calendario, enero a septiembre. */
export const CalendarioDeCarga: Story = {
  args: {
    type: 'calendar',
    title: 'Calendario de carga de la temporada',
    series: AF_CHART_SEASON_SERIES,
    dateRange: AF_CHART_SEASON_RANGE,
    yAxis: { max: 900 },
    height: 320,
    pointSelect: fn(),
  },
};

/** Trayectoria del plantel entre disponibilidad, lesión, readaptación y convocatoria. */
export const FlujoDelPlantel: Story = {
  args: {
    type: 'sankey',
    title: 'Flujo de estado del plantel',
    graph: AF_CHART_SQUAD_FLOW,
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/** Series efectivas acumuladas por grupo muscular en el mesociclo. */
export const CargaPorGrupoMuscular: Story = {
  args: {
    type: 'treemap',
    title: 'Carga por grupo muscular',
    tree: AF_CHART_MUSCLE_TREE,
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/**
 * Red de pases con los nodos en la posición media de cada puesto.
 *
 * Las coordenadas son el dato, no la estética: un layout automático las reordenaría y el
 * grafo dejaría de decir dónde juega cada jugador.
 */
export const RedDePases: Story = {
  args: {
    type: 'network',
    title: 'Red de pases del equipo',
    graph: AF_CHART_PASSING_NETWORK,
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/* ── Set III · Panel analítico del mesociclo ───────────────────────── */

/**
 * Serie observada, tendencia y proyección con su intervalo de confianza.
 *
 * La banda existe sólo sobre el horizonte proyectado: extenderla a lo ya medido
 * sugeriría incertidumbre en datos que se registraron.
 */
export const ProyeccionDeCarga: Story = {
  args: {
    type: 'line',
    title: 'Proyección de carga a 8 semanas',
    categories: AF_CHART_FORECAST_WEEKS,
    series: AF_CHART_FORECAST_SERIES,
    bands: AF_CHART_FORECAST_BANDS,
    yAxis: { name: 'UA', min: 2600 },
    regions: [
      {
        from: AF_CHART_FORECAST_START_WEEK,
        to: AF_CHART_FORECAST_LAST_WEEK,
        axis: 'x',
        label: 'proyección',
      },
    ],
    annotations: [
      {
        x: AF_CHART_FORECAST_LAST_WEEK,
        y: AF_CHART_FORECAST_LAST_VALUE,
        label: String(AF_CHART_FORECAST_LAST_VALUE),
      },
    ],
    height: 360,
    pointSelect: fn(),
  },
};

/** Distribución de frecuencias con su ajuste normal y los percentiles de referencia. */
export const Histograma: Story = {
  args: {
    type: 'histogram',
    title: 'Distribución de altura de CMJ',
    series: AF_CHART_CMJ_SERIES,
    xAxis: { name: 'altura de CMJ (cm)', ...AF_CHART_CMJ_RANGE },
    yAxis: { name: 'n.º de saltos' },
    thresholds: [
      { value: AF_CHART_CMJ_MEAN, axis: 'x', tone: 'primary', label: 'media' },
      { value: AF_CHART_CMJ_P10, axis: 'x', tone: 'warning', label: 'P10' },
      { value: AF_CHART_CMJ_P90, axis: 'x', tone: 'success', label: 'P90' },
    ],
    height: 360,
    pointSelect: fn(),
  },
};

/**
 * Valor observado contra objetivo, una fila por indicador.
 *
 * El objetivo es una marca de referencia, no una segunda barra: dos barras invitan a
 * comparar su diferencia en vez de leer el cumplimiento.
 */
export const CumplimientoDeObjetivos: Story = {
  args: {
    type: 'bullet',
    title: 'Cumplimiento de objetivos',
    categories: AF_CHART_TARGET_INDICATORS,
    series: AF_CHART_TARGET_SERIES,
    xAxis: { name: '% del objetivo', max: 130 },
    height: 300,
    pointSelect: fn(),
  },
};

/** Contribución de cada contenido al cambio de carga entre semanas. */
export const Cascada: Story = {
  args: {
    type: 'waterfall',
    title: 'Descomposición del cambio de carga',
    categories: AF_CHART_WATERFALL_STEPS,
    series: AF_CHART_WATERFALL_SERIES,
    yAxis: { name: 'UA', min: 3000 },
    height: 320,
    pointSelect: fn(),
  },
};

/** Distancia de cada jugador respecto a la media del plantel. */
export const DesvioIndividual: Story = {
  args: {
    type: 'diverging-bar',
    title: 'Desvío individual',
    categories: AF_CHART_DEVIATION_PLAYERS,
    series: AF_CHART_DEVIATION_SERIES,
    xAxis: { name: 'desvío estándar respecto a la media', min: -2.2, max: 2.2 },
    legend: false,
    height: 360,
    pointSelect: fn(),
  },
};

/**
 * Dos momentos por prueba unidos por un segmento.
 *
 * El segmento convierte el cambio en una longitud legible; dos barras agrupadas
 * obligarían a restar alturas.
 */
export const Dumbbell: Story = {
  args: {
    type: 'dumbbell',
    title: 'Pretemporada frente al cierre de ciclo',
    categories: AF_CHART_BATTERY_TESTS,
    series: AF_CHART_BATTERY_SERIES,
    xAxis: { name: '% del mejor registro', min: 70, max: 112 },
    height: 360,
    pointSelect: fn(),
  },
};

/** Un panel por jugador, todos con la misma escala y el mismo umbral. */
export const PequenosMultiplos: Story = {
  args: {
    type: 'small-multiples',
    title: 'Carga individual por jugador',
    categories: AF_CHART_MULTIPLES_DAYS,
    series: AF_CHART_MULTIPLES_SERIES,
    yAxis: { max: 1000 },
    thresholds: [{ value: AF_CHART_SESSION_THRESHOLD, tone: 'warning' }],
    legend: false,
    height: 420,
    pointSelect: fn(),
  },
};

/** Dispersión con la distribución de cada variable en su propio margen. */
export const DispersionConMarginales: Story = {
  args: {
    type: 'scatter-marginal',
    title: 'Velocidad frente a capacidad aeróbica',
    series: AF_CHART_MARGINAL_SERIES,
    xAxis: { name: 'sprint 30 m (s)', min: 3.9, max: 5 },
    yAxis: { name: 'Yo-Yo IR1 (nivel)', min: 40, max: 80 },
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/** Bloques de contenido a lo largo de la temporada, con la semana en curso marcada. */
export const Periodizacion: Story = {
  args: {
    type: 'gantt',
    title: 'Periodización de la temporada',
    categories: AF_CHART_SEASON_LANES,
    spans: AF_CHART_SEASON_SPANS,
    xAxis: { name: 'semana de temporada', min: 0, max: 100 },
    thresholds: [{ value: AF_CHART_CURRENT_WEEK, tone: 'danger', label: 'hoy' }],
    legend: false,
    height: 360,
    pointSelect: fn(),
  },
};

/** Episodios por causa con el porcentaje acumulado sobre el eje derecho. */
export const Pareto: Story = {
  args: {
    type: 'combo',
    title: 'Causas de baja',
    categories: AF_CHART_PARETO_CAUSES,
    series: AF_CHART_PARETO_SERIES,
    yAxis: { name: 'episodios' },
    secondaryAxis: { name: '%', min: 0, max: 100 },
    thresholds: [{ value: 80, role: 'secondary', tone: 'warning', label: '80%' }],
    height: 320,
    pointSelect: fn(),
  },
};

/** Composición porcentual del tiempo de juego por posición. */
export const BarrasCienPorCiento: Story = {
  args: {
    type: 'stacked-horizontal-bar',
    title: 'Reparto del tiempo por zona de intensidad',
    categories: AF_CHART_SHARE_POSITIONS,
    series: AF_CHART_SHARE_SERIES,
    xAxis: { name: '% del tiempo de juego', max: 100 },
    height: 300,
    pointSelect: fn(),
  },
};

/* ── Set IV · Volumétricos y tipos poco convencionales ─────────────── */

/**
 * Nube en volumen: carga, recuperación autonómica y rendimiento.
 *
 * Necesita el paquete opcional `echarts-gl`; sin él, el gráfico lo explica en vez de
 * quedarse en blanco.
 */
export const NubeVolumetrica: Story = {
  args: {
    type: 'scatter3d',
    title: 'Carga · HRV · rendimiento',
    series: AF_CHART_TRIAD_SERIES,
    xAxis: { name: 'carga (UA)' },
    yAxis: { name: 'rMSSD (ms)', min: 40, max: 100 },
    secondaryAxis: { name: 'índice rend.' },
    height: 400,
    pointSelect: fn(),
  },
};

/** Superficie de respuesta sobre una rejilla ya evaluada por la aplicación. */
export const SuperficieDeRespuesta: Story = {
  args: {
    type: 'surface',
    title: 'Rendimiento según carga y sueño',
    series: AF_CHART_RESPONSE_SURFACE,
    xAxis: { name: 'carga (UA)', min: 2000, max: 6000 },
    yAxis: { name: 'sueño (h)', min: 5, max: 9.5 },
    secondaryAxis: { name: 'rendimiento', min: 20, max: 105 },
    height: 400,
    pointSelect: fn(),
  },
};

/** La matriz del heatmap del primer set, ahora con altura y color. */
export const BarrasVolumetricas: Story = {
  args: {
    type: 'bar3d',
    title: 'Carga por jugador y día',
    categories: AF_CHART_VOLUME_DAYS,
    series: AF_CHART_VOLUME_SERIES,
    yAxis: { name: 'UA' },
    height: 400,
    pointSelect: fn(),
  },
};

/** Recorrido de un sprint con cambio de dirección; la altura es la velocidad. */
export const TrayectoriaVolumetrica: Story = {
  args: {
    type: 'line3d',
    title: 'Trayectoria de un sprint',
    series: AF_CHART_SPRINT_PATH,
    xAxis: { name: 'eje largo (m)' },
    yAxis: { name: 'eje ancho (m)' },
    secondaryAxis: { name: 'velocidad (m·s⁻¹)' },
    height: 400,
    pointSelect: fn(),
  },
};

/** Jerarquía del contenido de entrenamiento, navegable por niveles. */
export const Sunburst: Story = {
  args: {
    type: 'sunburst',
    title: 'Contenido del mesociclo',
    tree: AF_CHART_CONTENT_TREE,
    legend: false,
    height: 400,
    pointSelect: fn(),
  },
};

/**
 * Corrientes apiladas sin línea base fija.
 *
 * Muestra el desplazamiento del énfasis a lo largo del ciclo; para leer el total
 * acumulado, `stacked-area` es más directo.
 */
export const ThemeRiver: Story = {
  args: {
    type: 'themeriver',
    title: 'Evolución del contenido semanal',
    categories: AF_CHART_RIVER_WEEKS,
    series: AF_CHART_RIVER_SERIES,
    height: 380,
    pointSelect: fn(),
  },
};

/** Intercambios entre líneas del equipo dispuestos en círculo. */
export const DiagramaDeCuerdas: Story = {
  args: {
    type: 'chord',
    title: 'Conexiones entre líneas del equipo',
    graph: AF_CHART_LINES_GRAPH,
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/** Conversión desde la posesión hasta el remate a puerta. */
export const Embudo: Story = {
  args: {
    type: 'funnel',
    title: 'Cadena de decisión ofensiva',
    categories: AF_CHART_FUNNEL_STAGES,
    series: AF_CHART_FUNNEL_SERIES,
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/**
 * Densidades apiladas, una por puesto.
 *
 * Conserva la forma completa de cada distribución —la segunda cresta de trote frente a
 * la de carrera— que un boxplot reduciría a cinco números.
 */
export const Ridgeline: Story = {
  args: {
    type: 'ridgeline',
    title: 'Distribución de velocidad por posición',
    series: AF_CHART_SPEED_DENSITY,
    xAxis: { name: 'velocidad instantánea (km·h⁻¹)', min: 0, max: 32 },
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/** Un punto por jugador, separado lateralmente para que ninguno tape a otro. */
export const Beeswarm: Story = {
  args: {
    type: 'beeswarm',
    title: 'Distancia individual por puesto',
    series: AF_CHART_DISTANCE_SERIES,
    yAxis: { name: 'distancia recorrida (km)', min: 2, max: 12 },
    legend: false,
    height: 380,
    pointSelect: fn(),
  },
};

/** Sesiones completadas sobre las planificadas del microciclo. */
export const Pictograma: Story = {
  args: {
    type: 'pictorial',
    title: 'Cumplimiento de sesiones',
    categories: AF_CHART_ATTENDANCE_PLAYERS,
    series: AF_CHART_ATTENDANCE_SERIES,
    xAxis: { name: 'sesiones del microciclo', max: AF_CHART_ATTENDANCE_PLANNED },
    legend: false,
    height: 300,
    pointSelect: fn(),
  },
};

/** Volumen de acciones por zona, con el área del sector proporcional al conteo. */
export const RosaDeNightingale: Story = {
  args: {
    type: 'rose',
    title: 'Acciones por sector del campo',
    categories: AF_CHART_FIELD_SECTORS,
    series: AF_CHART_FIELD_SERIES,
    legend: false,
    height: 340,
    pointSelect: fn(),
  },
};
