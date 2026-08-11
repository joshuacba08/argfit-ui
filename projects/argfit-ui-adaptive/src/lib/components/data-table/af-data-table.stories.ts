import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfDataTableComponent } from './af-data-table.component';

const COLUMNS = [
  { key: 'name', header: 'Atleta', sortable: true, mobilePriority: 'primary' as const },
  { key: 'position', header: 'Posición', mobilePriority: 'secondary' as const },
  {
    key: 'availability',
    header: 'Disponibilidad',
    align: 'end' as const,
    mobilePriority: 'primary' as const,
  },
];

const ROWS = [
  { id: '1', name: 'Sofía Martínez', position: 'Portera', availability: 'Disponible' },
  { id: '2', name: 'Lucía Gómez', position: 'Defensa', availability: 'Carga limitada' },
  { id: '3', name: 'Valentina Ruiz', position: 'Delantera', availability: 'Disponible' },
];

const meta: Meta<AfDataTableComponent> = {
  title: 'Data/DataTable',
  component: AfDataTableComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfDataTable',
      useWhen: ['structured tabular data', 'sortable or selectable desktop and mobile datasets'],
      avoidWhen: ['small key-value summaries', 'free-form card collections'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-surface', '--af-border', '--af-text-muted'],
      related: ['AfMetricCard', 'AfSelect'],
    },
    docs: {
      description: {
        component: 'Adaptive data table that becomes a readable record list on mobile.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface"><af-data-table [columns]="columns" [rows]="rows" [density]="density" [selectionMode]="selectionMode" [selectedRowIds]="selectedRowIds" [loading]="loading" [error]="error" [emptyTitle]="emptyTitle" [emptyDescription]="emptyDescription" ariaLabel="Disponibilidad del plantel" /></div>`,
  }),
};

export default meta;
type Story = StoryObj<AfDataTableComponent>;
export const Default: Story = {
  args: {
    columns: COLUMNS,
    rows: ROWS,
    density: 'normal',
    selectionMode: 'multiple',
    selectedRowIds: ['1'],
  },
};
export const Loading: Story = { args: { ...Default.args, rows: [], loading: true } };
export const Empty: Story = {
  args: {
    ...Default.args,
    rows: [],
    selectionMode: 'none',
    emptyTitle: 'Sin atletas',
    emptyDescription: 'Añade el primer atleta para comenzar.',
  },
};
