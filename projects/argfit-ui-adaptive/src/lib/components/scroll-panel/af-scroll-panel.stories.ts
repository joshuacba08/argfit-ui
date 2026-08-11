import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfScrollPanelComponent } from './af-scroll-panel.component';

const meta: Meta<AfScrollPanelComponent> = {
  title: 'Components/Surfaces/ScrollPanel',
  component: AfScrollPanelComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Surfaces',
      importName: 'AfScrollPanel',
      useWhen: ['Para contener contenido largo dentro de una región explícita.'],
      avoidWhen: ['Para virtualizar cientos de elementos; usa AfVirtualScroller.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfVirtualScroller","AfPanel"],
    },
    docs: { description: { component: 'Región de scroll con altura y dirección controladas y nombre accesible.' } },
  },
  argTypes: {
    direction: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
    maxHeight: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-scroll-panel [ariaLabel]="ariaLabel" [direction]="direction" [maxHeight]="maxHeight"><p>Observación 01 · Buen rendimiento en presión alta.</p><p>Observación 02 · Mejorar temporización defensiva.</p><p>Observación 03 · Trabajo específico completado.</p><p>Observación 04 · Disponible para convocatoria.</p><p>Observación 05 · Seguimiento semanal pendiente.</p></af-scroll-panel>`,
  }),
};

export default meta;
type Story = StoryObj<AfScrollPanelComponent>;

export const Default: Story = {
  args: {
    ariaLabel: 'Historial de observaciones',
    direction: 'vertical',
    maxHeight: '12rem',
  },
};

export const Horizontal: Story = {
  args: { direction: 'horizontal', maxHeight: '8rem' },
};
