import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfTimePickerComponent } from './af-time-picker.component';

const meta: Meta<AfTimePickerComponent> = {
  title: 'Components/Forms/TimePicker',
  component: AfTimePickerComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfTimePicker',
      useWhen: ['Para horarios civiles sin lógica de zona horaria dentro del componente.'],
      avoidWhen: ['Para fechas completas; usa AfDatePicker.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfDatePicker","AfInput"],
    },
    docs: {
      description: {
        component: 'Selector adaptativo de hora que mantiene un valor público HH:mm.',
      },
    },
  },
  argTypes: {
    minuteStep: { control: 'select', options: [1, 5, 10, 15, 30] },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-time-picker [label]="label" [helperText]="helperText" [value]="value" [min]="min" [max]="max" [minuteStep]="minuteStep" [disabled]="disabled" [required]="required" (valueChange)="valueChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfTimePickerComponent>;

export const Default: Story = {
  args: {
    label: 'Hora de inicio',
    helperText: 'Horario local del equipo.',
    value: '18:30',
    min: '08:00',
    max: '22:00',
    minuteStep: 5,
    valueChange: fn(),
  },
};

export const WithError: Story = {
  args: { errorText: 'Selecciona una hora dentro del horario permitido.', value: '' },
};
