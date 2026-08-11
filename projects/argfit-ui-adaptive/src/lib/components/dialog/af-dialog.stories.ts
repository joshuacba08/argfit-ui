import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { AfButtonComponent } from '../button/af-button.component';
import { AfDialogFooterDirective } from './af-dialog-slots.directive';
import { AfDialogComponent } from './af-dialog.component';

const meta: Meta<AfDialogComponent> = {
  title: 'Components/Overlays/Dialog',
  component: AfDialogComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfButtonComponent, AfDialogFooterDirective] })],
  parameters: {
    argfit: {
      category: 'Overlays',
      importName: 'AfDialog',
      useWhen: ['focused confirmation or editing flow', 'accessible modal content'],
      avoidWhen: ['persistent page content', 'non-blocking contextual feedback'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-elevated', '--af-shadow-lg', '--af-radius-xl'],
      related: ['AfButton', 'AfInlineMessage'],
    },
    docs: {
      description: { component: 'Accessible modal dialog with desktop and mobile presentations.' },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'fullscreen'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'danger'] },
    mobilePresentation: { control: 'select', options: ['sheet', 'fullscreen'] },
  },
  render: (args) => ({
    props: args,
    template: `<af-dialog [open]="open" [title]="title" [description]="description" [size]="size" [tone]="tone" [mobilePresentation]="mobilePresentation" [dismissible]="dismissible">
      <p>La sesión contiene cambios sin publicar.</p>
      <div afDialogFooter class="af-story-row"><af-button variant="secondary">Cancelar</af-button><af-button>Publicar</af-button></div>
    </af-dialog>`,
  }),
};

export default meta;
type Story = StoryObj<AfDialogComponent>;
export const Default: Story = {
  args: {
    open: true,
    title: 'Publicar entrenamiento',
    description: 'Confirma los datos antes de continuar.',
    size: 'md',
    tone: 'neutral',
    mobilePresentation: 'sheet',
    dismissible: true,
  },
};
export const Danger: Story = {
  args: {
    ...Default.args,
    title: 'Eliminar sesión',
    description: 'Esta acción no se puede deshacer.',
    tone: 'danger',
    size: 'sm',
  },
};
