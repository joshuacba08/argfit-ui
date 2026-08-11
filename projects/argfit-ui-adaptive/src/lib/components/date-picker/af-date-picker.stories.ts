import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfDatePickerComponent } from './af-date-picker.component';

const meta: Meta<AfDatePickerComponent> = {
  title: 'Components/Forms/DatePicker',
  component: AfDatePickerComponent,
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfDatePicker',
      useWhen: ['selecting a civil date', 'date input with min and max constraints'],
      avoidWhen: ['date-time or timezone selection', 'date ranges'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-elevated', '--af-primary', '--af-border'],
      related: ['AfInput', 'AfSelect'],
    },
    docs: {
      description: { component: 'Civil-date input with consistent desktop and mobile behavior.' },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
  },
};

export default meta;
type Story = StoryObj<AfDatePickerComponent>;
export const Default: Story = {
  args: {
    label: 'Fecha de la sesión',
    value: '2026-08-11',
    helperText: 'Usamos la zona horaria del equipo.',
    size: 'md',
    density: 'comfortable',
  },
};
export const Error: Story = {
  args: { ...Default.args, value: '', errorText: 'Selecciona una fecha válida.', required: true },
};
export const Disabled: Story = { args: { ...Default.args, disabled: true } };
