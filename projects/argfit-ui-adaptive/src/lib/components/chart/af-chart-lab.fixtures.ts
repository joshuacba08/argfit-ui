import type {
  AfChartGraph,
  AfChartPoint,
  AfChartSeries,
  AfChartTreeNode,
} from '@argfit-ui/core';

/**
 * Datos de muestra del segundo set del kit: fisiología de laboratorio, validación de
 * instrumentos y estructura del juego.
 *
 * Como en el primer set, las cifras son sintéticas pero deterministas: las pruebas
 * visuales comparan capturas y un generador distinto en cada ejecución convertiría cada
 * comparación en un falso positivo.
 */

/** Congruencial lineal con multiplicador y semilla propios del set. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

const round = (value: number, decimals = 2): number => Number(value.toFixed(decimals));

const xy = (x: number, y: number): AfChartPoint => ({ x, y, value: y });

// ── 15 · Test incremental de lactato ─────────────────────────────────
const LACTATE_SPEEDS = [8, 10, 12, 14, 16, 18, 20];
const LACTATE_VALUES = [0.9, 1.1, 1.5, 2.1, 3.4, 5.8, 9.2];
const LACTATE_HEART_RATE = [128, 141, 152, 163, 172, 181, 189];

export const AF_CHART_LACTATE_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Lactato (mmol·L⁻¹)',
    kind: 'line',
    lineStyle: 'solid',
    smooth: true,
    showSymbol: true,
    area: true,
    data: LACTATE_SPEEDS.map((speed, index) => xy(speed, LACTATE_VALUES[index])),
  },
  {
    name: 'FC (lpm)',
    kind: 'line',
    axis: 'secondary',
    lineStyle: 'dashed',
    smooth: true,
    data: LACTATE_SPEEDS.map((speed, index) => xy(speed, LACTATE_HEART_RATE[index])),
  },
];

// ── 16 · Test de rampa · intercambio gaseoso ─────────────────────────
const RAMP_STEPS = Array.from({ length: 24 }, (_, index) => index * 30);

export const AF_CHART_RAMP_TIMES: readonly string[] = RAMP_STEPS.map(String);

export const AF_CHART_RAMP_SERIES: readonly AfChartSeries[] = [
  {
    name: 'V̇O₂',
    area: true,
    showSymbol: false,
    data: RAMP_STEPS.map((_, index) => round(8 + (52 * index) / 23 + Math.sin(index / 2) * 1.4, 1)),
  },
  {
    name: 'V̇CO₂',
    showSymbol: false,
    data: RAMP_STEPS.map((_, index) =>
      round(6 + ((56 * index) / 23) * (index > 14 ? 1.08 : 0.94) + Math.sin(index / 3), 1),
    ),
  },
  {
    name: 'V̇E',
    axis: 'secondary',
    lineStyle: 'dotted',
    showSymbol: false,
    data: RAMP_STEPS.map((_, index) => round(12 + 110 * Math.pow(index / 23, 1.6), 1)),
  },
];

// ── 17 · Curva fuerza–tiempo del CMJ ─────────────────────────────────
/**
 * Registro sintético de un salto con contramovimiento a 100 Hz.
 *
 * El perfil reproduce las cuatro fases reales del gesto —descarga excéntrica, impulso
 * concéntrico, vuelo sin contacto y pico de aterrizaje— porque son justamente los tramos
 * que el gráfico anota.
 */
export const AF_CHART_FORCE_TIME_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Fuerza vertical',
    kind: 'line',
    lineStyle: 'solid',
    smooth: true,
    area: true,
    data: Array.from({ length: 120 }, (_, index) => {
      let factor = 1;
      if (index >= 20 && index < 48) {
        factor = 1 - 0.42 * Math.sin(((index - 20) / 28) * Math.PI);
      } else if (index < 78) {
        factor = index < 48 ? 1 : 1 + 1.35 * Math.sin(((index - 48) / 30) * Math.PI);
      } else if (index < 96) {
        factor = 0.02;
      } else {
        factor = 1 + 2.1 * Math.sin(((index - 96) / 24) * Math.PI);
      }
      return xy(index * 10, Math.round(factor * 760));
    }),
  },
];

/** Peso corporal del atleta: la referencia contra la que se lee toda la curva. */
export const AF_CHART_BODY_WEIGHT_NEWTONS = 760;

// ── 18 · Sprints repetidos ───────────────────────────────────────────
const rsa = (() => {
  const random = seeded(7);
  const times = Array.from({ length: 8 }, (_, index) =>
    round(4.12 + index * 0.062 + (random() - 0.5) * 0.05),
  );
  const best = Math.min(...times);
  return { times, best };
})();

export const AF_CHART_RSA_SPRINTS = Array.from({ length: 8 }, (_, index) => String(index + 1));
export const AF_CHART_RSA_BEST = rsa.best;

