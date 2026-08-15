import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import {
  AfBadgeComponent,
  AfChartCardComponent,
  AfChartComponent,
  AfChipComponent,
  AfDataTableCellDirective,
  AfDataTableComponent,
  AfInlineMessageComponent,
  AfMetricCardComponent,
  AfProgressComponent,
} from '@argfit-ui/adaptive';
import type { AfDataTableColumn } from '@argfit-ui/core';

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
  AF_CHART_FORECAST_RESIDUAL,
  AF_CHART_FORECAST_SERIES,
  AF_CHART_FORECAST_SLOPE,
  AF_CHART_FORECAST_START_WEEK,
  AF_CHART_FORECAST_WEEKS,
  AF_CHART_MARGINAL_SERIES,
  AF_CHART_MULTIPLES_DAYS,
  AF_CHART_MULTIPLES_SERIES,
  AF_CHART_PANEL_KPIS,
  AF_CHART_PANEL_ROWS,
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
  type AfChartPanelRow,
} from '../../../argfit-ui-adaptive/src/lib/components/chart/af-chart-panel.fixtures';

/**
 * Composición, no componente.
 *
 * El panel analítico es una página: la librería entrega los indicadores, las tarjetas de
 * gráfico y la tabla, y el producto decide la grilla, los filtros y qué se mide. No hay
 * un `AfAnalyticsPanel` que documentar, y no debería haberlo: en cuanto la librería
 * fijara qué KPIs van arriba, dejaría de servir al siguiente equipo que la adopte.
 */
const FILTERS = [
  { label: 'Primer equipo', selected: true, removable: false },
  { label: 'Microciclo 26', selected: false, removable: true },
  { label: 'Todas las posiciones', selected: false, removable: true },
  { label: 'Sesiones con GPS', selected: false, removable: true },
  { label: 'Excluye porteros', selected: false, removable: true },
];

const TRACKING_COLUMNS: readonly AfDataTableColumn<AfChartPanelRow>[] = [
  { key: 'player', header: 'Jugador', mobilePriority: 'primary' },
  { key: 'load', header: 'Carga', align: 'end', mobilePriority: 'primary' },
  { key: 'acwr', header: 'ACWR', align: 'end', mobilePriority: 'secondary' },
  { key: 'trend', header: 'Tendencia', align: 'end', mobilePriority: 'tertiary' },
  { key: 'status', header: 'Estado', align: 'end', mobilePriority: 'secondary' },
];

const STATUS_LABEL: Record<AfChartPanelRow['status'], string> = {
  ok: 'Apto',
  watch: 'Vigilar',
  risk: 'Riesgo',
};

const STATUS_TONE: Record<AfChartPanelRow['status'], string> = {
  ok: 'success',
  watch: 'warning',
  risk: 'danger',
};

