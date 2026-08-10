import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AfButtonComponent } from './af-button.component';

const meta: Meta<AfButtonComponent> = {
  title: 'Adaptive/Button',
  component: AfButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    icon: { control: 'text' },
    iconPosition: {
      control: 'select',
      options: ['start', 'end', 'top', 'bottom'],
    },
    ariaLabel: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-button
      [variant]="variant"
      [size]="size"
      [type]="type"
      [disabled]="disabled"
      [loading]="loading"
      [fullWidth]="fullWidth"
      [icon]="icon"
      [iconPosition]="iconPosition"
      [ariaLabel]="ariaLabel"
      (pressed)="pressed($event)"
    >Click Me</af-button>`,
  }),
};

export default meta;
type Story = StoryObj<AfButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    icon: null,
    iconPosition: 'start',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    ...Primary.args,
    loading: true,
  },
};
