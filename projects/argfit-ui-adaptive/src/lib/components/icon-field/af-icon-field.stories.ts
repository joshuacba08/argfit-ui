import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';
import { moduleMetadata } from '@storybook/angular-vite';
import { AfIconFieldControlDirective, AfIconFieldPrefixDirective, AfIconFieldSuffixDirective } from './af-icon-field-slots.directive';

import { AfIconFieldComponent } from './af-icon-field.component';

const meta: Meta<AfIconFieldComponent> = {
  title: 'Components/Forms/IconField',
  component: AfIconFieldComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfIconFieldControlDirective, AfIconFieldPrefixDirective, AfIconFieldSuffixDirective] })],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfIconField',
      useWhen: ['Para controles que necesitan iconografía contextual dentro de su borde.'],
      avoidWhen: ['Para texto auxiliar fuera del control; usa helperText en AfField.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfInput","AfInputGroup"],
    },
    docs: { description: { component: 'Campo compuesto con slots explícitos para prefijo, control y sufijo.' } },
  },
  argTypes: {
    state: { control: 'select', options: ['default', 'error', 'success'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-icon-field [label]="label" [helperText]="helperText" [errorText]="errorText" [inputId]="inputId"><span afIconFieldPrefix aria-hidden="true">⌕</span><input afIconFieldControl id="player-search" placeholder="Ej. Lucía García" /><span afIconFieldSuffix aria-hidden="true">⌘K</span></af-icon-field>`,
  }),
};

export default meta;
type Story = StoryObj<AfIconFieldComponent>;

export const Default: Story = {
  args: {
    label: 'Buscar jugador',
    helperText: 'Busca por nombre o dorsal.',
    inputId: 'player-search',
  },
};

export const WithError: Story = {
  args: { errorText: 'No se pudo completar la búsqueda.', state: 'error' },
};
