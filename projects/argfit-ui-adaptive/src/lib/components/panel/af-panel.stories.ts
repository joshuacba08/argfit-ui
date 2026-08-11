import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfPanelComponent } from './af-panel.component';

const meta: Meta<AfPanelComponent> = {
  title: 'Components/Surfaces/Panel',
  component: AfPanelComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Surfaces',
      importName: 'AfPanel',
      useWhen: ['Para agrupar contenido relacionado dentro de una página.'],
      avoidWhen: ['Para una unidad accionable o navegable; usa AfCard.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfCard","AfFieldset"],
    },
    docs: { description: { component: 'Sección semántica con encabezado y contenido proyectado.' } },
  },
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    tone: { control: 'select', options: ['neutral', 'subtle'] },
    heading: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-panel [eyebrow]="eyebrow" [heading]="heading" [description]="description" [density]="density" [tone]="tone"><p>Clasificación, rendimiento y disponibilidad.</p></af-panel>`,
  }),
};

export default meta;
type Story = StoryObj<AfPanelComponent>;

export const Default: Story = {
  args: {
    eyebrow: 'Temporada 2026/27',
    heading: 'Objetivos del equipo',
    description: 'Indicadores compartidos por el cuerpo técnico.',
  },
};

export const Compact: Story = {
  args: { density: 'compact' },
};
