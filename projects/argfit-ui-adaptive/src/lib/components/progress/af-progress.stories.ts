import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfProgressComponent } from './af-progress.component';

const meta: Meta<AfProgressComponent> = {
  title: 'Feedback/Progress',
  component: AfProgressComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Feedback',
      importName: 'AfProgress',
      useWhen: ['determinate or indeterminate progress', 'loading bars spinners and skeletons'],
      avoidWhen: ['business workflow state', 'static percentage display without activity'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-primary', '--af-bg-interactive', '--af-duration-normal'],
      related: ['AfButton', 'AfInlineMessage'],
    },
    docs: {
      description: { component: 'Progress feedback rendered as a bar, spinner or skeleton.' },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['bar', 'spinner', 'skeleton'] },
    tone: {
      control: 'select',
      options: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<AfProgressComponent>;
export const Default: Story = {
  args: {
    variant: 'bar',
    tone: 'primary',
    size: 'md',
    value: 64,
    max: 100,
    ariaLabel: 'Preparación completada al 64 por ciento',
  },
};
export const Indeterminate: Story = {
  args: { variant: 'bar', tone: 'accent', indeterminate: true, ariaLabel: 'Preparando datos' },
};
export const Spinner: Story = {
  args: { variant: 'spinner', tone: 'primary', size: 'lg', ariaLabel: 'Cargando' },
};
