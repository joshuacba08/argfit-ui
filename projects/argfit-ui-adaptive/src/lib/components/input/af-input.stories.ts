import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AfInputComponent } from './af-input.component';

const meta: Meta<AfInputComponent> = {
  title: 'Components/Forms/Input',
  component: AfInputComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfInput',
      useWhen: ['single-line text entry', 'labelled form values with validation'],
      avoidWhen: ['multi-line content', 'selection from a fixed option list'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-input-bg', '--af-input-border', '--af-border-focus'],
      related: ['AfSelect', 'AfTextarea', 'AfDatePicker'],
    },
    docs: {
      description: {
        component: 'Accessible text input supporting labels, hints, errors and affixes.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    value: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    ariaLabel: { control: 'text' },
    autocomplete: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    tone: {
      control: 'select',
      options: ['neutral', 'critical', 'success'],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-input
      [label]="label"
      [placeholder]="placeholder"
      [hint]="hint"
      [error]="error"
      [type]="type"
      [size]="size"
      [tone]="tone"
      [required]="required"
      [disabled]="disabled"
      [readonly]="readonly"
      [prefix]="prefix"
      [suffix]="suffix"
      [prefixIcon]="prefixIcon"
      (valueChange)="valueChange($event)"
    ></af-input>`,
  }),
};

export default meta;
type Story = StoryObj<AfInputComponent>;

export const Primary: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    size: 'md',
    tone: 'neutral',
    disabled: false,
    readonly: false,
    required: false,
  },
};

export const WithHint: Story = {
  args: {
    ...Primary.args,
    hint: 'This will be displayed on your profile.',
  },
};

export const WithError: Story = {
  args: {
    ...Primary.args,
    tone: 'critical',
    error: 'Username is already taken.',
  },
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    ...Primary.args,
    label: 'Amount',
    prefix: '$',
    suffix: '.00',
    type: 'number',
  },
};
