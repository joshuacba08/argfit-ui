import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';
import { moduleMetadata } from '@storybook/angular-vite';
import { AfPopoverContentDirective, AfPopoverTriggerDirective } from './af-popover-slots.directive';

import { AfPopoverComponent } from './af-popover.component';

const meta: Meta<AfPopoverComponent> = {
  title: 'Components/Overlays/Popover',
  component: AfPopoverComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfPopoverContentDirective, AfPopoverTriggerDirective] })],
  parameters: {
    argfit: {
      category: 'Overlays',
      importName: 'AfPopover',
      useWhen: ['Para acciones o información breve relacionada con un elemento concreto.'],
      avoidWhen: ['Para tareas largas o modales; usa AfDrawer o AfDialog.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfTooltip","AfDrawer"],
    },
    docs: { description: { component: 'Overlay contextual anclado a un trigger proyectado.' } },
  },
  argTypes: {
    open: { control: 'boolean' },
    placement: { control: 'select', options: ['top', 'bottom', 'start', 'end'] },
    tone: { control: 'select', options: ['neutral', 'inverse'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-popover [open]="open" [title]="title" [placement]="placement" [tone]="tone" (openChange)="openChange($event)"><button afPopoverTrigger type="button">Abrir acciones</button><div afPopoverContent><button type="button">Ver perfil</button><button type="button">Editar dorsal</button></div></af-popover>`,
  }),
};

export default meta;
type Story = StoryObj<AfPopoverComponent>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Acciones del jugador',
    placement: 'bottom',
    openChange: fn(),
  },
};

export const Closed: Story = {
  args: { open: false },
};
