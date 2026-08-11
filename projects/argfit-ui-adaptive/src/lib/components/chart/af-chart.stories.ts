import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfChartComponent } from './af-chart.component';

const meta: Meta<AfChartComponent> = {
  title: 'Data/Chart',
  component: AfChartComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfChart',
      useWhen: ['Para comparar tendencias o distribuciones de datos cuantitativos.'],
      avoidWhen: ['Para un único valor destacado; usa AfMetricCard.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-chart-tooltip-text","--af-bg-surface"],
      related: ["AfAnalyticsCard","AfMetricCard"],
    },
    docs: { description: { component: 'Visualización adaptativa con series vendor-neutral, leyenda y tabla accesible.' } },
  },
  argTypes: {
    type: { control: 'select', options: ['line', 'area', 'bar', 'stacked-bar', 'horizontal-bar', 'sparkline', 'donut', 'gauge', 'radar'] },
    legend: { control: 'boolean' },
    dataTable: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-chart [title]="title" [description]="description" [type]="type" [categories]="categories" [series]="series" [legend]="legend" [dataTable]="dataTable" [loading]="loading" (pointSelect)="pointSelect($event)" />`,
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
