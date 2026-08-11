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
