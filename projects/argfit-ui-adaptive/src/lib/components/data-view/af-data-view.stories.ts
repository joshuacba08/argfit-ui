import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfDataViewComponent } from './af-data-view.component';

const meta: Meta<AfDataViewComponent> = {
  title: 'Data/DataView',
  component: AfDataViewComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfDataView',
      useWhen: ['Para mostrar entidades enriquecidas en tarjetas o filas.'],
      avoidWhen: ['Para datos tabulares con columnas comparables; usa AfDataTable.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfDataTable","AfCard"],
    },
    docs: { description: { component: 'Colección adaptativa que alterna entre grid y lista manteniendo estados comunes.' } },
  },
  argTypes: {
    layout: { control: 'select', options: ['grid', 'list'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-data-view [items]="items" [layout]="layout" [density]="density" [loading]="loading" [error]="error" [emptyTitle]="emptyTitle" (itemPressed)="itemPressed($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfDataViewComponent>;

export const Default: Story = {
  args: {
    items: [{ id: '1', title: 'Sofía Martínez', eyebrow: 'Portera', description: 'Disponible', meta: 'Dorsal 1' }, { id: '2', title: 'Lucía Gómez', eyebrow: 'Defensa', description: 'Carga limitada', meta: 'Dorsal 4' }, { id: '3', title: 'Valentina Ruiz', eyebrow: 'Delantera', description: 'Disponible', meta: 'Dorsal 9' }],
    layout: 'grid',
    itemPressed: fn(),
  },
};

export const Empty: Story = {
  args: { items: [], emptyTitle: 'Sin jugadoras', emptyDescription: 'Añade la primera jugadora al equipo.' },
};
