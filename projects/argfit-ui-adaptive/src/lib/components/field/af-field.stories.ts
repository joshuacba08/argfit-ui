import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfFieldComponent } from './af-field.component';

const meta: Meta<AfFieldComponent> = {
  title: 'Components/Forms/Field',
  component: AfFieldComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfField',
      useWhen: ['Para envolver un control propio con el contrato visual de formularios.'],
      avoidWhen: ['Cuando un componente ArgFit ya incluye label y validación.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-text-muted"],
      related: ["AfInput","AfFieldset"],
    },
    docs: { description: { component: 'Estructura accesible de etiqueta, ayuda, error y control proyectado.' } },
  },
  argTypes: {
    state: { control: 'select', options: ['default', 'error', 'success'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    required: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-field [label]="label" [helperText]="helperText" [errorText]="errorText" [inputId]="inputId" [required]="required"><input id="field-code" [attr.aria-describedby]="errorText ? 'field-code-error' : null" /></af-field>`,
  }),
};

export default meta;
type Story = StoryObj<AfFieldComponent>;

export const Default: Story = {
  args: {
    label: 'Código interno',
    helperText: 'Visible sólo para administradores.',
    inputId: 'field-code',
    required: true,
  },
};

export const WithError: Story = {
  args: { errorText: 'El código ya está en uso.', state: 'error' },
};
