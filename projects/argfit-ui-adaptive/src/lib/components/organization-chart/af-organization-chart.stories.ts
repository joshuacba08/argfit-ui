import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfOrganizationChartComponent } from './af-organization-chart.component';

const meta: Meta<AfOrganizationChartComponent> = {
  title: 'Data/OrganizationChart',
  component: AfOrganizationChartComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfOrganizationChart',
      useWhen: ['Para visualizar relaciones de dependencia entre personas o unidades.'],
      avoidWhen: ['Para una jerarquía genérica de archivos o categorías; usa AfTree.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfTree","AfAvatar"],
    },
    docs: { description: { component: 'Jerarquía organizativa expandible y seleccionable con representación adaptativa.' } },
  },
  argTypes: {
    selectionMode: { control: 'select', options: ['none', 'single', 'multiple'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-organization-chart [nodes]="nodes" [expandedIds]="expandedIds" [selectedIds]="selectedIds" [selectionMode]="selectionMode" [density]="density" [loading]="loading" (selectionChange)="selectionChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfOrganizationChartComponent>;

export const Default: Story = {
  args: {
    nodes: [{ id: 'director', label: 'Andrea Morales', title: 'Directora deportiva', avatarLabel: 'AM', children: [{ id: 'coach', label: 'Laura Castillo', title: 'Entrenadora', avatarLabel: 'LC', children: [{ id: 'assistant', label: 'Marta Ruiz', title: 'Asistente', avatarLabel: 'MR' }] }, { id: 'medical', label: 'Elena Torres', title: 'Responsable médica', avatarLabel: 'ET' }] }],
    expandedIds: ['director', 'coach'],
    selectedIds: ['coach'],
    selectionMode: 'single',
    selectionChange: fn(),
  },
};

export const Empty: Story = {
  args: { nodes: [], emptyTitle: 'Sin estructura definida', emptyDescription: 'Añade la primera unidad organizativa.' },
};