export const AF_CHART_RSA_SERIES: readonly AfChartSeries[] = [
  { name: 'Tiempo (s)', kind: 'bar', tone: 'primary', data: rsa.times },
  {
    name: 'Decremento (%)',
    kind: 'line',
    axis: 'secondary',
    tone: 'warning',
    data: rsa.times.map((time) => round(((time - rsa.best) / rsa.best) * 100)),
  },
];

// ── 19 · Concordancia GPS vs LPS (Bland–Altman) ──────────────────────
const bland = (() => {
  const random = seeded(101);
  const points = Array.from({ length: 46 }, () => {
    const mean = 6.2 + random() * 4.6;
    return xy(round(mean), round((random() - 0.48) * 0.62, 3));
  });
  const differences = points.map((point) => Number(point.y));
  const bias = differences.reduce((total, value) => total + value, 0) / differences.length;
  const deviation = Math.sqrt(
    differences.reduce((total, value) => total + (value - bias) ** 2, 0) / differences.length,
  );
  return { points, bias, deviation };
})();

export const AF_CHART_BLAND_SERIES: readonly AfChartSeries[] = [
  { name: 'Sesiones', data: bland.points },
];

/**
 * Sesgo y límites de acuerdo.
 *
 * Los tres se calculan del mismo conjunto que se dibuja: escribirlos a mano dejaría las
 * líneas de referencia describiendo una muestra distinta de la representada.
 */
export const AF_CHART_BLAND_BIAS = round(bland.bias, 3);
export const AF_CHART_BLAND_UPPER = round(bland.bias + 1.96 * bland.deviation, 3);
export const AF_CHART_BLAND_LOWER = round(bland.bias - 1.96 * bland.deviation, 3);

// ── 20 · Curva ROC ───────────────────────────────────────────────────
export const AF_CHART_ROC_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Test YYIR1 (AUC 0.86)',
    kind: 'line',
    lineStyle: 'solid',
    smooth: true,
    showSymbol: true,
    area: true,
    data: [
      [0, 0],
      [0.04, 0.28],
      [0.09, 0.47],
      [0.14, 0.62],
      [0.21, 0.73],
      [0.3, 0.82],
      [0.42, 0.89],
      [0.56, 0.94],
      [0.72, 0.97],
      [0.88, 0.99],
      [1, 1],
    ].map(([x, y]) => xy(x, y)),
  },
  {
    // La diagonal es el clasificador sin información: sin ella, cualquier curva parece
    // buena, porque no hay contra qué compararla.
    name: 'Azar',
    kind: 'line',
    data: [xy(0, 0), xy(1, 1)],
  },
];

// ── 21 · Volumen frente a intensidad ─────────────────────────────────
export const AF_CHART_WORKLOAD_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(509);
  const positions = ['Defensor', 'Volante', 'Extremo', 'Delantero'];
  return positions.map((name) => ({
    name,
    data: Array.from({ length: 5 }, () => {
      const distance = 6200 + random() * 5200;
      return {
        x: Math.round(distance),
        y: Math.round(180 + (distance - 6000) * 0.14 + random() * 380),
        z: Math.round(58 + random() * 38),
        value: Math.round(180 + (distance - 6000) * 0.14 + random() * 380),
      };
    }),
  }));
})();

// ── 22 · Rango de peso corporal ──────────────────────────────────────
export const AF_CHART_WEIGHT_WEEKS = Array.from({ length: 14 }, (_, index) => `S${index + 1}`);

export const AF_CHART_WEIGHT_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(1723);
  let open = 78.4;
  const data = AF_CHART_WEIGHT_WEEKS.map(() => {
    const close = round(open + (random() - 0.5) * 0.9, 1);
    const low = round(Math.min(open, close) - random() * 0.6, 1);
    const high = round(Math.max(open, close) + random() * 0.6, 1);
    const point: AfChartPoint = { value: [open, close, low, high] };
    open = close;
    return point;
  });
  return [{ name: 'Masa corporal (kg)', data }];
})();

// ── 23 · Calendario de carga de la temporada ─────────────────────────
export const AF_CHART_SEASON_RANGE = { from: '2026-01', to: '2026-09' } as const;

export const AF_CHART_SEASON_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(2711);
  const start = Date.parse('2026-01-01T00:00:00Z');
  const data = Array.from({ length: 250 }, (_, index) => {
    const date = new Date(start + index * 86_400_000);
    const weekday = date.getUTCDay();
    // El domingo se registra en cero en lugar de omitirse: la celda vacía dice «sin
    // dato», y aquí el dato es que ese día se descansa.
    const load = weekday === 0 ? 0 : Math.round(180 + random() * 720 * (weekday === 6 ? 1.25 : 1));
    return { x: date.toISOString().slice(0, 10), value: load };
  });
  return [{ name: 'Carga diaria (UA)', data }];
})();

