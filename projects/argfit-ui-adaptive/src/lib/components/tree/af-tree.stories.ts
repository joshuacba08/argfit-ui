import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfTreeComponent } from './af-tree.component';

const meta: Meta<AfTreeComponent> = {
  title: 'Data/Tree',
  component: AfTreeComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfTree',
      useWhen: ['Para explorar categorías, carpetas o relaciones padre-hijo.'],
      avoidWhen: ['Para jerarquías con varias columnas comparables; usa AfTreeTable.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfTreeTable","AfOrganizationChart"],
    },
    docs: { description: { component: 'Árbol jerárquico expandible y seleccionable con estados adaptativos.' } },
  },
  argTypes: {
    selectionMode: { control: 'select', options: ['none', 'single', 'multiple'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-tree [nodes]="nodes" [expandedIds]="expandedIds" [selectedIds]="selectedIds" [selectionMode]="selectionMode" [density]="density" [loading]="loading" [error]="error" (selectionChange)="selectionChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfTreeComponent>;

export const Default: Story = {
  args: {
    nodes: [{ id: 'first-team', label: 'Primer equipo', children: [{ id: 'goalkeepers', label: 'Porteras', children: [{ id: 'player-1', label: 'Sofía Martínez', meta: 'Dorsal 1' }] }, { id: 'defenders', label: 'Defensas', children: [{ id: 'player-4', label: 'Lucía Gómez', meta: 'Dorsal 4' }] }] }, { id: 'academy', label: 'Cantera' }],
    expandedIds: ['first-team', 'goalkeepers'],
    selectedIds: ['player-1'],
    selectionMode: 'single',
    selectionChange: fn(),
  },
};

export const Empty: Story = {
  args: { nodes: [], emptyTitle: 'Sin categorías', emptyDescription: 'Crea la primera categoría.' },
};
