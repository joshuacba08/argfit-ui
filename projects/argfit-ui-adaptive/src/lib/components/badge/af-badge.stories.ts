import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfBadgeComponent } from './af-badge.component';

const meta: Meta<AfBadgeComponent> = {
  title: 'Components/Identity/Badge',
  component: AfBadgeComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Identity',
      importName: 'AfBadge',
      useWhen: ['compact status or category labels', 'semantic state that includes text'],
      avoidWhen: ['interactive filtering', 'long feedback messages'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-success', '--af-warning', '--af-danger', '--af-radius-pill'],
      related: ['AfChip', 'AfInlineMessage'],
    },
    docs: {
      description: {
        component: 'Compact status label whose meaning is never carried by color alone.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    },
    variant: { control: 'select', options: ['soft', 'solid', 'outline', 'tag'] },
    size: { control: 'select', options: ['sm', 'md'] },
    shape: { control: 'select', options: ['pill', 'rounded'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-badge [tone]="tone" [variant]="variant" [size]="size" [shape]="shape" [dot]="dot" [icon]="icon" [ariaLabel]="ariaLabel">Disponible</af-badge>`,
  }),
};

export default meta;
type Story = StoryObj<AfBadgeComponent>;
export const Default: Story = {
  args: { tone: 'success', variant: 'soft', size: 'sm', shape: 'pill', dot: true },
};
export const StatusMatrix: Story = {
  render: () => ({
    template: `<div class="af-story-row"><af-badge tone="success">Disponible</af-badge><af-badge tone="warning">Carga alta</af-badge><af-badge tone="danger">Lesionado</af-badge><af-badge tone="neutral">Sin datos</af-badge></div>`,
  }),
};
