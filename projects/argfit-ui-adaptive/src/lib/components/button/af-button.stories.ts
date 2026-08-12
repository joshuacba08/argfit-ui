import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AfButtonComponent } from './af-button.component';

const meta: Meta<AfButtonComponent> = {
  title: 'Components/Actions/Button',
  component: AfButtonComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Actions',
      importName: 'AfButton',
      useWhen: ['triggering a user action', 'submitting or cancelling a flow'],
      avoidWhen: ['navigation that should remain a link', 'non-interactive labels'],
      platforms: ['desktop', 'mobile'],
      tokens: [
        '--af-primary',
        '--af-primary-hover',
        '--af-primary-contrast',
        '--af-color-neutral-50',
        '--af-color-neutral-900',
        '--af-button-height-md',
      ],
      related: ['AfProgress', 'AfDialog'],
    },
    docs: {
      description: {
        component: 'Primary action control with adaptive desktop and mobile renderers.',
      },
    },
  },
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
    icon: 'arrow-right',
    iconPosition: 'end',
    pressed: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector<HTMLElement>('button, ion-button');
    await expect(button).not.toBeNull();
    const nativeButton =
      button!.shadowRoot?.querySelector<HTMLElement>('[part="native"]') ?? button!;
    await expect(getComputedStyle(nativeButton).color).toBe('rgb(10, 22, 40)');
    const icon = button!.querySelector<HTMLElement>('af-icon');
    await expect(icon).not.toBeNull();
    await expect(getComputedStyle(icon!).color).toBe('rgb(10, 22, 40)');
    const iconSvg = icon!.querySelector<SVGElement>('svg');
    await expect(iconSvg).not.toBeNull();
    await expect(getComputedStyle(iconSvg!).color).toBe('rgb(10, 22, 40)');
    await userEvent.click(button!);
    await expect(args.pressed).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLElement>('button, ion-button');
    await expect(button).not.toBeNull();
    const nativeButton =
      button!.shadowRoot?.querySelector<HTMLElement>('[part="native"]') ?? button!;
    await expect(getComputedStyle(nativeButton).color).toBe('rgb(240, 244, 248)');
    const icon = button!.querySelector<HTMLElement>('af-icon');
    await expect(icon).not.toBeNull();
    await expect(getComputedStyle(icon!).color).toBe('rgb(240, 244, 248)');
    const iconSvg = icon!.querySelector<SVGElement>('svg');
    await expect(iconSvg).not.toBeNull();
    await expect(getComputedStyle(iconSvg!).color).toBe('rgb(240, 244, 248)');
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