// ── 24 · Flujo de estado del plantel ─────────────────────────────────
export const AF_CHART_SQUAD_FLOW: AfChartGraph = {
  nodes: [
    { id: 'plantel', label: 'Plantel (32)', tone: 'primary' },
    { id: 'disponible', label: 'Disponible', tone: 'success' },
    { id: 'carga-modificada', label: 'Carga modificada', tone: 'warning' },
    { id: 'lesion', label: 'Lesión', tone: 'danger' },
    { id: 'alta', label: 'Alta médica' },
    { id: 'readaptacion', label: 'Readaptación', tone: 'warning' },
    { id: 'titular', label: 'Titular', tone: 'success' },
    { id: 'suplente', label: 'Suplente' },
    { id: 'baja', label: 'Baja', tone: 'danger' },
  ],
  links: [
    { from: 'plantel', to: 'disponible', value: 24 },
    { from: 'plantel', to: 'carga-modificada', value: 5 },
    { from: 'plantel', to: 'lesion', value: 3 },
    { from: 'disponible', to: 'titular', value: 13 },
    { from: 'disponible', to: 'suplente', value: 11 },
    { from: 'carga-modificada', to: 'suplente', value: 3 },
    { from: 'carga-modificada', to: 'readaptacion', value: 2 },
    { from: 'lesion', to: 'alta', value: 2 },
    { from: 'lesion', to: 'baja', value: 1 },
    { from: 'alta', to: 'readaptacion', value: 2 },
    { from: 'readaptacion', to: 'suplente', value: 3 },
    { from: 'readaptacion', to: 'baja', value: 1 },
  ],
};

// ── 25 · Carga por grupo muscular ────────────────────────────────────
export const AF_CHART_MUSCLE_TREE: readonly AfChartTreeNode[] = [
  {
    name: 'Tren inferior',
    children: [
      { name: 'Cuádriceps', value: 820 },
      { name: 'Isquiosurales', value: 640 },
      { name: 'Glúteos', value: 520 },
      { name: 'Tríceps sural', value: 380 },
      { name: 'Aductores', value: 240 },
    ],
  },
  {
    name: 'Core',
    children: [
      { name: 'Antirrotación', value: 280 },
      { name: 'Lumbo-pélvico', value: 220 },
    ],
  },
  {
    name: 'Tren superior',
    children: [
      { name: 'Empuje', value: 190 },
      { name: 'Tracción', value: 230 },
      { name: 'Hombro', value: 140 },
    ],
  },
];

// ── 26 · Red de pases ────────────────────────────────────────────────
/**
 * Posiciones medias en una rejilla de 0 a 100, con el arco propio abajo.
 *
 * Las coordenadas no son estéticas: son el dato. Un layout automático las reordenaría y
 * el grafo dejaría de decir dónde juega cada puesto.
 */
export const AF_CHART_PASSING_NETWORK: AfChartGraph = {
  nodes: [
    { id: 'GK', x: 50, y: 88 },
    { id: 'LB', x: 18, y: 70 },
    { id: 'CB1', x: 38, y: 74 },
    { id: 'CB2', x: 62, y: 74 },
    { id: 'RB', x: 82, y: 70 },
    { id: 'DM', x: 50, y: 58 },
    { id: 'LM', x: 24, y: 44 },
    { id: 'RM', x: 76, y: 44 },
    { id: 'AM', x: 50, y: 36 },
    { id: 'ST1', x: 38, y: 16 },
    { id: 'ST2', x: 62, y: 16 },
  ],
  links: [
    { from: 'GK', to: 'CB1', value: 9 },
    { from: 'GK', to: 'CB2', value: 8 },
    { from: 'CB1', to: 'LB', value: 14 },
    { from: 'CB2', to: 'RB', value: 12 },
    { from: 'CB1', to: 'DM', value: 11 },
    { from: 'CB2', to: 'DM', value: 13 },
    { from: 'LB', to: 'LM', value: 18 },
    { from: 'RB', to: 'RM', value: 16 },
    { from: 'DM', to: 'AM', value: 15 },
    { from: 'LM', to: 'AM', value: 10 },
    { from: 'RM', to: 'AM', value: 12 },
    { from: 'AM', to: 'ST1', value: 13 },
    { from: 'AM', to: 'ST2', value: 11 },
    { from: 'LM', to: 'ST1', value: 7 },
    { from: 'RM', to: 'ST2', value: 8 },
    { from: 'DM', to: 'LM', value: 9 },
    { from: 'DM', to: 'RM', value: 8 },
    { from: 'ST1', to: 'ST2', value: 6 },
  ],
};
