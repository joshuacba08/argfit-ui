import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfVirtualScrollerComponent } from './af-virtual-scroller.component';

const meta: Meta<AfVirtualScrollerComponent> = {
  title: 'Data/VirtualScroller',
  component: AfVirtualScrollerComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfVirtualScroller',
      useWhen: ['Para cientos o miles de filas de altura conocida.'],
      avoidWhen: ['Para paginación estable o colecciones pequeñas; usa AfPaginator o AfDataView.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfPaginator","AfDataView"],
    },
    docs: { description: { component: 'Lista virtualizada para colecciones extensas con rango visible observable.' } },
  },
  argTypes: {
    viewportHeight: { control: 'number' },
    itemHeight: { control: 'number' },
    overscan: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `<af-virtual-scroller [items]="items" [viewportHeight]="viewportHeight" [itemHeight]="itemHeight" [overscan]="overscan" [density]="density" [loading]="loading" [error]="error" (visibleRangeChange)="visibleRangeChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfVirtualScrollerComponent>;

export const Default: Story = {
  args: {
    items: Array.from({ length: 200 }, (_, index) => ({ id: String(index + 1), title: `Jugador ${String(index + 1).padStart(3, '0')}`, description: index % 3 === 0 ? 'Disponible' : 'Seguimiento', meta: `Dorsal ${index + 1}` })),
    viewportHeight: 336,
    itemHeight: 72,
    overscan: 4,
    visibleRangeChange: fn(),
  },
};

export const Loading: Story = {
  args: { items: [], loading: true },
};
