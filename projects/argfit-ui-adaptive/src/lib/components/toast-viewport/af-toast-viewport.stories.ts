import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';
import { moduleMetadata } from '@storybook/angular-vite';
import { AfToastComponent } from '../toast/af-toast.component';

import { AfToastViewportComponent } from './af-toast-viewport.component';

const meta: Meta<AfToastViewportComponent> = {
  title: 'Feedback/ToastViewport',
  component: AfToastViewportComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfToastComponent] })],
  parameters: {
    argfit: {
      category: 'Feedback',
      importName: 'AfToastViewport',
      useWhen: ['Una sola vez en el shell de la aplicación para alojar notificaciones globales.'],
      avoidWhen: ['Dentro de cada página o para mensajes inline.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfToast","AfInlineMessage"],
    },
    docs: { description: { component: 'Viewport raíz que presenta la cola gestionada por AfToastService.' } },
  },
  argTypes: {
    placement: { control: 'select', options: ['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end'] },
    ariaLabel: { control: 'text' },
    closeLabel: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<af-toast id="viewport-preview" title="Vista previa del viewport" description="En una aplicación, AfToastService administra esta cola." severity="info" [persistent]="true" /><af-toast-viewport [placement]="placement" [ariaLabel]="ariaLabel" [closeLabel]="closeLabel" (actionInvoked)="actionInvoked($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfToastViewportComponent>;

export const Default: Story = {
  args: {
    placement: 'top-end',
    ariaLabel: 'Notificaciones de ejemplo',
    actionInvoked: fn(),
  },
};

export const BottomCenter: Story = {
  args: { placement: 'bottom-center' },
};
