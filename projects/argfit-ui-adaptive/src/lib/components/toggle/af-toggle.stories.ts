import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfToggleComponent } from './af-toggle.component';

const meta: Meta<AfToggleComponent> = {
  title: 'Components/Forms/Toggle',
  component: AfToggleComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfToggle',
      useWhen: ['Cuando activar una preferencia produce un cambio inmediato y reversible.'],
      avoidWhen: ['Para aceptar términos antes de enviar un formulario; usa AfCheckbox.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfCheckbox","AfSegmentedControl"],
    },
    docs: {
      description: {
        component: 'Interruptor booleano para cambios que tienen efecto inmediato.',
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
    template: `<af-toggle [label]="label" [description]="description" [checked]="checked" [disabled]="disabled" [size]="size" (checkedChange)="checkedChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfToggleComponent>;

export const Default: Story = {
  args: {
    label: 'Notificaciones del partido',
    description: 'Recibe incidencias y cambios de marcador.',
    checked: true,
    checkedChange: fn(),
  },
};

export const Disabled: Story = {
  args: { disabled: true, checked: false, hint: 'Gestionado por la organización.' },
};
