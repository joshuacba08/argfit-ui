import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfSliderComponent } from './af-slider.component';

const meta: Meta<AfSliderComponent> = {
  title: 'Components/Forms/Slider',
  component: AfSliderComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfSlider',
      useWhen: ['Para ajustar rápidamente una intensidad, porcentaje o rango comprensible.'],
      avoidWhen: ['Para cantidades precisas escritas manualmente; usa AfInputCount.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfInputCount","AfProgress"],
    },
    docs: {
      description: {
        component: 'Control continuo o escalonado para ajustar un valor dentro de un rango.',
      },
    },
  },
  argTypes: {
    value: { control: 'number' },
    tone: { control: 'select', options: ['primary', 'success', 'warning', 'danger'] },
    valueDisplay: { control: 'select', options: ['none', 'inline', 'tooltip'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-slider [label]="label" [helperText]="helperText" [value]="value" [min]="min" [max]="max" [step]="step" [unit]="unit" [ticks]="ticks" [tone]="tone" [disabled]="disabled" (valueChange)="valueChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfSliderComponent>;

export const Default: Story = {
  args: {
    label: 'Intensidad de entrenamiento',
    helperText: 'Carga objetivo para la sesión.',
    value: 65,
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    ticks: true,
    valueChange: fn(),
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 40 },
};
