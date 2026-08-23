import { TestBed } from '@angular/core/testing';

import {
  provideAfCommandExecutor,
  provideAfCommandPalette,
  provideAfCommandSearchProvider,
} from '../providers/provide-af-command-palette';
import type { AfCommandExecutionContext, AfCommandPaletteConfig } from '../types/command-palette.types';
import { AfCommandPaletteService } from './command-palette.service';

const CONFIG: AfCommandPaletteConfig = {
  version: 1,
  id: 'service-test',
  history: { enabled: true, maxEntries: 3 },
  providers: [{ id: 'remote', minQueryLength: 1, debounceMs: 0 }],
  commands: [
    { id: 'alpha', label: 'Abrir alpha', executorId: 'run' },
    { id: 'beta', label: 'Abrir beta', executorId: 'run' },
  ],
};

describe('AfCommandPaletteService', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('keeps the last valid configuration and exposes diagnostics', () => {
    TestBed.configureTestingModule({ providers: [provideAfCommandPalette(CONFIG)] });
    const service = TestBed.inject(AfCommandPaletteService);
    const result = service.setConfig({ version: 2, id: '', commands: null });
    expect(result.valid).toBe(false);
    expect(service.config().id).toBe('service-test');
    expect(service.diagnostics().length).toBeGreaterThan(0);
  });

  it('registers executors at bootstrap and runtime and ranks recent commands', async () => {
    const executions: AfCommandExecutionContext[] = [];
    TestBed.configureTestingModule({ providers: [
      provideAfCommandPalette(CONFIG),
      provideAfCommandExecutor('run', () => (context) => { executions.push(context); }),
    ] });
    const service = TestBed.inject(AfCommandPaletteService);
    service.open();
    service.activate('beta');
    await Promise.resolve();
    expect(executions[0]?.command.id).toBe('beta');
    service.open();
    expect(service.results()[0]?.id).toBe('beta');

    const unregister = service.registerExecutor('temporary', () => undefined);
    unregister();
  });

  it('debounces providers, combines remote results and isolates failures', async () => {
    TestBed.configureTestingModule({ providers: [
      provideAfCommandPalette(CONFIG),
      provideAfCommandExecutor('run', () => () => undefined),
      provideAfCommandSearchProvider('remote', () => ({
        search: ({ query, signal }) => new Promise((resolve, reject) => {
          const timer = setTimeout(() => resolve([{ id: `remote:${query}`, label: `Remoto ${query}`, executorId: 'run' }]), 5);
          signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); });
        }),
      })),
    ] });
    const service = TestBed.inject(AfCommandPaletteService);
    service.open();
    service.setQuery('uno');
    service.setQuery('dos');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(service.results().some((result) => result.id === 'remote:dos')).toBe(true);
    expect(service.results().some((result) => result.id === 'remote:uno')).toBe(false);
    expect(service.providerErrors()).toEqual([]);
  });

  it('rejects a second host and remains SSR-safe when storage is unavailable', () => {
    TestBed.configureTestingModule({ providers: [provideAfCommandPalette(CONFIG)] });
    const service = TestBed.inject(AfCommandPaletteService);
    const detach = service.attachHost();
    expect(() => service.attachHost()).toThrowError(/un host global/);
    detach();
    expect(() => service.attachHost()).not.toThrow();
  });

  it('opens collections through @alias, filters entities and restores the previous query', async () => {
    const executions: AfCommandExecutionContext[] = [];
    const config: AfCommandPaletteConfig = {
      version: 1,
      id: 'entities',
      commands: [],
      collections: [{
        id: 'players',
        label: 'Jugadores',
        activator: '@jugadores',
        placeholder: 'Buscar jugadores...',
        emptyText: 'No se encontraron jugadores',
        entities: [
          { kind: 'entity', id: 'martin', label: 'Martín Ruiz', metadata: ['Extremo'], data: { available: true } },
          { kind: 'entity', id: 'lucas', label: 'Lucas Soto', metadata: ['Portero'], data: { available: false } },
        ],
        actions: [
          { id: 'players.edit', label: 'Editar', executorId: 'edit' },
          {
            id: 'players.call-up',
            label: 'Convocar',
            executorId: 'edit',
            enabledWhen: '$entity.data.available == true',
            disabledReason: 'Jugador no disponible',
          },
        ],
      }],
    };
    TestBed.configureTestingModule({ providers: [
      provideAfCommandPalette(config),
      provideAfCommandExecutor('edit', () => (context) => { executions.push(context); }),
    ] });
    const service = TestBed.inject(AfCommandPaletteService);
    service.open();
    expect(service.results()[0]?.collection?.id).toBe('players');
    service.setQuery('@jugadores mart');
    expect(service.query()).toBe('mart');
    expect(service.placeholder()).toBe('Buscar jugadores...');
    expect(service.results().map((result) => result.entity?.id)).toEqual(['martin']);
    service.activate('entity:players:martin');
    expect(service.breadcrumbs().map((item) => item.label)).toEqual(['Jugadores', 'Martín Ruiz']);
    service.activate('players.edit');
    await Promise.resolve();
    expect(executions[0]?.collection?.id).toBe('players');
    expect(executions[0]?.entity?.id).toBe('martin');

    service.open();
    service.setQuery('@jugadores luc');
    service.activate('entity:players:lucas');
    expect(service.results().find((result) => result.id === 'players.call-up')?.disabledReason)
      .toBe('Jugador no disponible');
    service.back();
    expect(service.query()).toBe('luc');
    expect(service.activeId()).toBe('entity:players:lucas');
    expect(() => service.setContext('$entity.id', 'forbidden')).toThrowError(/path reservado/);
  });

  it('merges dynamic entities and lets dynamic actions override JSON actions', async () => {
    const config: AfCommandPaletteConfig = {
      version: 1,
      id: 'dynamic-entities',
      providers: [
        { id: 'players', minQueryLength: 0, debounceMs: 0 },
        { id: 'player-actions', debounceMs: 0 },
      ],
      commands: [],
      collections: [{
        id: 'players',
        label: 'Jugadores',
        providerId: 'players',
        actions: [{ id: 'players.profile', label: 'Perfil estático', executorId: 'run' }],
        actionsProviderId: 'player-actions',
      }],
    };
    TestBed.configureTestingModule({ providers: [
      provideAfCommandPalette(config),
      provideAfCommandExecutor('run', () => () => undefined),
      provideAfCommandSearchProvider('players', () => ({
        search: () => [{ kind: 'entity', id: 'martin', label: 'Martín Ruiz' }],
      })),
      provideAfCommandSearchProvider('player-actions', () => ({
        search: ({ entity, purpose }) => purpose === 'entity-actions' && entity?.id === 'martin'
          ? [{ id: 'players.profile', label: 'Ver perfil de Martín', executorId: 'run' }]
          : [],
      })),
    ] });
    const service = TestBed.inject(AfCommandPaletteService);
    service.open();
    service.activate('collection:players');
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(service.results()[0]?.entity?.id).toBe('martin');
    service.activate('entity:players:martin');
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(service.results().find((result) => result.id === 'players.profile')?.label)
      .toBe('Ver perfil de Martín');
  });
});
