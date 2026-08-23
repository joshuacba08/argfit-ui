import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { applicationConfig, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import {
  AfCommandPaletteService,
  defineAfCommandPaletteConfig,
  provideAfCommandExecutor,
  provideAfCommandPalette,
  provideAfCommandSearchProvider,
  type AfCommandExecutionContext,
  type AfCommandEntity,
  type AfCommandPaletteConfig,
} from '@argfit-ui/core';

import { AfCommandPaletteCommandDirective } from './af-command-palette-command.directive';
import { AfCommandPaletteEntityDirective } from './af-command-palette-entity.directive';
import { AfCommandPaletteComponent } from './af-command-palette.component';

const executed = fn<(context: AfCommandExecutionContext) => void>();

function playerPortrait(background: string, jersey: string, initials: string): string {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${background}"/><stop offset="1" stop-color="#091526"/></linearGradient></defs>
      <rect width="96" height="96" rx="18" fill="url(#g)"/>
      <circle cx="48" cy="34" r="18" fill="#d9a37c"/>
      <path d="M20 96c2-28 13-41 28-41s26 13 28 41" fill="${jersey}"/>
      <path d="M35 31c2-16 24-20 29-2-7-3-12-8-18-7-4 1-7 5-11 9" fill="#172235"/>
      <text x="48" y="82" text-anchor="middle" fill="white" font-family="Arial" font-size="15" font-weight="700">${initials}</text>
    </svg>
  `)}`;
}

const PLAYERS: readonly AfCommandEntity[] = [
  {
    kind: 'entity', id: 'martin-ruiz', label: 'Martín Ruiz', description: 'Extremo derecho',
    keywords: ['martin', 'ruiz', 'extremo'], metadata: ['#11', 'Primer equipo', 'Disponible'],
    media: { imageSrc: playerPortrait('#176b87', '#0ea5e9', 'MR'), initials: 'MR', shape: 'rounded' },
    data: { position: 'RW', permissions: { canViewMedical: true }, available: true },
  },
  {
    kind: 'entity', id: 'alex-garcia', label: 'Álex García', description: 'Mediocentro',
    keywords: ['alex', 'garcia', 'medio'], metadata: ['#8', 'Primer equipo', 'Disponible'],
    media: { imageSrc: playerPortrait('#7147a8', '#8b5cf6', 'AG'), initials: 'AG', shape: 'rounded' },
    data: { position: 'CM', permissions: { canViewMedical: true }, available: true },
  },
  {
    kind: 'entity', id: 'lucas-soto', label: 'Lucas Soto', description: 'Portero',
    keywords: ['lucas', 'soto', 'portero'], metadata: ['#1', 'Primer equipo', 'Recuperación'],
    media: { imageSrc: playerPortrait('#9a5b16', '#f59e0b', 'LS'), initials: 'LS', shape: 'rounded' },
    data: { position: 'GK', permissions: { canViewMedical: true }, available: false },
  },
  {
    kind: 'entity', id: 'noah-silva', label: 'Noah Silva', description: 'Defensa central',
    keywords: ['noah', 'silva', 'defensa'], metadata: ['#4', 'Sub-21', 'Disponible'],
    media: { imageSrc: playerPortrait('#187550', '#10b981', 'NS'), initials: 'NS', shape: 'rounded' },
    data: { position: 'CB', permissions: { canViewMedical: false }, available: true },
  },
];

const commandPaletteConfig = defineAfCommandPaletteConfig({
  version: 1,
  id: 'argfit-main',
  shortcut: 'Mod+K',
  defaultMode: 'all',
  maxResults: 50,
  modes: [
    { id: 'all', label: 'Todo' },
    { id: 'commands', label: 'Comandos', prefix: '>' },
    { id: 'navigation', label: 'Navegación', prefix: '/' },
  ],
  history: { enabled: true, storageKey: 'af.storybook.command-palette.v1', maxEntries: 20 },
  providers: [
    { id: 'players-search', minQueryLength: 0, debounceMs: 80 },
    { id: 'player-actions', debounceMs: 0 },
  ],
  collections: [{
    id: 'players',
    label: 'Jugadores',
    description: 'Busca cualquier jugador y abre sus acciones',
    group: 'Buscar',
    icon: 'users',
    keywords: ['plantilla', 'futbolistas'],
    activator: '@jugadores',
    presentation: 'entity-card',
    placeholder: 'Buscar jugadores...',
    emptyText: 'No se encontraron jugadores',
    providerId: 'players-search',
    actionsProviderId: 'player-actions',
    actions: [
      { id: 'players.edit', label: 'Editar jugador', description: 'Actualiza sus datos deportivos', icon: 'edit', executorId: 'player-action' },
      { id: 'players.training', label: 'Agregar entrenamiento', description: 'Programa trabajo individual', icon: 'calendar', executorId: 'player-action' },
      { id: 'players.call-up', label: 'Convocar', description: 'Añádelo a la próxima convocatoria', icon: 'check', executorId: 'player-action', enabledWhen: '$entity.data.available == true', disabledReason: 'Jugador no disponible' },
      { id: 'players.profile', label: 'Ver perfil', icon: 'user', executorId: 'player-action' },
      { id: 'players.nutrition', label: 'Ver nutrición', icon: 'target', executorId: 'player-action' },
      { id: 'players.injuries', label: 'Ver lesiones', icon: 'stethoscope', executorId: 'player-action', enabledWhen: '$entity.data.permissions.canViewMedical == true', disabledReason: 'Sin permiso médico' },
      { id: 'players.performance', label: 'Ver rendimiento', icon: 'bar-chart-3', executorId: 'player-action' },
    ],
  }],
  commands: [
    {
      id: 'navigation.dashboard',
      label: 'Ir al resumen',
      description: 'Vista principal del equipo',
      group: 'Navegación',
      icon: 'home',
      keywords: ['inicio', 'panel'],
      modes: ['all', 'navigation'],
      executorId: 'navigate',
      payload: { route: '/dashboard' },
      pinned: true,
    },
    {
      id: 'navigation.players',
      label: 'Abrir jugadores',
      description: 'Consulta la plantilla y sus perfiles',
      group: 'Navegación',
      icon: 'users',
      keywords: ['plantilla', 'equipo'],
      modes: ['all', 'navigation'],
      executorId: 'navigate',
      payload: { route: '/players' },
    },
    {
      id: 'actions.create',
      label: 'Crear…',
      description: 'Abre acciones de creación',
      group: 'Acciones',
      icon: 'plus',
      modes: ['all', 'commands'],
      children: [
        { id: 'actions.create.session', label: 'Crear sesión', icon: 'calendar', executorId: 'create-session' },
        { id: 'actions.create.player', label: 'Crear jugador', icon: 'user', executorId: 'create-player' },
      ],
    },
    {
      id: 'reports.export',
      label: 'Exportar informe',
      description: 'Genera un archivo con los datos seleccionados',
      group: 'Acciones',
      icon: 'download',
      modes: ['all', 'commands'],
      keybinding: 'Mod+Shift+E',
      enabledWhen: 'team.id != null',
      disabledReason: 'Selecciona un equipo',
      executorId: 'export-report',
      parameters: [
        {
          id: 'format',
          type: 'select',
          label: 'Selecciona el formato',
          required: true,
          options: [{ value: 'pdf', label: 'PDF' }, { value: 'xlsx', label: 'Excel' }],
        },
        { id: 'from', type: 'date', label: 'Fecha inicial', placeholder: 'YYYY-MM-DD', required: true },
        { id: 'confirm', type: 'confirm', label: 'Generar exportación' },
      ],
    },
    {
      id: 'admin.billing',
      label: 'Facturación',
      description: 'Administración de la suscripción',
      group: 'Administración',
      icon: 'file-text',
      when: "auth.role in ['admin', 'owner']",
      executorId: 'navigate',
    },
    {
      id: 'unavailable',
      label: 'Integración no instalada',
      description: 'Ejemplo de executor ausente',
      group: 'Administración',
      icon: 'circle-alert',
      executorId: 'missing-integration',
    },
  ],
});

function storyProviders(
  config: AfCommandPaletteConfig = commandPaletteConfig,
  options: {
    readonly open?: boolean;
    readonly role?: string;
    readonly failingProvider?: boolean;
    readonly emptyProvider?: boolean;
    readonly recentCommandId?: string;
  } = {},
) {
  return applicationConfig({ providers: [
    provideAfCommandPalette(config),
    provideAfCommandExecutor('navigate', () => (context) => executed(context)),
    provideAfCommandExecutor('create-session', () => (context) => executed(context)),
    provideAfCommandExecutor('create-player', () => (context) => executed(context)),
    provideAfCommandExecutor('export-report', () => async (context) => { executed(context); await Promise.resolve(); }),
    provideAfCommandExecutor('player-action', () => (context) => executed(context)),
    provideAfCommandSearchProvider('players-search', () => ({
      search: async ({ query, signal, purpose }) => {
        await new Promise((resolve) => setTimeout(resolve, 120));
        if (signal.aborted) return [];
        if (options.failingProvider) throw new Error('No se pudieron consultar los jugadores');
        if (purpose !== 'collection' || options.emptyProvider) return [];
        const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
        return PLAYERS.filter((player) => !normalizedQuery || [
          player.label,
          player.description ?? '',
          ...(player.keywords ?? []),
        ].some((value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().includes(normalizedQuery)));
      },
    })),
    provideAfCommandSearchProvider('player-actions', () => ({
      search: ({ purpose, entity }) => purpose === 'entity-actions' && entity
        ? [
          { id: 'players.profile', label: `Ver perfil completo de ${entity.label}`, icon: 'user', executorId: 'player-action' },
          { id: 'players.compare', label: 'Comparar rendimiento', icon: 'activity', executorId: 'player-action' },
        ]
        : [],
    })),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const palette = inject(AfCommandPaletteService);
        palette.clearHistory();
        palette.setContext('team.id', 'team-1');
        palette.setContext('auth.role', options.role ?? 'member');
        if (options.recentCommandId) {
          queueMicrotask(() => {
            palette.open();
            palette.activate(options.recentCommandId!);
            palette.open();
          });
        } else if (options.open) {
          queueMicrotask(() => palette.open());
        }
      },
    },
  ] });
}

