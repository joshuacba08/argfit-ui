import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AfChatMessageComponent } from './af-chat-message.component';

const meta: Meta<AfChatMessageComponent> = {
  title: 'Components/Communication/Chat Message', component: AfChatMessageComponent, tags: ['autodocs'],
  parameters: { argfit: { category: 'Communication', importName: 'AfChatMessage',
    useWhen: ['Presentar un mensaje de una conversación'], avoidWhen: ['Mostrar avisos globales'],
    platforms: ['desktop', 'mobile'], tokens: ['--af-bg-surface', '--af-border-soft', '--af-text-main'],
    related: ['AfCard', 'AfInlineMessage'] },
    docs: { description: { component: 'Presentación genérica de mensajes. El consumidor gestiona datos, permisos e historial.' } } },
  render: (args) => ({ props: args, template: `<af-chat-message [role]="role" [status]="status" [author]="author" [timeLabel]="timeLabel">La cobertura del intervalo incluye 12 sesiones.</af-chat-message>` }),
};
export default meta;
type Story = StoryObj<AfChatMessageComponent>;
export const Default: Story = { args: { role: 'assistant', status: 'complete', author: 'Asistente', timeLabel: '10:30' } };
export const User: Story = { args: { role: 'user', status: 'complete', author: 'Tú', timeLabel: '10:31' } };
export const Pending: Story = { args: { role: 'assistant', status: 'pending', author: 'Asistente' } };
export const Failed: Story = { args: { role: 'assistant', status: 'failed', author: 'Asistente' } };
