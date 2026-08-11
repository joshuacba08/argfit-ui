import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfRadioGroupComponent } from './af-radio-group.component';

const meta: Meta<AfRadioGroupComponent> = {
  title: 'Components/Forms/RadioGroup',
  component: AfRadioGroupComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfRadioGroup',
      useWhen: ['Cuando la persona debe elegir exactamente una opción de un conjunto visible.'],
      avoidWhen: ['Para opciones independientes; usa AfCheckbox.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfCheckbox","AfSegmentedControl"],
    },
    docs: {
      description: {
        component: 'Grupo accesible de opciones mutuamente excluyentes.',
      },
    },
  },
  argTypes: {
    layout: { control: 'select', options: ['inline', 'stacked'] },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-radio-group [label]="label" [options]="options" [value]="value" [layout]="layout" [disabled]="disabled" [required]="required" (valueChange)="valueChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfRadioGroupComponent>;

export const Default: Story = {
  args: {
    label: 'Pie dominante',
    options: [{ label: 'Derecho', value: 'right' }, { label: 'Izquierdo', value: 'left' }, { label: 'Ambidiestro', value: 'both' }],
    value: 'right',
    layout: 'inline',
    valueChange: fn(),
  },
};

export const Stacked: Story = {
  args: { layout: 'stacked', hint: 'Selecciona la opción registrada en la ficha.' },
};
