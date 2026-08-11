import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfTooltipComponent } from './af-tooltip.component';

const meta: Meta<AfTooltipComponent> = {
  title: 'Components/Overlays/Tooltip',
  component: AfTooltipComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Overlays',
      importName: 'AfTooltip',
      useWhen: ['Para aclarar un icono o acción sin añadir texto persistente.'],
      avoidWhen: ['Para contenido interactivo o extenso; usa AfPopover.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-text-main"],
      related: ["AfPopover","AfButton"],
    },
    docs: { description: { component: 'Ayuda textual breve asociada a un trigger y accesible por foco.' } },
  },
  argTypes: {
    open: { control: 'boolean' },
    placement: { control: 'select', options: ['top', 'bottom', 'start', 'end'] },
    tone: { control: 'select', options: ['neutral', 'inverse'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-tooltip [text]="text" [open]="open" [placement]="placement" [tone]="tone"><button type="button" aria-label="Añadir jugador">+</button></af-tooltip>`,
  }),
};

export default meta;
type Story = StoryObj<AfTooltipComponent>;

export const Default: Story = {
  args: {
    text: 'Añadir jugador a la convocatoria',
    open: true,
    placement: 'top',
  },
};

export const Bottom: Story = {
  args: { placement: 'bottom' },
};
