import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfTreeTableComponent } from './af-tree-table.component';

const meta: Meta<AfTreeTableComponent> = {
  title: 'Data/TreeTable',
  component: AfTreeTableComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfTreeTable',
      useWhen: ['Para comparar atributos tabulares dentro de una jerarquía.'],
      avoidWhen: ['Para una jerarquía de etiquetas sin columnas; usa AfTree.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfTree","AfDataTable"],
    },
    docs: { description: { component: 'Tabla jerárquica adaptativa con expansión, selección y columnas vendor-neutral.' } },
  },
  argTypes: {
    selectionMode: { control: 'select', options: ['none', 'single', 'multiple'] },
    density: { control: 'select', options: ['compact', 'normal', 'comfortable'] },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-tree-table [columns]="columns" [nodes]="nodes" [treeColumnKey]="treeColumnKey" [expandedIds]="expandedIds" [selectedIds]="selectedIds" [selectionMode]="selectionMode" [density]="density" [loading]="loading" (selectionChange)="selectionChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfTreeTableComponent>;

export const Default: Story = {
  args: {
    columns: [{ key: 'name', header: 'Equipo', mobilePriority: 'primary' }, { key: 'players', header: 'Jugadores', align: 'end', mobilePriority: 'secondary' }, { key: 'status', header: 'Estado', mobilePriority: 'primary' }],
    nodes: [{ id: 'club', label: 'ArgFit FC', data: { name: 'ArgFit FC', players: 48, status: 'Activo' }, children: [{ id: 'first', label: 'Primer equipo', data: { name: 'Primer equipo', players: 24, status: 'Competición' } }, { id: 'academy', label: 'Cantera', data: { name: 'Cantera', players: 24, status: 'Formación' } }] }],
    treeColumnKey: 'name',
    expandedIds: ['club'],
    selectedIds: ['first'],
    selectionMode: 'single',
    selectionChange: fn(),
  },
};

export const Loading: Story = {
  args: { nodes: [], loading: true },
};
