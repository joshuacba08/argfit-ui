import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfAvatarComponent } from './af-avatar.component';

const meta: Meta<AfAvatarComponent> = {
  title: 'Components/Identity/Avatar',
  component: AfAvatarComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Identity',
      importName: 'AfAvatar',
      useWhen: ['representing a person or team', 'compact identity in lists and headers'],
      avoidWhen: ['decorative imagery', 'large editorial photography'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-primary', '--af-text-main', '--af-radius-pill'],
      related: ['AfBadge', 'AfChip'],
    },
    docs: {
      description: {
        component: 'Person or entity identity with image, initials and icon fallbacks.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    tone: {
      control: 'select',
      options: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    },
    shape: { control: 'select', options: ['circle', 'rounded', 'square'] },
  },
};

export default meta;
type Story = StoryObj<AfAvatarComponent>;
export const Default: Story = {
  args: {
    label: 'Sofía Martínez',
    initials: 'SM',
    ariaLabel: 'Sofía Martínez',
    size: 'lg',
    tone: 'primary',
    shape: 'circle',
  },
};
export const Sizes: Story = {
  render: () => ({
    template: `<div class="af-story-row"><af-avatar initials="SM" size="sm"/><af-avatar initials="SM" size="md"/><af-avatar initials="SM" size="lg"/><af-avatar initials="SM" size="xl"/></div>`,
  }),
};
