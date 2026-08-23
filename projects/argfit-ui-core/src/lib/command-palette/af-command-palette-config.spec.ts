import {
  evaluateAfCommandContextExpression,
  validateAfCommandContextExpression,
} from './af-command-context-expression';
import { validateAfCommandPaletteConfig } from './af-command-palette-config';

describe('AfCommandPalette configuration', () => {
  it('evaluates safe context clauses without eval', () => {
    const context = { auth: { role: 'admin', loggedIn: true }, selection: { count: 2 } } as const;
    expect(evaluateAfCommandContextExpression(
      "auth.loggedIn && auth.role in ['admin', 'owner'] && selection.count >= 1",
      context,
    )).toBe(true);
    expect(evaluateAfCommandContextExpression("auth.role not in ['guest']", context)).toBe(true);
    expect(validateAfCommandContextExpression('auth.role ==')).toContain('valor');
  });

  it('validates IDs, modes, providers, parameters and command shapes', () => {
    const result = validateAfCommandPaletteConfig({
      version: 1,
      id: 'main',
      defaultMode: 'missing',
      modes: [{ id: 'all', label: 'Todo', prefix: '>' }, { id: 'other', label: 'Otro', prefix: '>' }],
      providers: [{ id: 'remote' }],
      commands: [{
        id: 'parent',
        label: 'Padre',
        executorId: 'run',
        childrenProviderId: 'remote',
        parameters: [{ id: 'value', type: 'unknown', label: 'Valor' }],
      }],
    });
    expect(result.valid).toBe(false);
    expect(result.diagnostics.map((item) => item.code)).toContain('duplicate');
    expect(result.diagnostics.map((item) => item.code)).toContain('command-shape');
    expect(result.diagnostics.map((item) => item.code)).toContain('reference');
  });

  it('accepts a complete JSON-compatible configuration', () => {
    const result = validateAfCommandPaletteConfig({
      version: 1,
      id: 'main',
      defaultMode: 'all',
      modes: [{ id: 'all', label: 'Todo' }],
      providers: [{ id: 'remote' }],
      commands: [{
        id: 'export',
        label: 'Exportar',
        executorId: 'export',
        when: 'auth.loggedIn == true',
        parameters: [{ id: 'format', type: 'select', label: 'Formato', providerId: 'remote' }],
      }],
    });
    expect(result).toEqual({ valid: true, diagnostics: [] });
  });

  it('rejects non-JSON values, invalid ranges and keybinding conflicts', () => {
    const result = validateAfCommandPaletteConfig({
      version: 1,
      id: 'main',
      shortcut: 'Mod+K',
      commands: [{
        id: 'export',
        label: 'Exportar',
        keybinding: 'Mod+K',
        payload: { callback: () => undefined },
        parameters: [{ id: 'amount', type: 'number', label: 'Cantidad', min: 10, max: 1 }],
      }],
    });
    expect(result.valid).toBe(false);
    expect(result.diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining(['json', 'duplicate-keybinding', 'range']),
    );
  });

  it('validates generic collections, entities and provider references', () => {
    const result = validateAfCommandPaletteConfig({
      version: 1,
      id: 'entities',
      providers: [{ id: 'players' }, { id: 'player-actions' }],
      commands: [],
      collections: [{
        id: 'players',
        label: 'Jugadores',
        activator: '@jugadores',
        providerId: 'players',
        actionsProviderId: 'player-actions',
        entities: [{
          kind: 'entity',
          id: 'player-1',
          label: 'Martín Ruiz',
          media: { imageSrc: '/martin.webp', shape: 'rounded' },
          metadata: ['Extremo', '#11'],
          data: { status: 'available' },
        }],
        actions: [{ id: 'players.edit', label: 'Editar', executorId: 'edit-player' }],
      }],
    });
    expect(result).toEqual({ valid: true, diagnostics: [] });
  });

  it('rejects collection activator conflicts and missing entity/action sources', () => {
    const result = validateAfCommandPaletteConfig({
      version: 1,
      id: 'entities',
      modes: [{ id: 'all', label: 'Todo', prefix: '@' }],
      commands: [],
      collections: [
        { id: 'players', label: 'Jugadores', activator: '@jugadores' },
        { id: 'teams', label: 'Equipos', activator: '@JUGADORES' },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.diagnostics.map((item) => item.code)).toEqual(expect.arrayContaining([
      'prefix-conflict',
      'duplicate',
      'collection-source',
      'collection-actions',
    ]));
  });
});
