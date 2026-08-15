import type {
  AfChartBand,
  AfChartPoint,
  AfChartSeries,
  AfChartSpan,
} from '@argfit-ui/core';

/**
 * Datos de muestra del panel analítico del mesociclo.
 *
 * Tercer set del kit: indicadores contra objetivo, proyección de carga y
 * desagregaciones por jugador. Deterministas por la misma razón que los anteriores —las
 * pruebas visuales comparan capturas—.
 */

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

const round = (value: number, decimals = 1): number => Number(value.toFixed(decimals));
const xy = (x: number, y: number): AfChartPoint => ({ x, y, value: y });

export const AF_CHART_SQUAD_PLAYERS = [
  'Ríos',
  'Vargas',
  'Ledesma',
  'Ibarra',
  'Sosa',
  'Molina',
  'Peralta',
  'Cabrera',
  'Acosta',
  'Duarte',
  'Ferreyra',
  'Godoy',
] as const;

// ── 27 · Cumplimiento de objetivos ───────────────────────────────────
export const AF_CHART_TARGET_INDICATORS = [
  'Distancia total',
  'Dist. alta intensidad',
  'Sprints (>24 km/h)',
  'Aceleraciones >3 m·s²',
  'Carga percibida (RPE·min)',
];

export const AF_CHART_TARGET_SERIES: readonly AfChartSeries[] = [
  { name: 'Valor observado', data: [9420, 742, 18, 41, 612] },
  { name: 'Objetivo', data: [9000, 850, 22, 38, 640] },
];

// ── 28 · Descomposición del cambio de carga ──────────────────────────
export const AF_CHART_WATERFALL_STEPS = [
  'Semana previa',
  'Fuerza',
  'Aeróbico',
  'Táctico',
  'Velocidad',
  'Partido',
  'Descanso',
  'Semana actual',
];

export const AF_CHART_WATERFALL_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Carga (UA)',
    data: [
      { value: 3980, total: true },
      { value: 420 },
      { value: 260 },
      { value: -180 },
      { value: 140 },
      { value: 520 },
      { value: -310 },
      { value: 4830, total: true },
    ],
  },
];

// ── 29 · Desvío individual ───────────────────────────────────────────
const deviation = (() => {
  const random = seeded(2026);
  // Nombre y puntaje viajan juntos al ordenar: ordenar sólo los valores dejaría cada
  // barra colgando del jugador equivocado.
  const ranked = AF_CHART_SQUAD_PLAYERS.map((player) => ({
    player,
    score: round((random() - 0.5) * 3.4, 2),
  })).sort((a, b) => b.score - a.score);

  return {
    players: ranked.map((entry) => entry.player),
    scores: ranked.map((entry) => entry.score),
  };
})();

export const AF_CHART_DEVIATION_PLAYERS: readonly string[] = deviation.players;

export const AF_CHART_DEVIATION_SERIES: readonly AfChartSeries[] = [
  { name: 'Desvío (z)', data: deviation.scores },
];

// ── 30 · Pretemporada frente al cierre de ciclo ──────────────────────
const BATTERY_TESTS = [
  'Yo-Yo IR1 (m)',
  'CMJ (cm)',
  'Sprint 30 m (s)',
  'Sentadilla 1RM (kg)',
  'Nórdico (N)',
  'Movilidad tobillo (°)',
];
const BATTERY_PRE = [1720, 38.4, 4.31, 142, 318, 34];
const BATTERY_POST = [2040, 41.2, 4.18, 158, 364, 38];

export const AF_CHART_BATTERY_TESTS: readonly string[] = BATTERY_TESTS;

/**
 * Cada prueba se normaliza a su propio mejor registro.
 *
 * Sin normalizar, los 2 040 m del Yo-Yo aplastarían contra el eje los 4.18 s del sprint
 * y las seis pruebas dejarían de ser comparables en una misma fila.
 */
export const AF_CHART_BATTERY_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Pretemporada',
    data: BATTERY_PRE.map((value, index) =>
      round((value / Math.max(BATTERY_PRE[index], BATTERY_POST[index])) * 100),
    ),
  },
  {
    name: 'Cierre de ciclo',
    data: BATTERY_POST.map((value, index) =>
      round((value / Math.max(BATTERY_PRE[index], BATTERY_POST[index])) * 100),
    ),
  },
];

// ── 31 · Pequeños múltiplos de carga individual ──────────────────────
export const AF_CHART_MULTIPLES_DAYS = Array.from({ length: 14 }, (_, index) => `D${index + 1}`);

