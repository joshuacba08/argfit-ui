import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn } from 'storybook/test';

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
      tokens: ['--af-bg-elevated', '--af-border', '--af-primary'],
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
    template: `<div style="width: min(100%, 34rem)"><af-multi-select [label]="label" [placeholder]="placeholder" [options]="options" [optionLabel]="optionLabel" [optionValue]="optionValue" [value]="value" [searchable]="searchable" [clearable]="clearable" [maxSelected]="maxSelected" [disabled]="disabled" (valueChange)="valueChange($event)" /></div>`,
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

export const FormField: Story = {
  args: {
    label: 'Secciones del informe',
    placeholder: 'Seleccionar secciones',
    options: [{ id: 'wellness', label: 'Wellness · Resumen' }, { id: 'training', label: 'Entrenamientos · Resumen' }],
    optionLabel: 'label',
    optionValue: 'id',
    value: [],
    searchable: true,
    valueChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const renderer = canvasElement.querySelector('af-multi-select-desktop, af-multi-select-mobile');
    const trigger = renderer?.querySelector('.af-popover-desktop__trigger, .af-multi-select-mobile__trigger');
    const icon = renderer?.querySelector('.af-multi-select-desktop__caret svg, .af-multi-select-mobile__caret svg');
    await expect(renderer).not.toBeNull();
    await expect(trigger).not.toBeNull();
    await expect(icon).not.toBeNull();
    await expect(Math.abs((trigger?.getBoundingClientRect().width ?? 0) - (renderer?.getBoundingClientRect().width ?? 0))).toBeLessThan(2);
  },
};
