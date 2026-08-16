import type { AfChartGraph, AfChartPoint, AfChartSeries, AfChartTreeNode } from '@argfit-ui/core';

/**
 * Datos de muestra del cuarto set: volumétricos y tipos poco convencionales.
 *
 * Deterministas por la misma razón que los tres anteriores: las pruebas visuales
 * comparan capturas y un generador distinto en cada ejecución las invalidaría.
 */

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

const round = (value: number, decimals = 2): number => Number(value.toFixed(decimals));

// ── 38 · Carga · HRV · rendimiento en volumen ────────────────────────
export const AF_CHART_TRIAD_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(915);
  return [
    {
      name: 'Jugador-día',
      data: Array.from({ length: 220 }, (): AfChartPoint => {
        const load = Math.round(2400 + random() * 3400);
        const hrv = round(46 + random() * 54, 1);
        const performance = round(
          52 + (hrv - 46) * 0.42 - Math.max(0, load - 4200) / 90 + (random() - 0.5) * 10,
          1,
        );
        // `value` es la cuarta dimensión: colorea el punto por rendimiento, que es la
        // relación que la nube existe para revelar.
        return { x: load, y: hrv, z: performance, value: performance };
      }),
    },
  ];
})();

// ── 39 · Superficie de respuesta ─────────────────────────────────────
/**
 * Rejilla de rendimiento modelado según carga semanal y horas de sueño.
 *
 * El modelo se evalúa aquí y no en el gráfico: qué se ajusta y con qué supuestos es una
 * decisión del análisis, no de la capa de presentación.
 */
export const AF_CHART_RESPONSE_SURFACE: readonly AfChartSeries[] = (() => {
  const optimum = 4200;
  const points: AfChartPoint[] = [];
  for (let load = 2000; load <= 6000; load += 160) {
    for (let sleep = 5; sleep <= 9.5; sleep += 0.22) {
      const loadTerm = 100 - Math.pow(Math.abs(load - optimum) / 1500, 1.8) * 34;
      const sleepTerm = ((sleep - 5) / 4.5) * 30;
      const performance = Math.max(22, loadTerm * 0.62 + sleepTerm + 6);
      points.push({ x: load, y: round(sleep), z: round(performance, 1), value: round(performance, 1) });
    }
  }
  return [{ name: 'Rendimiento modelado', data: points }];
})();

// ── 40 · Carga por jugador y día en volumen ──────────────────────────
export const AF_CHART_VOLUME_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const AF_CHART_VOLUME_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(2207);
  const players = ['Ríos', 'Vargas', 'Ledesma', 'Ibarra', 'Sosa', 'Molina', 'Peralta', 'Cabrera'];
  return players.map((name) => ({
    name,
    data: AF_CHART_VOLUME_DAYS.map(() => Math.round(160 + random() * 780)),
  }));
})();

// ── 41 · Trayectoria de un sprint ────────────────────────────────────
export const AF_CHART_SPRINT_PATH: readonly AfChartSeries[] = [
  {
    name: 'Trayectoria',
    data: Array.from({ length: 420 }, (_, index): AfChartPoint => {
      const t = index / 420;
      const along = round(-18 + 46 * t);
      const across = round(14 * Math.sin(t * Math.PI * 2.4) * (1 - t * 0.35));
      const speed = round(
        3.2 + 5.6 * Math.sin(Math.min(1, t * 1.35) * Math.PI * 0.9) + Math.sin(t * 22) * 0.18,
      );
      return { x: along, y: across, z: speed, value: speed };
    }),
  },
];

// ── 42 · Contenido del mesociclo ─────────────────────────────────────
export const AF_CHART_CONTENT_TREE: readonly AfChartTreeNode[] = [
  {
    name: 'Físico',
    children: [
      {
        name: 'Fuerza',
        children: [
          { name: 'Máxima', value: 220 },
          { name: 'Potencia', value: 180 },
          { name: 'Excéntrico', value: 120 },
        ],
      },
      {
        name: 'Aeróbico',
        children: [
          { name: 'Extensivo', value: 260 },
          { name: 'Intervalos', value: 190 },
        ],
      },
      {
        name: 'Velocidad',
        children: [
          { name: 'Aceleración', value: 90 },
          { name: 'Máxima', value: 70 },
          { name: 'COD', value: 80 },
        ],
      },
    ],
  },
  {
    name: 'Técnico-táctico',
    children: [
      {
        name: 'Posesión',
        children: [
          { name: 'Rondos', value: 210 },
          { name: 'Juego de posición', value: 240 },
        ],
      },
      {
        name: 'Transiciones',
        children: [
          { name: 'Ofensiva', value: 150 },
          { name: 'Defensiva', value: 130 },
        ],
      },
      { name: 'ABP', value: 190 },
    ],
  },
  {
    name: 'Regeneración',
    children: [
      { name: 'Movilidad', value: 120 },
      { name: 'Compensatorio', value: 95 },
      { name: 'Piscina', value: 70 },
    ],
  },
];

// ── 43 · Evolución del contenido semanal ─────────────────────────────
export const AF_CHART_RIVER_WEEKS = Array.from({ length: 20 }, (_, index) => `S${index + 1}`);

export const AF_CHART_RIVER_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(3301);
  const contents = ['Fuerza', 'Aeróbico', 'Velocidad', 'Táctico', 'Regeneración'];
  return contents.map((name, index) => ({
    name,
    data: AF_CHART_RIVER_WEEKS.map((_, week) => {
      const seasonal = 1 + 0.5 * Math.sin((week / 20) * Math.PI * 2 + index);
      return Math.round((70 + index * 14) * seasonal + random() * 40);
    }),
  }));
})();

