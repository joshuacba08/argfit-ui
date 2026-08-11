import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfFieldsetComponent } from './af-fieldset.component';

const meta: Meta<AfFieldsetComponent> = {
  title: 'Components/Forms/Fieldset',
  component: AfFieldsetComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfFieldset',
      useWhen: ['Para conjuntos de campos que comparten una pregunta o propósito.'],
      avoidWhen: ['Para una sección puramente visual; usa AfPanel.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-border","--af-bg-surface"],
      related: ["AfField","AfRadioGroup"],
    },
    docs: { description: { component: 'Agrupa controles relacionados bajo una leyenda y descripción semánticas.' } },
  },
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    tone: { control: 'select', options: ['neutral', 'subtle'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-fieldset [legend]="legend" [description]="description" [density]="density" [tone]="tone" [disabled]="disabled"><p>Los controles relacionados se proyectan dentro del fieldset.</p></af-fieldset>`,
  }),
};

export default meta;
type Story = StoryObj<AfFieldsetComponent>;

export const Default: Story = {
  args: {
    legend: 'Preferencias de convocatoria',
    description: 'Configura cómo se avisará al jugador.',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
