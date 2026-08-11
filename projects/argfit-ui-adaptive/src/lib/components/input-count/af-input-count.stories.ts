import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfInputCountComponent } from './af-input-count.component';

const meta: Meta<AfInputCountComponent> = {
  title: 'Components/Forms/InputCount',
  component: AfInputCountComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfInputCount',
      useWhen: ['Para cantidades que se ajustan frecuentemente en pasos conocidos.'],
      avoidWhen: ['Para métricas continuas o rangos; usa AfSlider.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfInput","AfSlider"],
    },
    docs: {
      description: {
        component: 'Entrada numérica con acciones incrementales y límites explícitos.',
      },
    },
  },
  argTypes: {
    value: { control: 'number' },
    step: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-input-count [label]="label" [helperText]="helperText" [value]="value" [min]="min" [max]="max" [step]="step" [unit]="unit" [disabled]="disabled" (valueChange)="valueChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfInputCountComponent>;

export const Default: Story = {
  args: {
    label: 'Jugadores convocados',
    helperText: 'Entre 11 y 23 jugadores.',
    value: 18,
    min: 11,
    max: 23,
    unit: 'jugadores',
    valueChange: fn(),
  },
};

export const WithError: Story = {
  args: { errorText: 'La convocatoria no puede superar 23 jugadores.', value: 24 },
};
