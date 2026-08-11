import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfTimelineComponent } from './af-timeline.component';

const meta: Meta<AfTimelineComponent> = {
  title: 'Data/Timeline',
  component: AfTimelineComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfTimeline',
      useWhen: ['Para mostrar actividad o hitos ordenados temporalmente.'],
      avoidWhen: ['Para pasos accionables de un proceso; usa AfStepper.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-border","--af-text-muted"],
      related: ["AfStepper","AfDataView"],
    },
    docs: { description: { component: 'Secuencia cronológica adaptativa de eventos con estados de carga y vacío.' } },
  },
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    loading: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-timeline [items]="items" [ariaLabel]="ariaLabel" [density]="density" [loading]="loading" [error]="error" (itemPressed)="itemPressed($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfTimelineComponent>;

export const Default: Story = {
  args: {
    ariaLabel: 'Actividad del jugador',
    items: [{ id: '1', title: 'Alta médica', timestamp: 'Hoy · 09:15', description: 'Disponible para entrenamiento completo.', tone: 'success' }, { id: '2', title: 'Evaluación física', timestamp: 'Ayer · 17:30', description: 'Prueba de velocidad completada.', tone: 'info' }, { id: '3', title: 'Partido', timestamp: '10 ago · 20:00', description: '72 minutos disputados.', tone: 'neutral' }],
    itemPressed: fn(),
  },
};

export const Empty: Story = {
  args: { items: [], emptyTitle: 'Sin actividad reciente', emptyDescription: 'Los eventos aparecerán aquí.' },
};
