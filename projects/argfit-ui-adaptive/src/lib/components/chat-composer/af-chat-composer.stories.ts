import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AfChatComposerComponent } from './af-chat-composer.component';

const meta: Meta<AfChatComposerComponent> = {
  title: 'Components/Communication/Chat Composer', component: AfChatComposerComponent, tags: ['autodocs'],
  parameters: { argfit: { category: 'Communication', importName: 'AfChatComposer',
    useWhen: ['Redactar y enviar mensajes en una conversación'], avoidWhen: ['Editar contenido enriquecido'],
    platforms: ['desktop', 'mobile'], tokens: ['--af-input-bg', '--af-border-focus'],
    related: ['AfTextarea', 'AfButton'] },
    docs: { description: { component: 'Compositor genérico. El consumidor procesa y persiste el mensaje enviado.' } } },
  args: { submitted: fn() },
};
export default meta;
type Story = StoryObj<AfChatComposerComponent>;
export const Default: Story = { play: async ({ args, canvas }) => {
  await userEvent.type(canvas.getByRole('textbox'), '¿Cómo evolucionó el equipo?');
  await userEvent.click(canvas.getByRole('button', { name: 'Enviar' }));
  await expect(args.submitted).toHaveBeenCalledWith('¿Cómo evolucionó el equipo?');
} };
export const Disabled: Story = { args: { disabled: true } };
export const Busy: Story = { args: { busy: true } };