export const AF_CHART_MULTIPLES_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(4093);
  return AF_CHART_SQUAD_PLAYERS.slice(0, 9).map((name) => ({
    name,
    data: AF_CHART_MULTIPLES_DAYS.map(() => Math.round(280 + random() * 620)),
  }));
})();

/** Umbral por sesión sobre el que se revisa la carga individual. */
export const AF_CHART_SESSION_THRESHOLD = 700;

// ── 32 · Velocidad frente a capacidad aeróbica ───────────────────────
export const AF_CHART_MARGINAL_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(619);
  return [
    {
      name: 'Jugadores',
      data: Array.from({ length: 60 }, () => {
        const sprint = round(3.9 + random() * 1.1, 2);
        return xy(sprint, round(70 - (sprint - 3.9) * 26 + (random() - 0.5) * 10));
      }),
    },
  ];
})();

// ── 33 · Periodización de la temporada ───────────────────────────────
export const AF_CHART_SEASON_LANES = [
  'Pretemporada',
  'Fuerza máxima',
  'Potencia',
  'Resistencia esp.',
  'Competencia',
  'Descarga',
];

export const AF_CHART_SEASON_SPANS: readonly AfChartSpan[] = [
  { lane: 'Pretemporada', from: 0, to: 26 },
  { lane: 'Fuerza máxima', from: 4, to: 40, tone: 'primary' },
  { lane: 'Potencia', from: 28, to: 64 },
  { lane: 'Resistencia esp.', from: 14, to: 52, tone: 'primary' },
  { lane: 'Competencia', from: 30, to: 100, tone: 'primary' },
  { lane: 'Descarga', from: 52, to: 60, tone: 'warning' },
  { lane: 'Descarga', from: 86, to: 92, tone: 'warning' },
];

/** Semana en curso al corte del panel. */
export const AF_CHART_CURRENT_WEEK = 64;

// ── 34 · Causas de baja ──────────────────────────────────────────────
const PARETO_CAUSES: readonly (readonly [string, number])[] = [
  ['Isquiosurales', 14],
  ['Aductores', 9],
  ['Tobillo', 7],
  ['Rodilla', 5],
  ['Sobrecarga', 4],
  ['Enfermedad', 3],
  ['Otros', 2],
];

export const AF_CHART_PARETO_CAUSES = PARETO_CAUSES.map(([name]) => name);

export const AF_CHART_PARETO_SERIES: readonly AfChartSeries[] = (() => {
  const total = PARETO_CAUSES.reduce((sum, [, count]) => sum + count, 0);
  let running = 0;
  const cumulative = PARETO_CAUSES.map(([, count]) => {
    running += count;
    return round((running / total) * 100);
  });
  return [
    { name: 'Episodios', kind: 'bar', tone: 'primary', data: PARETO_CAUSES.map(([, c]) => c) },
    { name: '% acumulado', kind: 'line', axis: 'secondary', tone: 'warning', data: cumulative },
  ];
})();

// ── 35 · Reparto del tiempo por zona de intensidad ───────────────────
export const AF_CHART_SHARE_POSITIONS = ['Defensor', 'Volante', 'Extremo', 'Delantero'];

export const AF_CHART_SHARE_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(881);
  const zones = ['Baja intensidad', 'Media', 'Alta', 'Sprint'];
  const rows = AF_CHART_SHARE_POSITIONS.map(() => {
    const raw = [52 + random() * 10, 26 + random() * 6, 12 + random() * 4, 4 + random() * 3];
    const total = raw.reduce((sum, value) => sum + value, 0);
    return raw.map((value) => round((value / total) * 100));
  });
  return zones.map((name, index) => ({ name, data: rows.map((row) => row[index]) }));
})();

// ── 36 · Distribución de altura de CMJ ───────────────────────────────
const cmj = (() => {
  const random = seeded(1093);
  const observations = Array.from({ length: 180 }, () => {
    // Suma de seis uniformes: se aproxima a una normal sin necesitar Box-Muller y
    // mantiene el generador determinista de un solo canal.
    let total = 0;
    for (let draw = 0; draw < 6; draw += 1) {
      total += random();
    }
    return 38.5 + (total / 6 - 0.5) * 13;
  });
  const low = 28;
  const high = 50;
  const binCount = 22;
  const width = (high - low) / binCount;
  const counts = Array.from({ length: binCount }, () => 0);
  observations.forEach((value) => {
    const index = Math.min(binCount - 1, Math.max(0, Math.floor((value - low) / width)));
    counts[index] += 1;
  });
  const mean = observations.reduce((sum, value) => sum + value, 0) / observations.length;
  const deviationValue = Math.sqrt(
    observations.reduce((sum, value) => sum + (value - mean) ** 2, 0) / observations.length,
  );
  const sorted = [...observations].sort((a, b) => a - b);
  const percentile = (fraction: number): number =>
    sorted[Math.floor(fraction * (observations.length - 1))];

  const bins = counts.map((count, index) => xy(round(low + index * width + width / 2, 2), count));
  const curve = Array.from({ length: binCount * 4 }, (_, step) => {
    const x = low + (step * width) / 4;
    const density =
      observations.length *
      width *
      (1 / (deviationValue * Math.sqrt(2 * Math.PI))) *
      Math.exp(-((x - mean) ** 2) / (2 * deviationValue ** 2));
    return xy(round(x, 2), round(density));
  });

  return { bins, curve, mean, deviation: deviationValue, percentile, low, high };
})();

