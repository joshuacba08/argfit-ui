import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfAccordionComponent } from './af-accordion.component';

const meta: Meta<AfAccordionComponent> = {
  title: 'Components/Surfaces/Accordion',
  component: AfAccordionComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Surfaces',
      importName: 'AfAccordion',
      useWhen: ['Para revelar detalles de varias secciones sin mostrar todo simultáneamente.'],
      avoidWhen: ['Para cambiar entre vistas independientes; usa AfTabs.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfTabs","AfPanel"],
    },
    docs: { description: { component: 'Colección de secciones expandibles con selección simple o múltiple.' } },
  },
  argTypes: {
    multiple: { control: 'boolean' },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-accordion [items]="items" [expandedIds]="expandedIds" [multiple]="multiple" [density]="density" [disabled]="disabled" (expandedChange)="expandedChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfAccordionComponent>;

export const Default: Story = {
  args: {
    items: [{ id: 'profile', label: 'Perfil deportivo', description: 'Posición, dorsal y características.' }, { id: 'availability', label: 'Disponibilidad', description: 'Lesiones, restricciones y minutos.' }, { id: 'contract', label: 'Contrato', description: 'Vigencia y condiciones administrativas.' }],
    expandedIds: ['profile'],
    multiple: false,
    expandedChange: fn(),
  },
};

export const Multiple: Story = {
  args: { multiple: true, expandedIds: ['profile', 'availability'] },
};
