import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AfFileUploadComponent } from './af-file-upload.component';

const meta: Meta<AfFileUploadComponent> = {
  title: 'Experimental/FileUpload',
  component: AfFileUploadComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Upload',
      importName: 'AfFileUpload',
      useWhen: ['selecting or dropping files', 'showing upload validation and progress'],
      avoidWhen: ['media cropping without file selection', 'background synchronization'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-border', '--af-primary', '--af-bg-surface'],
      related: ['AfProgress', 'AfInlineMessage'],
    },
    docs: {
      description: { component: 'Adaptive file selection and drop zone with validation.' },
    },
  },
  argTypes: {
    label: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxSizeBytes: { control: 'number' },
    maxFiles: { control: 'number' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    disabled: { control: 'boolean' },
    buttonLabel: { control: 'text' },
    dropLabel: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 600px; margin: 0 auto;">
      <af-file-upload
        [label]="label"
        [accept]="accept"
        [multiple]="multiple"
        [maxSizeBytes]="maxSizeBytes"
        [maxFiles]="maxFiles"
        [helperText]="helperText"
        [errorText]="errorText"
        [disabled]="disabled"
        [buttonLabel]="buttonLabel"
        [dropLabel]="dropLabel"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfFileUploadComponent>;

export const Default: Story = {
  args: {
    label: 'Documentos adjuntos',
    accept: 'image/*,.pdf',
    multiple: true,
    maxSizeBytes: 5242880,
    maxFiles: 5,
    helperText: 'Archivos PDF o imágenes hasta 5 MB',
    disabled: false,
    buttonLabel: 'Elegir archivos',
    dropLabel: 'o arrastra los archivos aquí',
  },
};
