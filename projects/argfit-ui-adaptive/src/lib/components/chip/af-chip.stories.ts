import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfChipComponent } from './af-chip.component';

const meta: Meta<AfChipComponent> = {
  title: 'Components/Identity/Chip',
  component: AfChipComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Identity',
      importName: 'AfChip',
      useWhen: ['interactive filters or selections', 'removable compact values'],
      avoidWhen: ['passive status text', 'primary actions'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-interactive', '--af-border', '--af-radius-pill'],
      related: ['AfBadge', 'AfAvatar'],
    },
    docs: {
      description: { component: 'Compact label for filters, selections and removable values.' },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    },
    variant: { control: 'select', options: ['soft', 'solid', 'outline'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-chip [tone]="tone" [variant]="variant" [size]="size" [removable]="removable" [interactive]="interactive" [selected]="selected" [ariaLabel]="ariaLabel">Porteros</af-chip>`,
  }),
};

export default meta;
type Story = StoryObj<AfChipComponent>;
export const Default: Story = { args: { tone: 'primary', variant: 'soft', size: 'sm' } };
export const Removable: Story = {
  args: { ...Default.args, removable: true, removeAriaLabel: 'Quitar filtro Porteros' },
};
export const Selected: Story = {
  args: { ...Default.args, interactive: true, selected: true, ariaLabel: 'Filtrar por porteros' },
};
