import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfPaginatorComponent } from './af-paginator.component';

const meta: Meta<AfPaginatorComponent> = {
  title: 'Data/Paginator',
  component: AfPaginatorComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfPaginator',
      useWhen: ['Para dividir colecciones grandes cuando cada página es una unidad estable.'],
      avoidWhen: ['Para carga continua por scroll; usa AfVirtualScroller o AfSelect.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfDataTable","AfVirtualScroller"],
    },
    docs: { description: { component: 'Navegación paginada con índices cero-based y resumen adaptativo.' } },
  },
  argTypes: {
    pageIndex: { control: 'number' },
    pageSize: { control: 'number' },
    totalItems: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `<af-paginator [pageIndex]="pageIndex" [pageSize]="pageSize" [totalItems]="totalItems" [density]="density" [disabled]="disabled" [ariaLabel]="ariaLabel" (pageChange)="pageChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfPaginatorComponent>;

export const Default: Story = {
  args: {
    pageIndex: 2,
    pageSize: 20,
    totalItems: 147,
    ariaLabel: 'Páginas de jugadores',
    pageChange: fn(),
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
