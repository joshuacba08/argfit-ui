import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfCheckboxComponent } from './af-checkbox.component';

const meta: Meta<AfCheckboxComponent> = {
  title: 'Components/Forms/Checkbox',
  component: AfCheckboxComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfCheckbox',
      useWhen: ['Cuando una opción puede activarse o desactivarse de forma independiente.'],
      avoidWhen: ['Cuando las opciones sean mutuamente excluyentes; usa AfRadioGroup.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfRadioGroup","AfToggle"],
    },
    docs: {
      description: {
        component: 'Control booleano accesible para aceptar, activar o seleccionar una opción independiente.',
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-checkbox [label]="label" [hint]="hint" [checked]="checked" [disabled]="disabled" [required]="required" [size]="size" (checkedChange)="checkedChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfCheckboxComponent>;

export const Default: Story = {
  args: {
    label: 'Acepto los términos del equipo',
    hint: 'Puedes cambiar esta preferencia más tarde.',
    checked: false,
    checkedChange: fn(),
  },
};

export const Disabled: Story = {
  args: { disabled: true, checked: true },
};
