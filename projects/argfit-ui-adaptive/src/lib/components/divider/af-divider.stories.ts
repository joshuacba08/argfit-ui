import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfDividerComponent } from './af-divider.component';

const meta: Meta<AfDividerComponent> = {
  title: 'Components/Surfaces/Divider',
  component: AfDividerComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Surfaces',
      importName: 'AfDivider',
      useWhen: ['Para separar grupos relacionados dentro de una misma superficie.'],
      avoidWhen: ['Para crear espacio visual sin significado; usa tokens de spacing.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-border","--af-text-muted"],
      related: ["AfPanel","AfCard"],
    },
    docs: { description: { component: 'Separador semántico horizontal o vertical con etiqueta opcional.' } },
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    tone: { control: 'select', options: ['subtle', 'strong'] },
    label: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-divider [label]="label" [orientation]="orientation" [tone]="tone" />`,
  }),
};

export default meta;
type Story = StoryObj<AfDividerComponent>;

export const Default: Story = {
  args: {
    label: 'Datos deportivos',
    orientation: 'horizontal',
    tone: 'subtle',
  },
};

export const Strong: Story = {
  args: { tone: 'strong', label: 'Segunda parte' },
};
