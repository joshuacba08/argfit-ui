import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfAnalyticsCardComponent } from './af-analytics-card.component';

const meta: Meta<AfAnalyticsCardComponent> = {
  title: 'Data/AnalyticsCard',
  component: AfAnalyticsCardComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfAnalyticsCard',
      useWhen: ['Para agrupar una visualización o KPI con contexto y estados de datos.'],
      avoidWhen: ['Para una métrica aislada sin contenido complejo; usa AfMetricCard.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-card-border","--af-bg-surface"],
      related: ["AfChart","AfMetricCard"],
    },
    docs: { description: { component: 'Superficie de analítica con cabecera, estados de carga y contenido proyectado.' } },
  },
  argTypes: {
    state: { control: 'select', options: ['ready', 'loading', 'empty', 'error'] },
    variant: { control: 'select', options: ['surface', 'elevated', 'outline'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-analytics-card [title]="title" [subtitle]="subtitle" [state]="state" [tone]="tone" [variant]="variant"><p>La carga media aumentó un 8% respecto a la semana anterior.</p></af-analytics-card>`,
  }),
};

export default meta;
type Story = StoryObj<AfAnalyticsCardComponent>;

export const Default: Story = {
  args: {
    title: 'Rendimiento semanal',
    subtitle: 'Últimos 7 días',
    state: 'ready',
    tone: 'primary',
  },
};

export const Loading: Story = {
  args: { state: 'loading' },
};
