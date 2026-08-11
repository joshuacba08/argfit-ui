import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfSegmentedControlComponent } from './af-segmented-control.component';

const OPTIONS = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
];

const meta: Meta<AfSegmentedControlComponent> = {
  title: 'Components/Forms/SegmentedControl',
  component: AfSegmentedControlComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfSegmentedControl',
      useWhen: ['switching between a few mutually exclusive views', 'compact option selection'],
      avoidWhen: ['large option sets', 'page navigation with URLs'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-interactive', '--af-primary', '--af-radius-md'],
      related: ['AfButton', 'AfSelect'],
    },
    docs: {
      description: { component: 'Exclusive mode switch for a small, stable set of options.' },
    },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width: 30rem"><af-segmented-control [value]="value" [options]="options" [label]="label" [hint]="hint" [error]="error" [state]="state" [size]="size" [disabled]="disabled" [ariaLabel]="ariaLabel" /></div>`,
  }),
};

export default meta;
type Story = StoryObj<AfSegmentedControlComponent>;
export const Default: Story = {
  args: {
    value: 'week',
    options: OPTIONS,
    label: 'Periodo',
    hint: 'Cambia la ventana de análisis.',
    state: 'default',
    size: 'md',
    ariaLabel: 'Periodo del análisis',
  },
};
export const Disabled: Story = { args: { ...Default.args, disabled: true } };