const meta: Meta<AfCommandPaletteComponent> = {
  title: 'Components/Overlays/CommandPalette',
  component: AfCommandPaletteComponent,
  decorators: [
    moduleMetadata({ imports: [AfCommandPaletteCommandDirective, AfCommandPaletteEntityDirective] }),
    storyProviders(),
  ],
  parameters: {
    layout: 'centered',
    argfit: {
      category: 'Overlays',
      importName: 'AfCommandPalette',
      useWhen: [
        'Para registrar navegación, acciones y búsquedas globales con una experiencia tipo VS Code.',
        'Para ofrecer comandos estáticos y proveedores dinámicos desde una configuración JSON.',
      ],
      avoidWhen: [
        'Para ejecutar routing, permisos, fetching o exportaciones dentro de la librería.',
        'Para una lista siempre visible; usa AfListbox.',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-input-bg', '--af-border-focus', '--af-bg-elevated', '--af-shadow-xl'],
      related: ['AfDialog', 'AfPageShell', 'AfListbox'],
    },
    docs: {
      description: {
        component: 'Sistema global de comandos configurable mediante JSON, con ranking fuzzy, modos, contexto, providers y quick inputs.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: min(42rem, 90vw)">
        <af-command-palette (commandExecution)="commandExecution($event)" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<AfCommandPaletteComponent>;

export const Default: Story = {
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Buscar aplicaciones/ }));
    await waitFor(async () => {
      await expect(canvas.getByRole('dialog', { name: 'Paleta de comandos' })).toBeVisible();
      await expect(canvas.getByRole('combobox')).toHaveFocus();
    });
  },
};

export const OpenWithModes: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
};

