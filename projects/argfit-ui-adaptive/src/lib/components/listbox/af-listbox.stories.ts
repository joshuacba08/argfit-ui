import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfListboxComponent } from './af-listbox.component';

const meta: Meta<AfListboxComponent> = {
  title: 'Components/Forms/Listbox',
  component: AfListboxComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfListbox',
      useWhen: ['Cuando las opciones deben permanecer visibles mientras se selecciona.'],
      avoidWhen: ['Para un selector compacto que abre un overlay; usa AfSelect.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfSelect","AfMultiSelect"],
    },
    docs: {
      description: {
        component: 'Lista de opciones siempre visible con selección simple o múltiple.',
      },
    },
  },
  argTypes: {
    selectionMode: { control: 'select', options: ['single', 'multiple'] },
    disabled: { control: 'boolean' },
    density: { control: 'select', options: ['compact', 'comfortable'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-listbox [label]="label" [options]="options" [optionLabel]="optionLabel" [optionValue]="optionValue" [value]="value" [selectionMode]="selectionMode" [disabled]="disabled" (valueChange)="valueChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfListboxComponent>;

export const Default: Story = {
  args: {
    label: 'Posición principal',
    options: [{ id: 'gk', label: 'Portero' }, { id: 'df', label: 'Defensa' }, { id: 'mf', label: 'Centrocampista' }, { id: 'fw', label: 'Delantero' }],
    optionLabel: 'label',
    optionValue: 'id',
    value: 'mf',
    valueChange: fn(),
  },
};

export const Multiple: Story = {
  args: { selectionMode: 'multiple', value: ['df', 'mf'] },
};