// ── 44 · Conexiones entre líneas del equipo ──────────────────────────
export const AF_CHART_LINES_GRAPH: AfChartGraph = {
  nodes: [
    { id: 'Arco' },
    { id: 'Zaga' },
    { id: 'Doble 5' },
    { id: 'Interiores' },
    { id: 'Carrileros' },
    { id: 'Punta' },
  ],
  links: [
    { from: 'Arco', to: 'Zaga', value: 42 },
    { from: 'Zaga', to: 'Doble 5', value: 88 },
    { from: 'Zaga', to: 'Carrileros', value: 64 },
    { from: 'Doble 5', to: 'Interiores', value: 96 },
    { from: 'Doble 5', to: 'Carrileros', value: 58 },
    { from: 'Interiores', to: 'Carrileros', value: 72 },
    { from: 'Interiores', to: 'Punta', value: 54 },
    { from: 'Carrileros', to: 'Punta', value: 46 },
    { from: 'Zaga', to: 'Interiores', value: 31 },
    { from: 'Doble 5', to: 'Punta', value: 22 },
  ],
};

// ── 45 · Cadena de decisión ofensiva ─────────────────────────────────
export const AF_CHART_FUNNEL_STAGES = [
  'Posesiones',
  'Progresiones',
  'Entradas al último tercio',
  'Ocasiones',
  'Remates a puerta',
];

export const AF_CHART_FUNNEL_SERIES: readonly AfChartSeries[] = [
  { name: 'Cadena ofensiva', data: [214, 138, 76, 23, 11] },
];

// ── 46 · Distribución de velocidad por posición ──────────────────────
/**
 * Densidades suavizadas de velocidad instantánea.
 *
 * Cada distribución lleva una segunda cresta menor: es el reparto real entre
 * desplazamientos de trote y de carrera, y es justamente la forma que un boxplot
 * aplanaría a cinco números.
 */
export const AF_CHART_SPEED_DENSITY: readonly AfChartSeries[] = (() => {
  const positions = ['Delantero', 'Extremo', 'Volante', 'Defensor', 'Arquero'];
  const means = [16.5, 17.8, 14.2, 13.4, 7.8];
  const deviations = [5.2, 5.6, 4.4, 4.1, 3.2];
  const bins = 48;
  const low = 0;
  const high = 32;

  return positions.map((name, index) => ({
    name,
    data: Array.from({ length: bins }, (_, step): AfChartPoint => {
      const x = low + ((high - low) * step) / (bins - 1);
      const mean = means[index];
      const deviation = deviations[index];
      const primary = Math.exp(-((x - mean) ** 2) / (2 * deviation ** 2)) * 13;
      const secondary =
        Math.exp(-((x - mean * 0.45) ** 2) / (2 * (deviation * 0.7) ** 2)) * 5;
      return { x: round(x), value: round(primary + secondary) };
    }),
  }));
})();

// ── 47 · Distancia individual por puesto ─────────────────────────────
export const AF_CHART_DISTANCE_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(4409);
  const positions = ['Arquero', 'Defensor', 'Volante', 'Extremo', 'Delantero'];
  const counts = [3, 8, 7, 6, 5];
  const means = [3.6, 7.9, 8.6, 9.4, 8.8];
  return positions.map((name, index) => ({
    name,
    data: Array.from({ length: counts[index] }, () => round(means[index] + (random() - 0.5) * 1.9)),
  }));
})();

// ── 48 · Cumplimiento de sesiones ────────────────────────────────────
export const AF_CHART_ATTENDANCE_PLAYERS = [
  'Ríos',
  'Vargas',
  'Ledesma',
  'Ibarra',
  'Sosa',
  'Molina',
];

export const AF_CHART_ATTENDANCE_PLANNED = 9;

export const AF_CHART_ATTENDANCE_SERIES: readonly AfChartSeries[] = [
  { name: 'Sesiones completadas', data: [9, 8, 8, 6, 5, 4] },
];

// ── 49 · Acciones por sector del campo ───────────────────────────────
export const AF_CHART_FIELD_SECTORS = Array.from({ length: 8 }, (_, index) => `Zona ${index + 1}`);

export const AF_CHART_FIELD_SERIES: readonly AfChartSeries[] = [
  { name: 'Acciones con balón', data: [42, 68, 96, 124, 148, 112, 74, 38] },
];

// ── Dispersión distancia–HSR con tabla por observación ───────────────
/**
 * Un punto por jugador con tres magnitudes: distancia, alta velocidad y sprint.
 *
 * Es el caso que hace ilegible la tabla por series: en filas por serie sólo cabría una
 * de las tres, y las otras dos desaparecerían del resumen textual.
 */
export const AF_CHART_HSR_SERIES: readonly AfChartSeries[] = (() => {
  const random = seeded(5501);
  const players = [
    'Adri Vega',
    'Franco Bellini',
    'Kelechi Okoro',
    'Mateo Ferreyra',
    'Nicolás Roldán',
    'Oliver Redmond',
    'Iván Duarte',
    'Tomás Aguirre',
    'Luca Moretti',
    'Diego Sandoval',
    'Samuel Ortega',
    'Bruno Salazar',
    'Emiliano Ruiz',
    'Joaquín Herrera',
  ];
  return [
    {
      name: 'Distancia / HSR / Sprint (m)',
      data: players.map((label): AfChartPoint => {
        const distance = Math.round(17_500 + random() * 12_000);
        const highSpeed = Math.round(500 + (distance - 17_000) * 0.06 + random() * 500);
        const sprint = Math.round(40 + highSpeed * 0.14 + random() * 60);
        return { label, x: distance, y: highSpeed, z: sprint, value: highSpeed };
      }),
    },
  ];
})();
