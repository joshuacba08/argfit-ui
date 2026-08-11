import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfToastComponent } from './af-toast.component';

const meta: Meta<AfToastComponent> = {
  title: 'Feedback/Toast',
  component: AfToastComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Feedback',
      importName: 'AfToast',
      useWhen: ['Para confirmar resultados breves que no bloquean el flujo actual.'],
      avoidWhen: ['Para errores persistentes dentro de una sección; usa AfInlineMessage.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfToastViewport","AfInlineMessage"],
    },
    docs: { description: { component: 'Notificación individual con severidad, duración y cierre accesible.' } },
  },
  argTypes: {
    severity: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
    persistent: { control: 'boolean' },
    duration: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `<af-toast [id]="id" [title]="title" [description]="description" [severity]="severity" [duration]="duration" [persistent]="persistent" (dismissed)="dismissed($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfToastComponent>;

export const Default: Story = {
  args: {
    id: 'saved-player',
    title: 'Jugador actualizado',
    description: 'Los cambios se guardaron correctamente.',
    severity: 'success',
    persistent: true,
    dismissed: fn(),
  },
};

export const Danger: Story = {
  args: { title: 'No se pudo guardar', description: 'Revisa la conexión e inténtalo de nuevo.', severity: 'danger' },
};
