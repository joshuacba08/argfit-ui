import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';
import { moduleMetadata } from '@storybook/angular-vite';
import { AfInputGroupControlDirective, AfInputGroupPrefixDirective, AfInputGroupSuffixDirective } from './af-input-group-slots.directive';

import { AfInputGroupComponent } from './af-input-group.component';

const meta: Meta<AfInputGroupComponent> = {
  title: 'Components/Forms/InputGroup',
  component: AfInputGroupComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfInputGroupControlDirective, AfInputGroupPrefixDirective, AfInputGroupSuffixDirective] })],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfInputGroup',
      useWhen: ['Para unidades, dominios o acciones inseparables del valor introducido.'],
      avoidWhen: ['Para adornos iconográficos simples; usa AfIconField.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-input-border","--af-border-focus"],
      related: ["AfInput","AfIconField"],
    },
    docs: { description: { component: 'Campo compuesto con prefijo y sufijo textuales o interactivos.' } },
  },
  argTypes: {
    state: { control: 'select', options: ['default', 'error', 'success'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-input-group [label]="label" [helperText]="helperText" [errorText]="errorText" [inputId]="inputId"><span afInputGroupPrefix>€</span><input afInputGroupControl id="budget" type="number" value="25000" /><span afInputGroupSuffix>EUR</span></af-input-group>`,
  }),
};

export default meta;
type Story = StoryObj<AfInputGroupComponent>;

export const Default: Story = {
  args: {
    label: 'Presupuesto mensual',
    helperText: 'Importe antes de impuestos.',
    inputId: 'budget',
  },
};

export const WithError: Story = {
  args: { errorText: 'Introduce un importe válido.', state: 'error' },
};
