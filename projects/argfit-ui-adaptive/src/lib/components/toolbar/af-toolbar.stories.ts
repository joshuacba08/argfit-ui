import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';
import { moduleMetadata } from '@storybook/angular-vite';
import { AfToolbarCenterDirective, AfToolbarEndDirective, AfToolbarStartDirective } from './af-toolbar-slots.directive';

import { AfToolbarComponent } from './af-toolbar.component';

const meta: Meta<AfToolbarComponent> = {
  title: 'Components/Surfaces/Toolbar',
  component: AfToolbarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfToolbarCenterDirective, AfToolbarEndDirective, AfToolbarStartDirective] })],
  parameters: {
    argfit: {
      category: 'Surfaces',
      importName: 'AfToolbar',
      useWhen: ['Para reunir acciones de una vista o colección en una sola región.'],
      avoidWhen: ['Para navegación principal; usa AfPageShell.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfButton","AfPageShell"],
    },
    docs: { description: { component: 'Barra de acciones con zonas start, center y end adaptativas.' } },
  },
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    ariaLabel: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-toolbar [ariaLabel]="ariaLabel" [density]="density"><strong afToolbarStart>Plantilla</strong><span afToolbarCenter>24 jugadores</span><div afToolbarEnd><button type="button">Filtrar</button><button type="button">Añadir</button></div></af-toolbar>`,
  }),
};

export default meta;
type Story = StoryObj<AfToolbarComponent>;

export const Default: Story = {
  args: {
    ariaLabel: 'Acciones de plantilla',
    density: 'comfortable',
  },
};

export const Compact: Story = {
  args: { density: 'compact' },
};