export const ShortcutAndModePrefix: Story = {
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.keyboard('{Control>}k{/Control}');
    await waitFor(async () => await expect(canvas.getByRole('combobox')).toHaveFocus());
    await userEvent.type(canvas.getByRole('combobox'), '/');
    await expect(canvas.getByRole('button', { name: '/ Navegación' })).toHaveAttribute('data-active', '');
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.getByRole('button', { name: 'Todo' })).toHaveAttribute('data-active', '');
  },
};

export const FuzzyRanking: Story = {
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Buscar aplicaciones/ }));
    await userEvent.type(canvas.getByRole('combobox'), 'irsmen');
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await expect(canvas.getByRole('option')).toHaveTextContent('Ir al resumen');
  },
};

export const ContextAndUnavailable: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true, role: 'admin' })],
  args: { commandExecution: fn() },
};

export const DynamicProvider: Story = {
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Buscar aplicaciones/ }));
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await userEvent.type(canvas.getByRole('combobox'), 'Alex');
    await waitFor(async () => {
      await expect(canvas.getByRole('option', { name: /Álex García/ })).toBeVisible();
    });
  },
};

export const EntityCollectionPlayers: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await waitFor(async () => {
      await expect(canvas.getByRole('option', { name: /Martín Ruiz/ })).toBeVisible();
      await expect(canvas.getAllByRole('option')).toHaveLength(4);
    });
    await expect(canvas.getByRole('combobox', { name: 'Buscar jugadores...' })).toHaveFocus();
  },
};

