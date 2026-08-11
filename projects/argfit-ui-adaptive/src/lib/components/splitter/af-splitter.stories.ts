import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';
import { moduleMetadata } from '@storybook/angular-vite';
import { AfSplitterPrimaryDirective, AfSplitterSecondaryDirective } from './af-splitter-slots.directive';

import { AfSplitterComponent } from './af-splitter.component';

const meta: Meta<AfSplitterComponent> = {
  title: 'Components/Surfaces/Splitter',
  component: AfSplitterComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfSplitterPrimaryDirective, AfSplitterSecondaryDirective] })],
  parameters: {
    argfit: {
      category: 'Surfaces',
      importName: 'AfSplitter',
      useWhen: ['Para comparar o editar dos regiones que comparten el espacio disponible.'],
      avoidWhen: ['Para layouts responsive sin redimensionado manual.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-border","--af-bg-surface"],
      related: ["AfPanel","AfDrawer"],
    },
    docs: { description: { component: 'Layout de dos paneles redimensionables con límites accesibles.' } },
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    primarySize: { control: { type: 'range', min: 25, max: 75 } },
    minPrimarySize: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `<af-splitter [primaryLabel]="primaryLabel" [secondaryLabel]="secondaryLabel" [primarySize]="primarySize" [orientation]="orientation" (primarySizeChange)="primarySizeChange($event)"><section afSplitterPrimary><h3>Jugadores</h3><p>Lista principal</p></section><section afSplitterSecondary><h3>Ficha</h3><p>Detalle seleccionado</p></section></af-splitter>`,
  }),
};

export default meta;
type Story = StoryObj<AfSplitterComponent>;

export const Default: Story = {
  args: {
    primaryLabel: 'Lista de jugadores',
    secondaryLabel: 'Detalle del jugador',
    primarySize: 40,
    minPrimarySize: 25,
    minSecondarySize: 25,
    primarySizeChange: fn(),
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', primarySize: 50 },
};
