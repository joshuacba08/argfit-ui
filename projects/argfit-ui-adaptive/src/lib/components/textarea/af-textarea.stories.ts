import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfTextareaComponent } from './af-textarea.component';

const meta: Meta<AfTextareaComponent> = {
  title: 'Components/Forms/Textarea',
  component: AfTextareaComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfTextarea',
      useWhen: ['multi-line text entry', 'notes descriptions and comments with validation'],
      avoidWhen: ['single-line values', 'rich text editing'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-input-bg', '--af-input-border', '--af-border-focus'],
      related: ['AfInput'],
    },
    docs: {
      description: {
        component: 'Multiline form control with validation, hints and length limits.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width: 34rem"><af-textarea
      [label]="label" [placeholder]="placeholder" [hint]="hint" [error]="error"
      [state]="state" [size]="size" [rows]="rows" [maxLength]="maxLength"
      [required]="required" [disabled]="disabled" [readonly]="readonly"
    /></div>`,
  }),
};

export default meta;
type Story = StoryObj<AfTextareaComponent>;

export const Default: Story = {
  args: {
    label: 'Notas del entrenamiento',
    placeholder: 'Añade observaciones…',
    hint: 'Visible para el cuerpo técnico.',
    rows: 4,
    state: 'default',
    size: 'md',
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: 'La nota supera el límite permitido.',
    state: 'error',
    maxLength: 120,
  },
};
export const Disabled: Story = { args: { ...Default.args, disabled: true } };
