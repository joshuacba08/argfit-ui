import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AfImageCropperComponent } from './af-image-cropper.component';

const sampleImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%2317618D"/><circle cx="300" cy="200" r="120" fill="%2300D4FF"/><polygon points="300,100 380,260 220,260" fill="%23FFB300"/></svg>';

const meta: Meta<AfImageCropperComponent> = {
  title: 'Experimental/ImageCropper',
  component: AfImageCropperComponent,
  parameters: {
    argfit: {
      category: 'Media',
      importName: 'AfImageCropper',
      useWhen: ['cropping and resizing a selected image', 'avatar and header image preparation'],
      avoidWhen: ['general image editing', 'file selection without cropping'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-main', '--af-primary', '--af-border'],
      related: ['AfFileUpload', 'AfButton'],
    },
    docs: {
      description: { component: 'Adaptive image cropper with resize, rotation and output controls.' },
    },
  },
  argTypes: {
    aspectRatio: {
      control: 'select',
      options: ['free', '1:1', '4:3', '16:9', '3:2', 'circle'],
    },
    format: {
      control: 'select',
      options: ['image/png', 'image/jpeg', 'image/webp'],
    },
    quality: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
    },
    circularCrop: { control: 'boolean' },
    maintainAspectRatio: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showControls: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 640px; margin: 0 auto;">
      <af-image-cropper
        [src]="src"
        [aspectRatio]="aspectRatio"
        [maintainAspectRatio]="maintainAspectRatio"
        [resizeWidth]="resizeWidth"
        [resizeHeight]="resizeHeight"
        [format]="format"
        [quality]="quality"
        [circularCrop]="circularCrop"
        [disabled]="disabled"
        [showControls]="showControls"
        [fileName]="fileName"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfImageCropperComponent>;

export const Default: Story = {
  args: {
    src: sampleImage,
    aspectRatio: 'free',
    maintainAspectRatio: false,
    format: 'image/png',
    quality: 0.92,
    circularCrop: false,
    disabled: false,
    showControls: true,
    fileName: 'sample-cropped',
  },
};

export const SquareAvatar: Story = {
  args: {
    ...Default.args,
    aspectRatio: '1:1',
    circularCrop: true,
    resizeWidth: 200,
    resizeHeight: 200,
  },
};

export const LandscapeHeader: Story = {
  args: {
    ...Default.args,
    aspectRatio: '16:9',
    resizeWidth: 800,
    resizeHeight: 450,
  },
};
