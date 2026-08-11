import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfDrawerComponent } from './af-drawer.component';

const meta: Meta<AfDrawerComponent> = {
  title: 'Components/Overlays/Drawer',
  component: AfDrawerComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Overlays',
      importName: 'AfDrawer',
      useWhen: ['Para tareas secundarias que necesitan contexto sin abandonar la pantalla.'],
      avoidWhen: ['Para confirmaciones breves; usa AfDialog.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfDialog","AfPopover"],
    },
    docs: { description: { component: 'Panel modal adaptativo que entra desde un borde y gestiona cierre accesible.' } },
  },
  argTypes: {
    open: { control: 'boolean' },
    placement: { control: 'select', options: ['start', 'end', 'bottom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-drawer [open]="open" [title]="title" [description]="description" [placement]="placement" [size]="size" (openChange)="openChange($event)"><p>Contenido de filtros proyectado por la aplicación.</p></af-drawer>`,
  }),
};

export default meta;
type Story = StoryObj<AfDrawerComponent>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Filtros de jugadores',
    description: 'Refina la plantilla por posición y disponibilidad.',
    placement: 'end',
    openChange: fn(),
  },
};

export const Closed: Story = {
  args: { open: false },
};
