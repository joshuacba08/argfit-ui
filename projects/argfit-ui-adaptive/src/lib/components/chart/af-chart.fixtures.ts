import type { AfChartBand, AfChartIndicator, AfChartSeries } from '@argfit-ui/core';

/**
 * Datos de muestra del kit de visualización de ArgFit.
 *
 * Reproducen el catálogo de gráficos científicos del sistema de diseño para que las
 * historias documenten cada tipo con una lectura real —carga, HRV, perfil
 * fuerza-velocidad— en lugar de series abstractas que no enseñan cuándo usar cada uno.
 *
 * Las cifras son sintéticas pero deterministas: las pruebas visuales comparan capturas,
 * y un generador aleatorio distinto en cada ejecución convertiría cada comparación en un
 * falso positivo.
 */

/** Congruencial lineal de parámetros mínimos, sembrado con una constante fija. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

const round = (value: number, decimals = 1): number => Number(value.toFixed(decimals));

export const AF_CHART_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;

// ── 1 · Carga externa y ratio agudo:crónico ──────────────────────────
export const AF_CHART_LOAD_WEEKS = Array.from({ length: 12 }, (_, index) => `S${index + 1}`);

export const AF_CHART_LOAD_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Carga aguda (UA)',
    kind: 'bar',
    tone: 'primary',
    data: [3120, 3480, 2960, 3890, 4120, 3050, 4380, 4610, 3220, 4020, 4460, 4890],
  },
  {
    name: 'ACWR',
    kind: 'line',
    axis: 'secondary',

    data: [0.92, 1.02, 0.86, 1.14, 1.21, 0.88, 1.28, 1.34, 0.95, 1.09, 1.24, 1.42],
  },
];

// ── 2 · Variabilidad de la frecuencia cardíaca ───────────────────────
const hrv = (() => {
  const random = seeded(42);
  const days: string[] = [];
  const mean: number[] = [];
  const lower: number[] = [];
  const upper: number[] = [];
  const restingRate: number[] = [];

  for (let index = 0; index < 28; index += 1) {
    const value = 68 + 8 * Math.sin(index / 4) + (random() - 0.5) * 6;
    days.push(`D${index + 1}`);
    mean.push(round(value));
    lower.push(round(value - 6 - random() * 3));
    upper.push(round(value + 6 + random() * 3));
    restingRate.push(round(52 + 3 * Math.cos(index / 5) + (random() - 0.5) * 2));
  }

  return { days, mean, lower, upper, restingRate };
})();

export const AF_CHART_HRV_DAYS: readonly string[] = hrv.days;

export const AF_CHART_HRV_SERIES: readonly AfChartSeries[] = [
  { name: 'rMSSD (ms)', data: hrv.mean, showSymbol: false },
  {
    name: 'FC reposo (lpm)',
    axis: 'secondary',
    lineStyle: 'dashed',

    data: hrv.restingRate,
    showSymbol: false,
  },
];

export const AF_CHART_HRV_BANDS: readonly AfChartBand[] = [
  { name: '±1 DE', lower: hrv.lower, upper: hrv.upper, tone: 'primary' },
];

// ── 3 · Perfil fuerza–velocidad ──────────────────────────────────────
export const AF_CHART_FV_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Ensayos',

    data: [
      { x: 0.32, y: 142, value: 142 },
      { x: 0.55, y: 131, value: 131 },
      { x: 0.78, y: 118, value: 118 },
      { x: 0.95, y: 110, value: 110 },
      { x: 1.18, y: 97, value: 97 },
      { x: 1.41, y: 86, value: 86 },
      { x: 1.62, y: 74, value: 74 },
      { x: 1.85, y: 63, value: 63 },
      { x: 2.05, y: 52, value: 52 },
    ],
  },
  {
    name: 'Ajuste lineal',
    kind: 'line',
    tone: 'warning',
    data: [
      { x: 0, y: 152, value: 152 },
      { x: 2.35, y: 42, value: 42 },
    ],
  },
];

// ── 4 · Asimetría bilateral ──────────────────────────────────────────
export const AF_CHART_ASYMMETRY_TESTS = [
  'CMJ altura',
  'CMJ impulso',
  'Salto unipodal',
  'Isométrico rodilla',
  'Nórdico',
  'Tobillo plantar',
];

export const AF_CHART_ASYMMETRY_SERIES: readonly AfChartSeries[] = [
  { name: 'Izquierda', tone: 'primary', data: [3.2, 5.8, 9.4, 4.1, 11.2, 2.6] },
  { name: 'Derecha', data: [1.9, 2.4, 3.1, 6.5, 4.8, 3.4] },
];

// ── 5 · Splits de sprint ─────────────────────────────────────────────
export const AF_CHART_SPRINT_DISTANCES = ['5', '10', '15', '20', '25', '30', '35', '40'];

export const AF_CHART_SPRINT_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Tiempo parcial (s)',
    kind: 'bar',

    data: [1.06, 0.72, 0.63, 0.59, 0.57, 0.56, 0.57, 0.58],
  },
  {
    name: 'Velocidad (m·s⁻¹)',
    kind: 'line',
    axis: 'secondary',

    area: true,
    data: [4.72, 6.94, 7.94, 8.47, 8.77, 8.93, 8.77, 8.62],
  },
];

// ── 6 · Carga individual por día ─────────────────────────────────────
export const AF_CHART_HEATMAP_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(97);
  const players = ['Ríos', 'Vargas', 'Ledesma', 'Ibarra', 'Sosa', 'Molina', 'Peralta', 'Cabrera'];
  return players.map((name) => ({
    name,
    data: AF_CHART_DAYS.map(() => Math.round(200 + random() * 760)),
  }));
})();

// ── 7 · Perfil físico comparado ──────────────────────────────────────
export const AF_CHART_RADAR_INDICATORS: readonly AfChartIndicator[] = [
  { name: 'Vel. máx', max: 100 },
  { name: 'Aceleración', max: 100 },
  { name: 'Potencia', max: 100 },
  { name: 'Resistencia', max: 100 },
  { name: 'Agilidad (COD)', max: 100 },
  { name: 'Fuerza', max: 100 },
];

export const AF_CHART_RADAR_SERIES: readonly AfChartSeries[] = [
  { name: 'Jugador #7', data: [92, 86, 79, 68, 88, 72] },
  { name: 'Media del plantel', data: [74, 71, 73, 76, 70, 75] },
];

// ── 8 · Potencia relativa por posición ───────────────────────────────
export const AF_CHART_BOXPLOT_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(2024);
  const positions = ['Arquero', 'Defensor', 'Volante', 'Extremo', 'Delantero'];
  return positions.map((name, index) => ({
    name,
    data: Array.from({ length: 24 }, () => round(38 + index * 2.2 + (random() - 0.5) * 14)),
  }));
})();

// ── 9 · Zonas de velocidad ───────────────────────────────────────────
export const AF_CHART_ZONE_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(311);
  const zones = ['Z1 <12', 'Z2 12–16', 'Z3 16–20', 'Z4 20–24', 'Z5 >24 km/h'];
  return zones.map((name, index) => ({
    name,
    data: AF_CHART_DAYS.map(() => Math.round(120 * (5 - index) * (0.6 + random() * 0.7))),
  }));
})();

// ── 10 · Curva de potencia crítica ───────────────────────────────────
export const AF_CHART_CRITICAL_POWER_SERIES: readonly AfChartSeries[] = (() => {
  const durations = [1, 3, 5, 10, 20, 30, 60, 120, 300, 600, 1200, 1800];
  return [
    {
      name: 'Potencia media máxima',
      kind: 'line',
      lineStyle: 'solid',
      area: true,
      showSymbol: true,
      smooth: true,
      data: durations.map((seconds) => ({
        x: seconds,
        y: Math.round(1180 * Math.pow(seconds, -0.32) + 220),
        value: Math.round(1180 * Math.pow(seconds, -0.32) + 220),
      })),
    },
    {
      name: 'CP asintótica',
      kind: 'line',
      tone: 'warning',
      data: [
        { x: 1, y: 262, value: 262 },
        { x: 1800, y: 262, value: 262 },
      ],
    },
  ];
})();

// ── 11 · Composición del entrenamiento ───────────────────────────────
export const AF_CHART_COMPOSITION_WEEKS = Array.from({ length: 16 }, (_, index) => `S${index + 1}`);

export const AF_CHART_COMPOSITION_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(777);
  const contents = ['Fuerza', 'Aeróbico', 'Técnico-táctico', 'Velocidad', 'Competencia'];
  return contents.map((name, index) => ({
    name,
    data: AF_CHART_COMPOSITION_WEEKS.map((_, week) =>
      Math.round(60 + (5 - index) * 22 + 40 * Math.sin(week / 3 + index) + random() * 30),
    ),
  }));
})();

// ── 12 · Estado multivariable del jugador ────────────────────────────
export const AF_CHART_PARALLEL_INDICATORS: readonly AfChartIndicator[] = [
  { name: 'Carga (UA)', max: 5200 },
  { name: 'Sueño (h)', max: 9 },
  { name: 'rMSSD', max: 100 },
  { name: 'DOMS', max: 5 },
  { name: 'Sprint 20 m', max: 3.3 },
  { name: 'Readiness', max: 100 },
];

export const AF_CHART_PARALLEL_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(1301);
  return [
    {
      name: 'Jugador-día',
      tone: 'primary',
      data: Array.from({ length: 14 }, () => ({
        value: [
          Math.round(2600 + random() * 2400),
          round(5.6 + random() * 2.6),
          Math.round(52 + random() * 44),
          round(1 + random() * 4),
          round(2.85 + random() * 0.35, 2),
          Math.round(52 + random() * 46),
        ],
      })),
    },
  ];
})();

// ── 13 · Matriz de correlación ───────────────────────────────────────
export const AF_CHART_CORRELATION_VARIABLES = ['Carga', 'Sueño', 'rMSSD', 'DOMS', 'Sprint', 'CMJ'];

export const AF_CHART_CORRELATION_SERIES: readonly AfChartSeries[] = [
  { name: 'Carga', data: [1, 0.12, 0.08, 0.62, -0.24, -0.31] },
  { name: 'Sueño', data: [0.12, 1, 0.48, -0.35, 0.18, 0.22] },
  { name: 'rMSSD', data: [0.08, 0.48, 1, -0.42, 0.26, 0.29] },
  { name: 'DOMS', data: [0.62, -0.35, -0.42, 1, -0.38, -0.44] },
  { name: 'Sprint', data: [-0.24, 0.18, 0.26, -0.38, 1, 0.57] },
  { name: 'CMJ', data: [-0.31, 0.22, 0.29, -0.44, 0.57, 1] },
];

// ── 14 · Disponibilidad del plantel ──────────────────────────────────
export const AF_CHART_AVAILABILITY_SERIES: readonly AfChartSeries[] = [
  { name: 'Plantel disponible', tone: 'primary', data: [84] },
];