export const EntityActivator: Story = {
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Buscar aplicaciones/ }));
    await userEvent.type(canvas.getByRole('combobox'), '@jugadores mart');
    await waitFor(async () => {
      await expect(canvas.getByRole('option', { name: /Martín Ruiz/ })).toBeVisible();
      await expect(canvas.getAllByRole('option')).toHaveLength(1);
    });
  },
};

export const EntityActions: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await waitFor(async () => await expect(canvas.getByRole('option', { name: /Martín Ruiz/ })).toBeVisible());
    await userEvent.type(canvas.getByRole('combobox'), 'mart');
    await waitFor(async () => await expect(canvas.getByRole('option', { name: /Martín Ruiz/ })).toBeVisible());
    await userEvent.keyboard('{Enter}');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Ruta del comando')).toHaveTextContent('Jugadores');
      await expect(canvas.getByLabelText('Ruta del comando')).toHaveTextContent('Martín Ruiz');
      await expect(canvas.getByRole('option', { name: /Comparar rendimiento/ })).toBeVisible();
    });
  },
};

export const EntityActionContextAndBack: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await waitFor(async () => await expect(canvas.getByRole('option', { name: /Noah Silva/ })).toBeVisible());
    await userEvent.type(canvas.getByRole('combobox'), 'noah');
    await waitFor(async () => await expect(canvas.getByRole('option', { name: /Noah Silva/ })).toBeVisible());
    await userEvent.keyboard('{Enter}');
    const injuries = canvas.getByRole('option', { name: /Ver lesiones/ });
    await expect(injuries).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('combobox', { name: 'Buscar jugadores...' })).toHaveValue('noah');
    await expect(canvas.getByRole('option', { name: /Noah Silva/ })).toHaveAttribute('aria-selected', 'true');
  },
};

const fallbackEntityConfig = defineAfCommandPaletteConfig({
  ...commandPaletteConfig,
  id: 'argfit-entity-fallback',
  collections: [{
    id: 'players',
    label: 'Jugadores',
    icon: 'users',
    activator: '@jugadores',
    presentation: 'entity-card',
    placeholder: 'Buscar jugadores...',
    emptyText: 'No se encontraron jugadores',
    actions: commandPaletteConfig.collections![0]!.actions!,
    entities: [{
      kind: 'entity' as const,
      id: 'samuel-mora',
      label: 'Samuel Mora',
      description: 'Lateral izquierdo',
      metadata: ['#3', 'Sin fotografía'],
      media: { initials: 'SM', shape: 'circle' as const },
      data: { permissions: { canViewMedical: false }, available: true },
    }],
  }],
});

export const EntityFallback: Story = {
  decorators: [storyProviders(fallbackEntityConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await expect(canvas.getByRole('option', { name: /Samuel Mora/ })).toBeVisible();
  },
};

export const EntityEmpty: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true, emptyProvider: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await waitFor(async () => await expect(canvas.getByText('No se encontraron jugadores')).toBeVisible());
  },
};