const meta: Meta = {
  title: 'Patterns/Analytics/Panel',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        AfBadgeComponent,
        AfChartCardComponent,
        AfChartComponent,
        AfChipComponent,
        AfDataTableCellDirective,
        AfDataTableComponent,
        AfInlineMessageComponent,
        AfMetricCardComponent,
        AfProgressComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Panel de control de un mesociclo compuesto sólo con piezas de la librería: ' +
          '`AfChip` para los filtros aplicados, `AfMetricCard` con una sparkline proyectada ' +
          'para cada indicador, `AfChartCard` para los paneles y `AfDataTable` con plantillas ' +
          'de celda para el seguimiento individual. La grilla y la elección de métricas son ' +
          'del producto, no de la librería.',
      },
    },
  },
  render: () => ({
    props: {
      filters: FILTERS,
      kpis: AF_CHART_PANEL_KPIS,
      rows: AF_CHART_PANEL_ROWS,
      columns: TRACKING_COLUMNS,
      statusLabel: STATUS_LABEL,
      statusTone: STATUS_TONE,
      forecastWeeks: AF_CHART_FORECAST_WEEKS,
      forecastSeries: AF_CHART_FORECAST_SERIES,
      forecastBands: AF_CHART_FORECAST_BANDS,
      forecastRegions: [
        {
          from: AF_CHART_FORECAST_START_WEEK,
          to: AF_CHART_FORECAST_LAST_WEEK,
          axis: 'x',
          label: 'proyección',
        },
      ],
      forecastAnnotations: [
        {
          x: AF_CHART_FORECAST_LAST_WEEK,
          y: AF_CHART_FORECAST_LAST_VALUE,
          label: String(AF_CHART_FORECAST_LAST_VALUE),
        },
      ],
      forecastFoot: `pendiente +${AF_CHART_FORECAST_SLOPE} UA por semana · error estándar ${AF_CHART_FORECAST_RESIDUAL} UA`,
      cmjSeries: AF_CHART_CMJ_SERIES,
      cmjRange: AF_CHART_CMJ_RANGE,
      cmjThresholds: [
        { value: AF_CHART_CMJ_MEAN, axis: 'x', tone: 'primary', label: 'media' },
        { value: AF_CHART_CMJ_P10, axis: 'x', tone: 'warning', label: 'P10' },
        { value: AF_CHART_CMJ_P90, axis: 'x', tone: 'success', label: 'P90' },
      ],
      targetIndicators: AF_CHART_TARGET_INDICATORS,
      targetSeries: AF_CHART_TARGET_SERIES,
      waterfallSteps: AF_CHART_WATERFALL_STEPS,
      waterfallSeries: AF_CHART_WATERFALL_SERIES,
      deviationPlayers: AF_CHART_DEVIATION_PLAYERS,
      deviationSeries: AF_CHART_DEVIATION_SERIES,
      seasonLanes: AF_CHART_SEASON_LANES,
      seasonSpans: AF_CHART_SEASON_SPANS,
      seasonThresholds: [{ value: AF_CHART_CURRENT_WEEK, tone: 'danger', label: 'hoy' }],
      batteryTests: AF_CHART_BATTERY_TESTS,
      batterySeries: AF_CHART_BATTERY_SERIES,
      multiplesDays: AF_CHART_MULTIPLES_DAYS,
      multiplesSeries: AF_CHART_MULTIPLES_SERIES,
      multiplesThresholds: [{ value: AF_CHART_SESSION_THRESHOLD, tone: 'warning' }],
      marginalSeries: AF_CHART_MARGINAL_SERIES,
      paretoCauses: AF_CHART_PARETO_CAUSES,
      paretoSeries: AF_CHART_PARETO_SERIES,
      paretoThresholds: [{ value: 80, role: 'secondary', tone: 'warning', label: '80%' }],
      sharePositions: AF_CHART_SHARE_POSITIONS,
      shareSeries: AF_CHART_SHARE_SERIES,
    },
    template: `
      <div class="af-story-surface" style="display:grid;gap:24px">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          @for (filter of filters; track filter.label) {
            <af-chip
              size="sm"
              [selected]="filter.selected"
              [removable]="filter.removable"
            >{{ filter.label }}</af-chip>
          }
        </div>

        <div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">
          @for (kpi of kpis; track kpi.label) {
            <af-metric-card
              [label]="kpi.label"
              [value]="kpi.value"
              [unit]="kpi.unit"
              [trendDirection]="kpi.trend"
              [trendLabel]="kpi.trendLabel"
              [tone]="kpi.tone"
            >
              <af-chart
                type="sparkline"
                [series]="[{ name: kpi.label, data: kpi.series, tone: kpi.tone }]"
                [height]="34"
                [legend]="false"
                [interactive]="false"
              />
            </af-metric-card>
          }
        </div>

        <div style="display:grid;gap:18px;grid-template-columns:repeat(12,1fr)">
          <div style="grid-column:span 8">
            <af-chart-card
              heading="Proyección de carga a 8 semanas"
              tag="Forecast · tendencia"
              note="Serie observada, recta de tendencia proyectada y banda de confianza del 95% que se abre con el horizonte."
              exportName="proyeccion-carga"
            >
              <af-chart
                type="line"
                [categories]="forecastWeeks"
                [series]="forecastSeries"
                [bands]="forecastBands"
                [regions]="forecastRegions"
                [annotations]="forecastAnnotations"
                [yAxis]="{ name: 'UA', min: 2600 }"
                [height]="320"
              />
              <af-inline-message
                severity="info"
                title="Lectura"
                description="Manteniendo la pendiente actual, la carga superaría el techo planificado de 5 200 UA antes del cierre del horizonte. Recortar dos sesiones de alta intensidad devuelve la proyección al rango objetivo."
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 4">
            <af-chart-card
              heading="Distribución de altura de CMJ"
              tag="Histograma + normal"
              note="180 saltos del plantel con ajuste normal, media y percentiles 10 y 90."
              exportName="distribucion-cmj"
            >
              <af-chart
                type="histogram"
                [series]="cmjSeries"
                [xAxis]="{ name: 'altura de CMJ (cm)', min: cmjRange.min, max: cmjRange.max }"
                [yAxis]="{ name: 'n.º de saltos' }"
                [thresholds]="cmjThresholds"
                [height]="320"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 5">
            <af-chart-card
              heading="Cumplimiento de objetivos"
              tag="Bullet"
              note="Cada barra es el valor observado como porcentaje del objetivo semanal."
              exportName="cumplimiento-objetivos"
            >
              <af-chart
                type="bullet"
                [categories]="targetIndicators"
                [series]="targetSeries"
                [xAxis]="{ name: '% del objetivo', max: 130 }"
                [height]="280"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 7">
            <af-chart-card
              heading="Descomposición del cambio de carga"
              tag="Cascada"
              note="Contribución de cada contenido al salto de carga entre semanas."
              exportName="descomposicion-carga"
            >
              <af-chart
                type="waterfall"
                [categories]="waterfallSteps"
                [series]="waterfallSeries"
                [yAxis]="{ name: 'UA', min: 3000 }"
                [height]="280"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 5">
            <af-chart-card
              heading="Desvío individual"
              tag="z-score"
              note="Distancia de cada jugador respecto a la media del plantel en carga acumulada."
              exportName="desvio-individual"
            >
              <af-chart
                type="diverging-bar"
                [categories]="deviationPlayers"
                [series]="deviationSeries"
                [xAxis]="{ name: 'desvío estándar', min: -2.2, max: 2.2 }"
                [legend]="false"
                [height]="340"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 7">
            <af-chart-card
              heading="Pretemporada frente al cierre de ciclo"
              tag="Dumbbell"
              note="Cambio en las seis pruebas de la batería física, normalizado al mejor registro de cada test."
              exportName="bateria-fisica"
            >
              <af-chart
                type="dumbbell"
                [categories]="batteryTests"
                [series]="batterySeries"
                [xAxis]="{ name: '% del mejor registro', min: 70, max: 112 }"
                [height]="340"
              />
              <af-inline-message
                severity="success"
                title="Destacado"
                description="La mayor ganancia está en el nórdico y en el Yo-Yo IR1; la movilidad de tobillo apenas se movió y sigue siendo el limitante del grupo."
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 7">
            <af-chart-card
              heading="Pequeños múltiplos de carga individual"
              tag="Small multiples"
              note="Un panel por jugador con la misma escala; la línea punteada marca el umbral por sesión."
              exportName="carga-individual"
            >
              <af-chart
                type="small-multiples"
                [categories]="multiplesDays"
                [series]="multiplesSeries"
                [yAxis]="{ max: 1000 }"
                [thresholds]="multiplesThresholds"
                [legend]="false"
                [height]="400"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 5">
            <af-chart-card
              heading="Velocidad frente a capacidad aeróbica"
              tag="Dispersión + marginales"
              note="Sprint de 30 m contra nivel alcanzado en Yo-Yo IR1, con histogramas en ambos márgenes."
              exportName="velocidad-aerobico"
            >
              <af-chart
                type="scatter-marginal"
                [series]="marginalSeries"
                [xAxis]="{ name: 'sprint 30 m (s)', min: 3.9, max: 5 }"
                [yAxis]="{ name: 'Yo-Yo IR1 (nivel)', min: 40, max: 80 }"
                [legend]="false"
                [height]="400"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 5">
            <af-chart-card
              heading="Causas de baja"
              tag="Pareto"
              note="Episodios por causa y porcentaje acumulado; tres causas explican la mayor parte del total."
              exportName="causas-baja"
            >
              <af-chart
                type="combo"
                [categories]="paretoCauses"
                [series]="paretoSeries"
                [yAxis]="{ name: 'episodios' }"
                [secondaryAxis]="{ name: '%', min: 0, max: 100 }"
                [thresholds]="paretoThresholds"
                [height]="300"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 12">
            <af-chart-card
              heading="Tabla de seguimiento"
              tag="Detalle"
              note="Estado del plantel al corte, ordenado por carga acumulada."
              [menu]="[]"
            >
              <af-data-table
                [columns]="columns"
                [rows]="rows"
                rowIdKey="id"
                density="compact"
                ariaLabel="Seguimiento del plantel"
              >
                <ng-template afDataTableCell="load" let-row="row">
                  <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end">
                    <span>{{ row.load }}%</span>
                    <af-progress [value]="row.load" size="sm" style="width:74px" />
                  </div>
                </ng-template>

                <ng-template afDataTableCell="acwr" let-row="row">
                  {{ row.acwr.toFixed(2) }}
                </ng-template>

                <ng-template afDataTableCell="trend" let-row="row">
                  <af-chart
                    type="sparkline"
                    [series]="[{ name: row.player, data: row.trend, tone: statusTone[row.status] }]"
                    [height]="24"
                    [legend]="false"
                    [interactive]="false"
                  />
                </ng-template>

                <ng-template afDataTableCell="status" let-row="row">
                  <af-badge [tone]="statusTone[row.status]" size="sm">
                    {{ statusLabel[row.status] }}
                  </af-badge>
                </ng-template>
              </af-data-table>
            </af-chart-card>
          </div>

          <div style="grid-column:span 7">
            <af-chart-card
              heading="Periodización de la temporada"
              tag="Gantt"
              note="Bloques de contenido a lo largo de 100 semanas; la marca roja indica la semana en curso."
              exportName="periodizacion"
            >
              <af-chart
                type="gantt"
                [categories]="seasonLanes"
                [spans]="seasonSpans"
                [xAxis]="{ name: 'semana de temporada', min: 0, max: 100 }"
                [thresholds]="seasonThresholds"
                [legend]="false"
                [height]="300"
              />
            </af-chart-card>
          </div>

          <div style="grid-column:span 5">
            <af-chart-card
              heading="Reparto del tiempo por zona"
              tag="Barras 100%"
              note="Composición porcentual del tiempo de juego por posición."
              exportName="reparto-zonas"
            >
              <af-chart
                type="stacked-horizontal-bar"
                [categories]="sharePositions"
                [series]="shareSeries"
                [xAxis]="{ name: '% del tiempo de juego', max: 100 }"
                [height]="300"
              />
            </af-chart-card>
          </div>
        </div>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Panel: Story = {};
