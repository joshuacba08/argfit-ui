import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfPickListComponent } from './af-pick-list.component';

const meta: Meta<AfPickListComponent> = {
  title: 'Data/PickList',
  component: AfPickListComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfPickList',
      useWhen: ['Para asignar múltiples elementos entre dos conjuntos explícitos.'],
      avoidWhen: ['Para elegir valores sin representar ambos conjuntos; usa AfMultiSelect.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfMultiSelect","AfOrderList"],
    },
    docs: { description: { component: 'Transferencia accesible entre una colección disponible y otra asignada.' } },
  },
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-pick-list [sourceTitle]="sourceTitle" [targetTitle]="targetTitle" [sourceItems]="sourceItems" [targetItems]="targetItems" [sourceSelectedIds]="sourceSelectedIds" [targetSelectedIds]="targetSelectedIds" [density]="density" [disabled]="disabled" [loading]="loading" (transferChange)="transferChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfPickListComponent>;

export const Default: Story = {
  args: {
    sourceTitle: 'Disponibles',
    targetTitle: 'Convocadas',
    sourceItems: [{ id: '1', label: 'Sofía Martínez', description: 'Portera' }, { id: '2', label: 'Lucía Gómez', description: 'Defensa' }, { id: '3', label: 'Valentina Ruiz', description: 'Delantera' }],
    targetItems: [{ id: '4', label: 'Marta Campos', description: 'Centrocampista' }],
    sourceSelectedIds: ['2'],
    targetSelectedIds: [],
    transferChange: fn(),
  },
};

export const Loading: Story = {
  args: { sourceItems: [], targetItems: [], loading: true },
};
