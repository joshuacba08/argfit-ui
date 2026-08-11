import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfSkeletonComponent } from './af-skeleton.component';

const meta: Meta<AfSkeletonComponent> = {
  title: 'Feedback/Skeleton',
  component: AfSkeletonComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Feedback',
      importName: 'AfSkeleton',
      useWhen: ['Para preservar el layout mientras llega contenido conocido.'],
      avoidWhen: ['Para comunicar progreso cuantificable; usa AfProgress.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-surface-2","--af-radius-md"],
      related: ["AfProgress","AfCard"],
    },
    docs: { description: { component: 'Placeholder no interactivo para anticipar la estructura durante una carga.' } },
  },
  argTypes: {
    shape: { control: 'select', options: ['text', 'rectangle', 'circle'] },
    animation: { control: 'select', options: ['pulse', 'wave', 'none'] },
    lines: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `<af-skeleton [shape]="shape" [lines]="lines" [animation]="animation" [width]="width" [height]="height" [ariaLabel]="ariaLabel" />`,
  }),
};

export default meta;
type Story = StoryObj<AfSkeletonComponent>;

export const Default: Story = {
  args: {
    shape: 'text',
    lines: 4,
    animation: 'pulse',
    width: '100%',
  },
};

export const Avatar: Story = {
  args: { shape: 'circle', lines: 1, width: '3rem', height: '3rem' },
};
