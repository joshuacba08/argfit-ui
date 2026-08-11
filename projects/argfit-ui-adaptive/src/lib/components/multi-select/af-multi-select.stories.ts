import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfMultiSelectComponent } from './af-multi-select.component';

const meta: Meta<AfMultiSelectComponent> = {
  title: 'Components/Forms/MultiSelect',
  component: AfMultiSelectComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfMultiSelect',
      useWhen: ['Para elegir varias entidades de un conjunto mediano o grande.'],
      avoidWhen: ['Para una única opción; usa AfSelect.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfSelect","AfChip"],
    },
    docs: {
      description: {
        component: 'Selector compacto de múltiples opciones con búsqueda y límite opcional.',
      },
    },
  },
  argTypes: {
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    maxSelected: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `<af-multi-select [label]="label" [placeholder]="placeholder" [options]="options" [optionLabel]="optionLabel" [optionValue]="optionValue" [value]="value" [searchable]="searchable" [clearable]="clearable" [maxSelected]="maxSelected" [disabled]="disabled" (valueChange)="valueChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfMultiSelectComponent>;

export const Default: Story = {
  args: {
    label: 'Etiquetas del jugador',
    placeholder: 'Selecciona etiquetas',
    options: [{ id: 'captain', label: 'Capitán' }, { id: 'academy', label: 'Cantera' }, { id: 'injured', label: 'Lesionado' }, { id: 'loan', label: 'Cesión' }],
    optionLabel: 'label',
    optionValue: 'id',
    value: ['captain', 'academy'],
    searchable: true,
    clearable: true,
    valueChange: fn(),
  },
};

export const SelectionLimit: Story = {
  args: { maxSelected: 2, selectionLimitText: 'Máximo dos etiquetas' },
};
