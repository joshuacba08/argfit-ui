import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfKanbanComponent } from './af-kanban.component';

const meta: Meta<AfKanbanComponent> = {
  title: 'Data/Kanban',
  component: AfKanbanComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfKanban',
      useWhen: ['Para visualizar trabajo que avanza entre estados discretos.'],
      avoidWhen: ['Para ordenar una sola colección lineal; usa AfOrderList.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfOrderList","AfDataView"],
    },
    docs: { description: { component: 'Tablero adaptativo de columnas y tarjetas con reordenamiento y eventos semánticos.' } },
  },
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    allowReorder: { control: 'boolean' },
    allowCrossColumnMove: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-kanban [title]="title" [columns]="columns" [cards]="cards" [density]="density" [allowReorder]="allowReorder" [allowCrossColumnMove]="allowCrossColumnMove" [readonly]="readonly" (cardClick)="cardClick($event)" (cardMove)="cardMove($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfKanbanComponent>;

export const Default: Story = {
  args: {
    title: 'Plan semanal',
    columns: [{ id: 'planned', label: 'Planificado', meta: '2 tareas' }, { id: 'active', label: 'En curso', meta: '1 tarea' }, { id: 'done', label: 'Completado', meta: '1 tarea' }],
    cards: [{ id: '1', columnId: 'planned', title: 'Vídeo rival', category: 'Análisis', priority: 'medium', assigneeInitials: 'AM' }, { id: '2', columnId: 'planned', title: 'Sesión táctica', category: 'Entrenamiento', priority: 'high', assigneeInitials: 'LC' }, { id: '3', columnId: 'active', title: 'Informe médico', category: 'Salud', priority: 'high', assigneeInitials: 'DR' }, { id: '4', columnId: 'done', title: 'Convocatoria', category: 'Equipo', priority: 'low', assigneeInitials: 'MR' }],
    allowReorder: true,
    allowCrossColumnMove: true,
    cardClick: fn(),
    cardMove: fn(),
  },
};

export const Readonly: Story = {
  args: { readonly: true },
};
