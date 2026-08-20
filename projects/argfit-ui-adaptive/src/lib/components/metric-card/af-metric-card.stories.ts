import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfMetricCardComponent } from './af-metric-card.component';

const meta: Meta<AfMetricCardComponent> = {
  title: 'Data/MetricCard',
  component: AfMetricCardComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfMetricCard',
      useWhen: ['summarizing a metric with context', 'showing trends samples and provenance'],
      avoidWhen: ['dense tabular datasets', 'metrics without enough explanatory context'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-card-bg', '--af-chart-primary', '--af-text-muted'],
      related: ['AfCard', 'AfDataTable', 'AfProgress'],
    },
    docs: {
      description: {
        component: 'Honest metric summary with trend, sample size, period and provenance.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    },
    state: { control: 'select', options: ['ready', 'loading', 'empty', 'error'] },
    variant: { control: 'select', options: ['surface', 'elevated', 'outline'] },
  },
};

export default meta;
type Story = StoryObj<AfMetricCardComponent>;
export const Default: Story = {
  args: {
    label: 'Carga semanal',
    value: 428,
    unit: 'AU',
    helper: 'Objetivo 380–450',
    tone: 'primary',
    state: 'ready',
    variant: 'surface',
    trendValue: 8,
    trendDirection: 'up',
    trendLabel: 'vs. semana anterior',
    sample: { numerator: 5, denominator: 5 },
    period: '5–11 ago',
    provenance: 'calculated',
  },
};
export const Empty: Story = {
  args: {
    ...Default.args,
    state: 'empty',
    emptyText: 'Sin muestra',
    emptyDescription: 'Registra al menos una sesión para calcular la carga.',
  },
};
export const Error: Story = {
  args: {
    ...Default.args,
    state: 'error',
    errorText: 'Dato no disponible',
    errorDescription: 'No pudimos calcular la métrica.',
  },
};

/**
 * La altura de la tarjeta la decide el contenedor, no el largo de su contenido. Las dos
 * tarjetas de abajo tienen contenidos muy distintos y deben terminar exactamente igual de
 * altas: si una queda corta, volvió la regresión del contrato de layout.
 */
export const FillsContainer: Story = {
  args: { ...Default.args },
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
        <af-metric-card
          label="Cobertura de wellness del plantel profesional"
          [value]="88"
          unit="%"
          helper="Cuestionarios respondidos antes de la sesión de la mañana."
          [sample]="{ numerator: 22, denominator: 25 }"
          period="Julio 2026"
          provenance="calculated"
        />
        <af-metric-card label="Requieren revisión" [value]="3" tone="warning" />
      </div>
    `,
  }),
};

/**
 * `fill` es para el caso en que es el propio host el que no recibe altura: acá el
 * contenedor tiene altura fija y `align-items: flex-start`, así que sin `fill` la tarjeta
 * se quedaría en su altura intrínseca.
 */
export const FillFixedHeightContainer: Story = {
  args: { ...Default.args },
  render: () => ({
    template: `
      <div style="display: flex; align-items: flex-start; gap: 16px; height: 320px">
        <af-metric-card label="Sin fill" [value]="12" style="flex: 1" />
        <af-metric-card label="Con fill" [value]="12" tone="accent" fill style="flex: 1" />
      </div>
    `,
  }),
};
