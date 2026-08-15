import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import type { AfCommandPaletteItem } from '@argfit-ui/core';

import { AfCommandPaletteItemDirective } from './af-command-palette-item.directive';
import { AfCommandPaletteComponent } from './af-command-palette.component';

const commands: readonly AfCommandPaletteItem[] = [
  {
    id: 'dashboard',
    label: 'Ir al resumen',
    description: 'Vista principal del equipo',
    group: 'Navegación',
    kind: 'navigation',
    icon: 'home',
    href: '/dashboard',
    keywords: ['inicio'],
  },
  {
    id: 'players',
    label: 'Buscar jugadores',
    description: 'Consulta la plantilla y sus perfiles',
    group: 'Navegación',
    kind: 'result',
    icon: 'users',
    href: '/players',
  },
  {
    id: 'session',
    label: 'Crear sesión',
    description: 'Programa una nueva sesión de entrenamiento',
    group: 'Acciones',
    kind: 'action',
    icon: 'plus',
    shortcut: 'C',
  },
  {
    id: 'settings',
    label: 'Configuración',
    description: 'Preferencias del equipo y la aplicación',
    group: 'Acciones',
    kind: 'action',
    icon: 'settings',
  },
  {
    id: 'billing',
    label: 'Facturación',
    description: 'Requiere permisos de administración',
    group: 'Administración',
    kind: 'navigation',
    icon: 'file-text',
    disabled: true,
    disabledReason: 'No tienes permisos para abrir facturación',
  },
];

const meta: Meta<AfCommandPaletteComponent> = {
  title: 'Components/Overlays/CommandPalette',
  component: AfCommandPaletteComponent,
  decorators: [moduleMetadata({ imports: [AfCommandPaletteItemDirective] })],
  parameters: {
    layout: 'centered',
    argfit: {
      category: 'Overlays',
      importName: 'AfCommandPalette',
      useWhen: [
        'Para acceder rápidamente a rutas, resultados y acciones mediante búsqueda o teclado.',
        'Para ofrecer un lanzador global Ctrl/Cmd+K con comportamiento accesible.',
      ],
      avoidWhen: [
        'Para ejecutar routing, permisos o fetching dentro de la librería.',
        'Para una lista siempre visible; usa AfListbox.',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-input-bg', '--af-border-focus', '--af-bg-elevated', '--af-shadow-xl'],
      related: ['AfDialog', 'AfPageShell', 'AfListbox'],
    },
    docs: {
      description: {
        component: 'Paleta adaptativa de comandos y búsqueda con disparador, atajo global y navegación completa por teclado.',
      },
    },
  },
  argTypes: {
    searchMode: { control: 'select', options: ['client', 'server'] },
    open: { control: 'boolean' },
    loading: { control: 'boolean' },
    showTrigger: { control: 'boolean' },
    shortcutEnabled: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: min(42rem, 90vw)">
        <af-command-palette
          [items]="items"
          [open]="open"
          [query]="query"
          [searchMode]="searchMode"
          [placeholder]="placeholder"
          [emptyText]="emptyText"
          [loading]="loading"
          [loadingText]="loadingText"
          [errorText]="errorText"
          [showTrigger]="showTrigger"
          [shortcutEnabled]="shortcutEnabled"
          [shortcutLabel]="shortcutLabel"
          [disabled]="disabled"
          [ariaLabel]="ariaLabel"
          [closeLabel]="closeLabel"
          (openChange)="openChange($event)"
          (queryChange)="queryChange($event)"
          (itemSelected)="itemSelected($event)"
        />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<AfCommandPaletteComponent>;

export const Default: Story = {
  args: {
    items: commands,
    open: false,
    query: '',
    searchMode: 'client',
    placeholder: 'Buscar aplicaciones, acciones...',
    emptyText: 'No se encontraron resultados',
    loading: false,
    loadingText: 'Buscando...',
    showTrigger: true,
    shortcutEnabled: true,
    shortcutLabel: 'Ctrl+K',
    disabled: false,
    ariaLabel: 'Paleta de comandos',
    closeLabel: 'Cerrar paleta',
    openChange: fn(),
    queryChange: fn(),
    itemSelected: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Buscar aplicaciones/ }));
    await waitFor(async () => {
      await expect(canvas.getByRole('dialog', { name: 'Paleta de comandos' })).toBeVisible();
    });
    await expect(canvas.getByRole('combobox')).toHaveFocus();
  },
};

export const OpenWithGroups: Story = {
  args: { ...Default.args, open: true, shortcutEnabled: false },
};

export const Loading: Story = {
  args: { ...Default.args, items: [], open: true, loading: true, shortcutEnabled: false },
};

export const Error: Story = {
  args: {
    ...Default.args,
    items: [],
    open: true,
    errorText: 'No se pudieron cargar los comandos.',
    shortcutEnabled: false,
  },
};

export const Empty: Story = {
  args: { ...Default.args, items: [], open: true, shortcutEnabled: false },
};

export const ServerResults: Story = {
  args: {
    ...Default.args,
    items: commands.slice(1, 3),
    open: true,
    query: 'pla',
    searchMode: 'server',
    loading: true,
    shortcutEnabled: false,
  },
};

export const CustomItem: Story = {
  args: { ...Default.args, open: true, shortcutEnabled: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: min(42rem, 90vw)">
        <af-command-palette
          [items]="items"
          [open]="open"
          [shortcutEnabled]="shortcutEnabled"
          (itemSelected)="itemSelected($event)"
        >
          <ng-template afCommandPaletteItem let-item let-active="active">
            <span style="display: flex; align-items: center; justify-content: space-between; width: 100%">
              <span>{{ item.label }} · {{ item.kind }}</span>
              <span>{{ active ? 'Activo' : '' }}</span>
            </span>
          </ng-template>
        </af-command-palette>
      </div>
    `,
  }),
};

export const KeyboardSelection: Story = {
  args: { ...Default.args, open: true, shortcutEnabled: false },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('combobox');
    await userEvent.type(search, 'configuracion');
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    await expect(args.itemSelected).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'settings' }),
    );
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
