import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AfCardComponent } from './af-card.component';

const meta: Meta<AfCardComponent> = {
  title: 'Adaptive/Card',
  component: AfCardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['surface', 'elevated', 'outlined'],
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
    tone: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'critical'],
    },
    interactive: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-card
      [variant]="variant"
      [density]="density"
      [tone]="tone"
      [interactive]="interactive"
      [selected]="selected"
      (pressed)="pressed($event)"
    >
      <h3>Card Title</h3>
      <p>This is the content of the card projected via ng-content.</p>
    </af-card>`,
  }),
};

export default meta;
type Story = StoryObj<AfCardComponent>;

export const Default: Story = {
  args: {
    variant: 'surface',
    density: 'comfortable',
    tone: 'neutral',
    interactive: false,
    selected: false,
  },
};

export const Elevated: Story = {
  args: {
    ...Default.args,
    variant: 'elevated',
  },
};

export const Outlined: Story = {
  args: {
    ...Default.args,
    variant: 'outlined',
  },
};

export const Interactive: Story = {
  args: {
    ...Default.args,
    interactive: true,
  },
};
