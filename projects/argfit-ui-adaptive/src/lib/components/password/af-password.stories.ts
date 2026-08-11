import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfPasswordComponent } from './af-password.component';

const meta: Meta<AfPasswordComponent> = {
  title: 'Components/Forms/Password',
  component: AfPasswordComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfPassword',
      useWhen: ['Para introducir secretos o credenciales dentro de un formulario.'],
      avoidWhen: ['Para PIN o códigos de verificación segmentados.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfInput","AfAuthShell"],
    },
    docs: {
      description: {
        component: 'Entrada de contraseña con revelado accesible y feedback de fortaleza opcional.',
      },
    },
  },
  argTypes: {
    feedback: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-password [label]="label" [placeholder]="placeholder" [hint]="hint" [autocomplete]="autocomplete" [feedback]="feedback" [value]="value" [disabled]="disabled" [required]="required" (valueChange)="valueChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfPasswordComponent>;

export const Default: Story = {
  args: {
    label: 'Contraseña',
    placeholder: 'Introduce tu contraseña',
    hint: 'Usa al menos 12 caracteres.',
    autocomplete: 'current-password',
    feedback: true,
    value: '',
    valueChange: fn(),
  },
};

export const WithError: Story = {
  args: { error: 'La contraseña no es válida.', value: 'short' },
};
