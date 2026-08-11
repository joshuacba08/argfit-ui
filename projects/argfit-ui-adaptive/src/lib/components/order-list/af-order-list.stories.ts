import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfOrderListComponent } from './af-order-list.component';

const meta: Meta<AfOrderListComponent> = {
  title: 'Data/OrderList',
  component: AfOrderListComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfOrderList',
      useWhen: ['Para establecer una prioridad o secuencia manual en una colección.'],
      avoidWhen: ['Para flujo entre varios estados; usa AfKanban.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfPickList","AfKanban"],
    },
    docs: { description: { component: 'Lista seleccionable con acciones de reordenamiento accesibles.' } },
  },
  argTypes: {
    selectionMode: { control: 'select', options: ['single', 'multiple'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-order-list [items]="items" [selectedIds]="selectedIds" [selectionMode]="selectionMode" [density]="density" [disabled]="disabled" [loading]="loading" (selectionChange)="selectionChange($event)" (reorderChange)="reorderChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfOrderListComponent>;

export const Default: Story = {
  args: {
    items: [{ id: '1', label: 'Penaltis', description: 'Ana Martínez', meta: 'Prioridad 1' }, { id: '2', label: 'Faltas directas', description: 'Lucía Campos', meta: 'Prioridad 2' }, { id: '3', label: 'Córners', description: 'Marta Ruiz', meta: 'Prioridad 3' }],
    selectedIds: ['2'],
    selectionMode: 'single',
    selectionChange: fn(),
    reorderChange: fn(),
  },
};

export const Loading: Story = {
  args: { items: [], loading: true },
};