export const AF_CHART_CMJ_RANGE = { min: cmj.low, max: cmj.high };
export const AF_CHART_CMJ_MEAN = round(cmj.mean);
export const AF_CHART_CMJ_DEVIATION = round(cmj.deviation);
export const AF_CHART_CMJ_P10 = round(cmj.percentile(0.1));
export const AF_CHART_CMJ_P90 = round(cmj.percentile(0.9));

export const AF_CHART_CMJ_SERIES: readonly AfChartSeries[] = [
  { name: 'Frecuencia', kind: 'bar', tone: 'primary', data: cmj.bins },
  { name: 'Ajuste normal', kind: 'line', lineStyle: 'solid', smooth: true, data: cmj.curve },
];

// ── 37 · Proyección de carga a 8 semanas ─────────────────────────────
const forecast = (() => {
  const random = seeded(2026);
  const observed = Array.from({ length: 18 }, (_, index) =>
    Math.round(2980 + index * 86 + (random() - 0.5) * 260),
  );
  const horizon = 8;
  const count = observed.length;
  const meanX = (count - 1) / 2;
  const meanY = observed.reduce((sum, value) => sum + value, 0) / count;
  const slope =
    observed.reduce((sum, value, index) => sum + (index - meanX) * (value - meanY), 0) /
    observed.reduce((sum, _, index) => sum + (index - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  const residual = Math.sqrt(
    observed.reduce((sum, value, index) => sum + (value - (intercept + slope * index)) ** 2, 0) /
      (count - 2),
  );

  const weeks = Array.from({ length: count + horizon }, (_, index) => `S${index + 1}`);
  const trend = weeks.map((_, index) => Math.round(intercept + slope * index));
  // La proyección arranca en el último punto observado para que las dos líneas se toquen:
  // un salto entre ellas se leería como un cambio real de la serie.
  const projection: (number | null)[] = weeks.map((_, index) => {
    if (index < count - 1) {
      return null;
    }
    if (index === count - 1) {
      return observed[count - 1];
    }
    return Math.round(intercept + slope * index);
  });
  const margin = weeks.map((_, index) =>
    index < count - 1
      ? null
      : Math.round(1.96 * residual * Math.sqrt(1 + Math.max(0, index - count + 1) / horizon)),
  );

  return {
    weeks,
    observed,
    trend,
    projection,
    lower: projection.map((value, index) =>
      value === null ? null : value - (margin[index] ?? 0),
    ),
    upper: projection.map((value, index) =>
      value === null ? null : value + (margin[index] ?? 0),
    ),
    slope: Math.round(slope),
    residual: Math.round(residual),
    lastWeek: weeks[weeks.length - 1],
    lastValue: projection[projection.length - 1] ?? 0,
    firstProjectedWeek: weeks[count - 1],
  };
})();

export const AF_CHART_FORECAST_WEEKS: readonly string[] = forecast.weeks;
export const AF_CHART_FORECAST_SLOPE = forecast.slope;
export const AF_CHART_FORECAST_RESIDUAL = forecast.residual;
export const AF_CHART_FORECAST_LAST_WEEK = forecast.lastWeek;
export const AF_CHART_FORECAST_LAST_VALUE = forecast.lastValue;
export const AF_CHART_FORECAST_START_WEEK = forecast.firstProjectedWeek;

export const AF_CHART_FORECAST_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Carga observada',
    tone: 'primary',
    area: true,
    smooth: true,
    // El tramo futuro va como hueco, no como cero: la serie observada termina donde
    // termina la medición.
    data: [
      ...forecast.observed,
      ...Array<number | null>(forecast.weeks.length - forecast.observed.length).fill(null),
    ],
  },
  {
    name: 'Tendencia lineal',
    lineStyle: 'dashed',
    showSymbol: false,
    smooth: false,
    data: forecast.trend,
  },
  {
    name: 'Proyección',
    lineStyle: 'dashed',
    smooth: true,
    data: forecast.projection.map((value) => value as number),
  },
];

