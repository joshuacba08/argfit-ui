import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfTabsComponent } from './af-tabs.component';

const meta: Meta<AfTabsComponent> = {
  title: 'Components/Navigation/Tabs',
  component: AfTabsComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Navigation',
      importName: 'AfTabs',
      useWhen: ['Para alternar secciones relacionadas dentro del mismo contexto.'],
      avoidWhen: ['Para un proceso secuencial; usa AfStepper.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-border","--af-text-main"],
      related: ["AfStepper","AfSegmentedControl"],
    },
    docs: { description: { component: 'Navegación entre paneles equivalentes con variantes cards y line.' } },
  },
  argTypes: {
    variant: { control: 'select', options: ['cards', 'line'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    renderPanel: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-tabs [items]="items" [activeId]="activeId" [variant]="variant" [density]="density" [renderPanel]="renderPanel" [disabled]="disabled" (activeIdChange)="activeIdChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfTabsComponent>;

export const Default: Story = {
  args: {
    items: [{ id: 'overview', label: 'Resumen', description: 'Datos principales' }, { id: 'performance', label: 'Rendimiento', description: 'Métricas deportivas', badge: { label: '12' } }, { id: 'medical', label: 'Salud', description: 'Historial médico' }],
    activeId: 'overview',
    variant: 'cards',
    activeIdChange: fn(),
  },
};

export const Line: Story = {
  args: { variant: 'line' },
};
