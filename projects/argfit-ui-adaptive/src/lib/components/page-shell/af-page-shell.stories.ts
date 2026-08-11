import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfPageShellComponent } from './af-page-shell.component';

const meta: Meta<AfPageShellComponent> = {
  title: 'Patterns/Layout/PageShell',
  component: AfPageShellComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Patterns',
      importName: 'AfPageShell',
      useWhen: ['Para estructurar una pantalla principal consistente de una aplicación.'],
      avoidWhen: ['Para una tarjeta o sección local; usa AfCard o AfPanel.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-bg-surface","--af-border"],
      related: ["AfToolbar","AfTabs"],
    },
    docs: { description: { component: 'Shell adaptativo para navegación, cabecera, contenido y tabs móviles.' } },
  },
  argTypes: {
    variant: { control: 'select', options: ['app', 'dashboard', 'contained'] },
    collapsed: { control: 'boolean' },
    showSearch: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-page-shell [title]="title" [subtitle]="subtitle" [navItems]="navItems" [mobileTabs]="mobileTabs" [activeItem]="activeItem" [activeTab]="activeTab" [showSearch]="showSearch" [variant]="variant" (navItemSelected)="navItemSelected($event)"><strong afPageShellBrand>ArgFit</strong><section><h2>Jugadores</h2><p>Contenido principal de la pantalla.</p></section></af-page-shell>`,
  }),
};

export default meta;
type Story = StoryObj<AfPageShellComponent>;

export const Default: Story = {
  args: {
    title: 'Plantilla profesional',
    subtitle: '24 jugadores activos',
    navItems: [{ id: 'overview', label: 'Resumen', icon: 'home' }, { id: 'players', label: 'Jugadores', icon: 'users' }, { id: 'sessions', label: 'Sesiones', icon: 'calendar' }],
    mobileTabs: [{ id: 'overview', label: 'Resumen', icon: 'home' }, { id: 'players', label: 'Jugadores', icon: 'users' }],
    activeItem: 'players',
    activeTab: 'players',
    showSearch: true,
    navItemSelected: fn(),
  },
};

export const Collapsed: Story = {
  args: { collapsed: true },
};
