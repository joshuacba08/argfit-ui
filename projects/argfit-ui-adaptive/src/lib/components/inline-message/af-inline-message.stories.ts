import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AfInlineMessageComponent } from './af-inline-message.component';

const meta: Meta<AfInlineMessageComponent> = {
  title: 'Feedback/InlineMessage',
  component: AfInlineMessageComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Feedback',
      importName: 'AfInlineMessage',
      useWhen: ['persistent contextual feedback', 'success warning information or error messages'],
      avoidWhen: ['blocking confirmation', 'brief ephemeral notifications'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-info', '--af-warning', '--af-danger'],
      related: ['AfButton', 'AfDialog'],
    },
    docs: {
      description: {
        component: 'Persistent contextual feedback for success, information, warnings and errors.',
      },
    },
  },
  argTypes: { severity: { control: 'select', options: ['success', 'info', 'warning', 'danger'] } },
};

export default meta;
type Story = StoryObj<AfInlineMessageComponent>;
export const Default: Story = {
  args: {
    severity: 'info',
    title: 'Sincronización pendiente',
    description: 'Los cambios se enviarán cuando vuelva la conexión.',
  },
};
export const Warning: Story = {
  args: {
    severity: 'warning',
    title: 'Carga elevada',
    description: 'Revisa el volumen antes de publicar la sesión.',
    closable: true,
  },
};
export const Danger: Story = {
  args: {
    severity: 'danger',
    title: 'No se pudo guardar',
    description: 'Conservamos los datos locales para que puedas reintentar.',
  },
};
