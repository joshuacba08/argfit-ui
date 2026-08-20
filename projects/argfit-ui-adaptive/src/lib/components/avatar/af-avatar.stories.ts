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
      tokens: ['--af-primary', '--af-text-main', '--af-radius-pill', '--af-duration-fast'],
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
    loading: { control: 'select', options: ['lazy', 'eager'] },
    decoding: { control: 'select', options: ['async', 'auto', 'sync'] },
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

export const ImageWithFallback: Story = {
  args: {
    label: 'Sofía Martínez',
    initials: 'SM',
    imageSrc:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%232599d5"/%3E%3Ccircle cx="32" cy="25" r="12" fill="white"/%3E%3Cpath d="M12 62c2-16 10-24 20-24s18 8 20 24" fill="white"/%3E%3C/svg%3E',
    imageAlt: 'Sofía Martínez',
    ariaLabel: 'Sofía Martínez',
    size: 'xl',
    loading: 'lazy',
    decoding: 'async',
  },
};

export const BrokenImageFallback: Story = {
  args: {
    label: 'Sofía Martínez',
    initials: 'SM',
    imageSrc: 'data:image/webp;base64,AAAA',
    imageAlt: 'Sofía Martínez',
    ariaLabel: 'Sofía Martínez',
    size: 'xl',
  },
};
