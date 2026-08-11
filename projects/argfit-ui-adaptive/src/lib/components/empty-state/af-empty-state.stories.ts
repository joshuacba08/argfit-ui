import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfEmptyStateComponent } from './af-empty-state.component';

const meta: Meta<AfEmptyStateComponent> = {
  title: 'Feedback/EmptyState',
  component: AfEmptyStateComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Feedback',
      importName: 'AfEmptyState',
      useWhen: ['Para explicar por qué una superficie no tiene contenido y ofrecer una salida.'],
      avoidWhen: ['Para cargas temporales; usa AfSkeleton o AfProgress.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-text-muted"],
      related: ["AfInlineMessage","AfButton"],
    },
    docs: { description: { component: 'Estado vacío accionable que distingue ausencia, filtros, error y permisos.' } },
  },
  argTypes: {
    tone: { control: 'select', options: ['empty', 'filtered', 'error', 'permission'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-empty-state [title]="title" [description]="description" [tone]="tone" [size]="size" [actions]="actions" (actionSelected)="actionSelected($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfEmptyStateComponent>;

export const Default: Story = {
  args: {
    title: 'Todavía no hay sesiones',
    description: 'Crea la primera sesión para comenzar a planificar la semana.',
    tone: 'empty',
    actions: [{ id: 'create', label: 'Crear sesión', variant: 'primary' }],
    actionSelected: fn(),
  },
};

export const Filtered: Story = {
  args: { title: 'No hay resultados', description: 'Prueba a quitar algún filtro.', tone: 'filtered', actions: [{ id: 'clear', label: 'Limpiar filtros', variant: 'secondary' }] },
};