export const AF_CHART_FORECAST_BANDS: readonly AfChartBand[] = [
  {
    name: 'IC 95%',
    lower: forecast.lower,
    upper: forecast.upper,
    tone: 'primary',
  },
];

// ── KPIs y tabla de seguimiento del panel ────────────────────────────
export interface AfChartPanelKpi {
  readonly label: string;
  readonly value: string;
  readonly unit: string;
  readonly trend: 'up' | 'down' | 'flat';
  readonly trendLabel: string;
  readonly series: readonly number[];
  readonly tone: 'primary' | 'success' | 'warning' | 'danger';
}

export const AF_CHART_PANEL_KPIS: readonly AfChartPanelKpi[] = [
  {
    label: 'Carga semanal del plantel',
    value: '4 830',
    unit: 'UA',
    trend: 'up',
    trendLabel: '6.4% vs semana previa',
    series: [3980, 4120, 4045, 4310, 4460, 4620, 4830],
    tone: 'primary',
  },
  {
    label: 'ACWR medio',
    value: '1.24',
    unit: 'a:c',
    trend: 'flat',
    trendLabel: 'dentro de zona 0.8–1.3',
    series: [0.95, 1.02, 1.08, 1.11, 1.16, 1.2, 1.24],
    tone: 'warning',
  },
  {
    label: 'Disponibilidad',
    value: '84',
    unit: '%',
    trend: 'down',
    trendLabel: '3 pts · 2 bajas nuevas',
    series: [91, 90, 88, 89, 87, 86, 84],
    tone: 'danger',
  },
  {
    label: 'rMSSD medio',
    value: '71.4',
    unit: 'ms',
    trend: 'up',
    trendLabel: '2.1 ms · recuperación estable',
    series: [66, 68, 67, 69, 70, 70.8, 71.4],
    tone: 'success',
  },
  {
    label: 'Sprints >24 km/h',
    value: '412',
    unit: 'total',
    trend: 'up',
    trendLabel: '11% · mayor exposición',
    series: [310, 325, 344, 352, 378, 394, 412],
    tone: 'primary',
  },
];

export interface AfChartPanelRow {
  readonly id: string;
  readonly player: string;
  /** Carga acumulada como porcentaje del máximo del plantel. */
  readonly load: number;
  readonly acwr: number;
  readonly trend: readonly number[];
  readonly status: 'ok' | 'watch' | 'risk';
}

export const AF_CHART_PANEL_ROWS: readonly AfChartPanelRow[] = [
  { id: 'rios', player: 'Ríos', load: 100, acwr: 1.38, trend: [520, 610, 680, 720, 790, 840, 880], status: 'risk' },
  { id: 'vargas', player: 'Vargas', load: 94, acwr: 1.26, trend: [480, 540, 600, 640, 700, 760, 820], status: 'watch' },
  { id: 'ledesma', player: 'Ledesma', load: 91, acwr: 1.18, trend: [500, 520, 560, 600, 640, 700, 740], status: 'ok' },
  { id: 'ibarra', player: 'Ibarra', load: 88, acwr: 1.09, trend: [460, 500, 540, 560, 600, 640, 680], status: 'ok' },
  { id: 'sosa', player: 'Sosa', load: 86, acwr: 1.31, trend: [420, 480, 540, 620, 660, 700, 760], status: 'watch' },
  { id: 'molina', player: 'Molina', load: 82, acwr: 0.98, trend: [440, 460, 480, 500, 520, 540, 560], status: 'ok' },
  { id: 'peralta', player: 'Peralta', load: 79, acwr: 1.14, trend: [400, 440, 480, 500, 540, 580, 620], status: 'ok' },
  { id: 'cabrera', player: 'Cabrera', load: 74, acwr: 0.88, trend: [380, 400, 420, 400, 440, 460, 480], status: 'ok' },
  { id: 'acosta', player: 'Acosta', load: 70, acwr: 1.42, trend: [300, 360, 420, 500, 560, 620, 700], status: 'risk' },
  { id: 'duarte', player: 'Duarte', load: 66, acwr: 1.02, trend: [320, 340, 360, 380, 400, 420, 440], status: 'ok' },
  { id: 'ferreyra', player: 'Ferreyra', load: 61, acwr: 0.94, trend: [280, 300, 320, 340, 360, 380, 400], status: 'ok' },
  { id: 'godoy', player: 'Godoy', load: 54, acwr: 0.81, trend: [240, 260, 280, 260, 300, 310, 330], status: 'ok' },
];