const multipleCollectionsConfig = defineAfCommandPaletteConfig({
  ...commandPaletteConfig,
  id: 'argfit-multiple-collections',
  collections: [
    ...commandPaletteConfig.collections!,
    {
      id: 'teams',
      label: 'Equipos',
      description: 'Busca equipos y categorías',
      group: 'Buscar',
      icon: 'trophy',
      activator: '@equipos',
      presentation: 'entity-card' as const,
      entities: [{
        kind: 'entity' as const,
        id: 'first-team',
        label: 'Primer equipo',
        description: 'Plantilla profesional',
        metadata: ['24 jugadores', 'Liga nacional'],
        media: { initials: 'PE', icon: 'trophy', shape: 'rounded' as const },
      }],
      actions: [{ id: 'teams.open', label: 'Abrir equipo', icon: 'external-link', executorId: 'player-action' }],
    },
  ],
});

export const MultipleEntityCollections: Story = {
  decorators: [storyProviders(multipleCollectionsConfig, { open: true })],
  args: { commandExecution: fn() },
};

export const CustomEntity: Story = {
  decorators: [storyProviders(fallbackEntityConfig, { open: true })],
  args: { commandExecution: fn() },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:min(42rem,90vw)">
        <af-command-palette (commandExecution)="commandExecution($event)">
          <ng-template afCommandPaletteEntity let-entity let-collection="collection" let-active="active">
            <span style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:.5rem">
              <span><strong>{{ entity.label }}</strong> · {{ entity.description }}</span>
              <span>{{ collection.activator }} {{ active ? '●' : '' }}</span>
            </span>
          </ng-template>
        </af-command-palette>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await expect(canvas.getByText(/Samuel Mora/)).toBeVisible();
  },
};

const recentConfig = defineAfCommandPaletteConfig({
  ...commandPaletteConfig,
  id: 'argfit-recent-story',
  history: { enabled: true, storageKey: 'af.storybook.command-palette.recent.v1', maxEntries: 20 },
  commands: commandPaletteConfig.commands.map((command) => ({ ...command, pinned: false })),
});

export const RecentCommands: Story = {
  decorators: [storyProviders(recentConfig, { recentCommandId: 'navigation.players' })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      await expect(canvas.getAllByRole('option')[0]).toHaveTextContent('Abrir jugadores');
    });
  },
};

export const ProviderError: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true, failingProvider: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Jugadores/ }));
    await waitFor(async () => {
      await expect(canvas.getByText('No se pudieron consultar los jugadores')).toBeVisible();
    });
  },
};

export const NestedCommands: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Crear…/ }));
    await expect(canvas.getByText('Crear sesión')).toBeVisible();
    await expect(canvas.getByLabelText('Ruta del comando')).toHaveTextContent('Crear…');
  },
};

export const ExportParameters: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Exportar informe/ }));
    await userEvent.click(canvas.getByRole('option', { name: 'PDF' }));
    await userEvent.type(canvas.getByRole('combobox'), '2026-08-21');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('option', { name: 'Generar exportación' })).toBeVisible();
  },
};

export const ParameterBackWithEscape: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: /Exportar informe/ }));
    await userEvent.click(canvas.getByRole('option', { name: 'PDF' }));
    await userEvent.type(canvas.getByRole('combobox'), '2026-08-21');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('option', { name: 'Generar exportación' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('combobox', { name: 'YYYY-MM-DD' })).toHaveValue('2026-08-21');
    await expect(canvas.getByRole('dialog')).toBeVisible();
  },
};

export const CustomCommand: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: min(42rem, 90vw)">
        <af-command-palette (commandExecution)="commandExecution($event)">
          <ng-template afCommandPaletteCommand let-result let-active="active" let-mode="modeId">
            <span style="display:flex;justify-content:space-between;width:100%">
              <span>{{ result.label }} · {{ mode }}</span><span>{{ active ? 'Activo' : '' }}</span>
            </span>
          </ng-template>
        </af-command-palette>
      </div>
    `,
  }),
};

export const KeyboardExecution: Story = {
  decorators: [storyProviders(commandPaletteConfig, { open: true })],
  args: { commandExecution: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('combobox');
    await userEvent.type(search, 'abrir jugadores');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
