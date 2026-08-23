import { validateAfCommandContextExpression } from './af-command-context-expression';
import type {
  AfCommandDefinition,
  AfCommandPaletteConfig,
  AfCommandPaletteDiagnostic,
  AfCommandPaletteValidationResult,
} from '../types/command-palette.types';

const PARAMETER_TYPES = new Set([
  'text', 'number', 'select', 'multiselect', 'date', 'boolean', 'confirm',
]);

export function defineAfCommandPaletteConfig<T extends AfCommandPaletteConfig>(config: T): T {
  return config;
}

export function validateAfCommandPaletteConfig(value: unknown): AfCommandPaletteValidationResult {
  const diagnostics: AfCommandPaletteDiagnostic[] = [];
  if (!isRecord(value)) {
    return invalid('$', 'type', 'La configuración debe ser un objeto JSON.');
  }
  const jsonIssue = findJsonIssue(value, '$', new Set());
  if (jsonIssue) {
    diagnostics.push(diagnostic(jsonIssue, 'json', 'La configuración solo admite valores JSON serializables.'));
  }
  if (value['version'] !== 1) {
    diagnostics.push(diagnostic('version', 'version', 'La única versión soportada es 1.'));
  }
  requiredString(value, 'id', diagnostics);
  if (!Array.isArray(value['commands'])) {
    diagnostics.push(diagnostic('commands', 'type', 'commands debe ser un array.'));
  }

  const modes = Array.isArray(value['modes']) ? value['modes'] : [];
  const modeIds = new Set<string>();
  if (!modes.length) modeIds.add('all');
  const prefixes = new Set<string>();
  modes.forEach((mode, index) => {
    const path = `modes[${index}]`;
    if (!isRecord(mode)) {
      diagnostics.push(diagnostic(path, 'type', 'El modo debe ser un objeto.'));
      return;
    }
    const id = requiredString(mode, 'id', diagnostics, path);
    requiredString(mode, 'label', diagnostics, path);
    if (id && modeIds.has(id)) {
      diagnostics.push(diagnostic(`${path}.id`, 'duplicate', `Modo duplicado: ${id}.`));
    }
    if (id) modeIds.add(id);
    if (typeof mode['prefix'] === 'string') {
      const prefix = mode['prefix'];
      if (!prefix || [...prefix].length !== 1) {
        diagnostics.push(diagnostic(`${path}.prefix`, 'prefix', 'El prefijo debe ser un único carácter.'));
      } else if (prefixes.has(prefix)) {
        diagnostics.push(diagnostic(`${path}.prefix`, 'duplicate', `Prefijo duplicado: ${prefix}.`));
      }
      prefixes.add(prefix);
    }
  });

  const defaultMode = value['defaultMode'];
  if (defaultMode !== undefined && (typeof defaultMode !== 'string' || !modeIds.has(defaultMode))) {
    diagnostics.push(diagnostic('defaultMode', 'reference', 'defaultMode debe referenciar un modo existente.'));
  }

  const providerIds = new Set<string>();
  if (value['providers'] !== undefined && !Array.isArray(value['providers'])) {
    diagnostics.push(diagnostic('providers', 'type', 'providers debe ser un array.'));
  }
  if (Array.isArray(value['providers'])) {
    value['providers'].forEach((provider, index) => {
      const path = `providers[${index}]`;
      if (!isRecord(provider)) {
        diagnostics.push(diagnostic(path, 'type', 'El provider debe ser un objeto.'));
        return;
      }
      const id = requiredString(provider, 'id', diagnostics, path);
      if (id && providerIds.has(id)) {
        diagnostics.push(diagnostic(`${path}.id`, 'duplicate', `Provider duplicado: ${id}.`));
      }
      if (id) providerIds.add(id);
      validateModeReferences(provider['modes'], modeIds, `${path}.modes`, diagnostics);
      validateNonNegativeInteger(provider['minQueryLength'], `${path}.minQueryLength`, diagnostics);
      validateNonNegativeInteger(provider['debounceMs'], `${path}.debounceMs`, diagnostics);
    });
  }

  const commandIds = new Set<string>();
  const keybindings = new Map<string, string>();
  if (typeof value['shortcut'] === 'string') {
    keybindings.set(normalizeKeybinding(value['shortcut']), 'shortcut');
    validateKeybinding(value['shortcut'], 'shortcut', diagnostics);
  }
  if (Array.isArray(value['commands'])) {
    validateCommands(value['commands'], 'commands', commandIds, modeIds, providerIds, keybindings, diagnostics);
  }
  validateCollections(
    value['collections'],
    commandIds,
    modeIds,
    prefixes,
    providerIds,
    keybindings,
    diagnostics,
  );

  return { valid: diagnostics.length === 0, diagnostics };
}

function validateCollections(
  value: unknown,
  commandIds: Set<string>,
  modeIds: ReadonlySet<string>,
  modePrefixes: ReadonlySet<string>,
  providerIds: ReadonlySet<string>,
  keybindings: Map<string, string>,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    diagnostics.push(diagnostic('collections', 'type', 'collections debe ser un array.'));
    return;
  }
  const collectionIds = new Set<string>();
  const activators = new Set<string>();
  value.forEach((collection, index) => {
    const path = `collections[${index}]`;
    if (!isRecord(collection)) {
      diagnostics.push(diagnostic(path, 'type', 'La colección debe ser un objeto.'));
      return;
    }
    const id = requiredString(collection, 'id', diagnostics, path);
    requiredString(collection, 'label', diagnostics, path);
    if (id && collectionIds.has(id)) {
      diagnostics.push(diagnostic(`${path}.id`, 'duplicate', `Colección duplicada: ${id}.`));
    }
    if (id) collectionIds.add(id);
    validateModeReferences(collection['modes'], modeIds, `${path}.modes`, diagnostics);
    validateExpression(collection['when'], `${path}.when`, diagnostics);
    validateExpression(collection['enabledWhen'], `${path}.enabledWhen`, diagnostics);

    if (collection['presentation'] !== undefined
      && !['entity-card', 'compact'].includes(String(collection['presentation']))) {
      diagnostics.push(diagnostic(`${path}.presentation`, 'type', 'Presentación de colección no soportada.'));
    }
    if (collection['activator'] !== undefined) {
      const activator = String(collection['activator']);
      const normalized = normalizeActivator(activator);
      if (!/^@[a-z0-9][a-z0-9-]*$/i.test(activator)) {
        diagnostics.push(diagnostic(`${path}.activator`, 'activator', 'El activador debe usar el formato @alias.'));
      } else if (activators.has(normalized)) {
        diagnostics.push(diagnostic(`${path}.activator`, 'duplicate', `Activador duplicado: ${activator}.`));
      }
      if (modePrefixes.has('@')) {
        diagnostics.push(diagnostic(`${path}.activator`, 'prefix-conflict', 'Los activadores @alias no pueden convivir con un modo cuyo prefijo sea @.'));
      }
      activators.add(normalized);
    }

    const entities = collection['entities'];
    const providerId = collection['providerId'];
    if ((!Array.isArray(entities) || entities.length === 0) && typeof providerId !== 'string') {
      diagnostics.push(diagnostic(path, 'collection-source', 'La colección necesita entities o providerId.'));
    }
    if (providerId !== undefined && !providerIds.has(String(providerId))) {
      diagnostics.push(diagnostic(`${path}.providerId`, 'reference', 'Provider de entidades no declarado.'));
    }
    validateEntities(entities, `${path}.entities`, diagnostics);

    const actions = collection['actions'];
    const actionsProviderId = collection['actionsProviderId'];
    if ((!Array.isArray(actions) || actions.length === 0) && typeof actionsProviderId !== 'string') {
      diagnostics.push(diagnostic(path, 'collection-actions', 'La colección necesita actions o actionsProviderId.'));
    }
    if (actionsProviderId !== undefined && !providerIds.has(String(actionsProviderId))) {
      diagnostics.push(diagnostic(`${path}.actionsProviderId`, 'reference', 'Provider de acciones no declarado.'));
    }
    if (Array.isArray(actions)) {
      validateCommands(actions, `${path}.actions`, commandIds, modeIds, providerIds, keybindings, diagnostics);
    }
  });
}

function validateEntities(
  value: unknown,
  path: string,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    diagnostics.push(diagnostic(path, 'type', 'entities debe ser un array.'));
    return;
  }
  const ids = new Set<string>();
  value.forEach((entity, index) => {
    const entityPath = `${path}[${index}]`;
    if (!isRecord(entity)) {
      diagnostics.push(diagnostic(entityPath, 'type', 'La entidad debe ser un objeto.'));
      return;
    }
    if (entity['kind'] !== 'entity') {
      diagnostics.push(diagnostic(`${entityPath}.kind`, 'type', 'kind debe ser entity.'));
    }
    const id = requiredString(entity, 'id', diagnostics, entityPath);
    requiredString(entity, 'label', diagnostics, entityPath);
    if (id && ids.has(id)) {
      diagnostics.push(diagnostic(`${entityPath}.id`, 'duplicate', `Entidad duplicada: ${id}.`));
    }
    if (id) ids.add(id);
    if (entity['metadata'] !== undefined
      && (!Array.isArray(entity['metadata']) || entity['metadata'].some((item) => typeof item !== 'string'))) {
      diagnostics.push(diagnostic(`${entityPath}.metadata`, 'type', 'metadata debe ser un array de textos.'));
    }
    const media = entity['media'];
    if (media !== undefined) {
      if (!isRecord(media)) {
        diagnostics.push(diagnostic(`${entityPath}.media`, 'type', 'media debe ser un objeto.'));
      } else if (media['shape'] !== undefined
        && !['circle', 'rounded', 'square'].includes(String(media['shape']))) {
        diagnostics.push(diagnostic(`${entityPath}.media.shape`, 'type', 'Forma de media no soportada.'));
      }
    }
  });
}

function validateCommands(
  commands: readonly unknown[],
  basePath: string,
  commandIds: Set<string>,
  modeIds: ReadonlySet<string>,
  providerIds: ReadonlySet<string>,
  keybindings: Map<string, string>,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  commands.forEach((command, index) => {
    const path = `${basePath}[${index}]`;
    if (!isRecord(command)) {
      diagnostics.push(diagnostic(path, 'type', 'El comando debe ser un objeto.'));
      return;
    }
    const id = requiredString(command, 'id', diagnostics, path);
    requiredString(command, 'label', diagnostics, path);
    if (id && commandIds.has(id)) {
      diagnostics.push(diagnostic(`${path}.id`, 'duplicate', `Comando duplicado: ${id}.`));
    }
    if (id) commandIds.add(id);
    validateModeReferences(command['modes'], modeIds, `${path}.modes`, diagnostics);
    validateExpression(command['when'], `${path}.when`, diagnostics);
    validateExpression(command['enabledWhen'], `${path}.enabledWhen`, diagnostics);
    if (typeof command['keybinding'] === 'string') {
      validateKeybinding(command['keybinding'], `${path}.keybinding`, diagnostics);
      const normalizedKeybinding = normalizeKeybinding(command['keybinding']);
      const owner = keybindings.get(normalizedKeybinding);
      if (owner) {
        diagnostics.push(diagnostic(`${path}.keybinding`, 'duplicate-keybinding', `Atajo ya utilizado por ${owner}.`));
      } else {
        keybindings.set(normalizedKeybinding, id ?? path);
      }
    }

    const children = command['children'];
    const childrenProviderId = command['childrenProviderId'];
    const executorId = command['executorId'];
    const branchCount = Number(Array.isArray(children)) + Number(typeof childrenProviderId === 'string');
    if (branchCount > 1 || (branchCount > 0 && typeof executorId === 'string')) {
      diagnostics.push(diagnostic(path, 'command-shape', 'Un comando padre no puede declarar executorId ni dos fuentes de hijos.'));
    }
    if (childrenProviderId !== undefined && !providerIds.has(String(childrenProviderId))) {
      diagnostics.push(diagnostic(`${path}.childrenProviderId`, 'reference', 'Provider de hijos no declarado.'));
    }
    if (Array.isArray(children)) {
      validateCommands(children, `${path}.children`, commandIds, modeIds, providerIds, keybindings, diagnostics);
    }

    const parameters = command['parameters'];
    if (parameters !== undefined && !Array.isArray(parameters)) {
      diagnostics.push(diagnostic(`${path}.parameters`, 'type', 'parameters debe ser un array.'));
    }
    if (Array.isArray(parameters)) {
      const parameterIds = new Set<string>();
      parameters.forEach((parameter, parameterIndex) => {
        const parameterPath = `${path}.parameters[${parameterIndex}]`;
        if (!isRecord(parameter)) {
          diagnostics.push(diagnostic(parameterPath, 'type', 'El parámetro debe ser un objeto.'));
          return;
        }
        const parameterId = requiredString(parameter, 'id', diagnostics, parameterPath);
        requiredString(parameter, 'label', diagnostics, parameterPath);
        if (!PARAMETER_TYPES.has(String(parameter['type']))) {
          diagnostics.push(diagnostic(`${parameterPath}.type`, 'type', 'Tipo de parámetro no soportado.'));
        }
        if (parameterId && parameterIds.has(parameterId)) {
          diagnostics.push(diagnostic(`${parameterPath}.id`, 'duplicate', `Parámetro duplicado: ${parameterId}.`));
        }
        if (parameterId) parameterIds.add(parameterId);
        if (parameter['providerId'] !== undefined && !providerIds.has(String(parameter['providerId']))) {
          diagnostics.push(diagnostic(`${parameterPath}.providerId`, 'reference', 'Provider de parámetro no declarado.'));
        }
        validateParameterBounds(parameter, parameterPath, diagnostics);
        validateParameterOptions(parameter, parameterPath, diagnostics);
        if (parameter['pattern'] !== undefined) {
          try {
            new RegExp(String(parameter['pattern']));
          } catch {
            diagnostics.push(diagnostic(`${parameterPath}.pattern`, 'pattern', 'Expresión regular no válida.'));
          }
        }
      });
    }
  });
}

function validateKeybinding(
  value: string,
  path: string,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  if (!/^(?:(?:Mod|Ctrl|Meta|Alt|Shift)\+)*(?:[A-Za-z0-9]|Escape|Enter|ArrowUp|ArrowDown)$/i.test(value.trim())) {
    diagnostics.push(diagnostic(path, 'keybinding', 'Atajo no válido. Usa modificadores separados por + y una tecla final.'));
  }
}

function normalizeKeybinding(value: string): string {
  return value.replace(/\s+/g, '').toLocaleLowerCase();
}

function normalizeActivator(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
}

function validateParameterBounds(
  parameter: Record<string, unknown>,
  path: string,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  for (const key of ['min', 'max']) {
    if (parameter[key] !== undefined && (typeof parameter[key] !== 'number' || !Number.isFinite(parameter[key]))) {
      diagnostics.push(diagnostic(`${path}.${key}`, 'type', `${key} debe ser un número finito.`));
    }
  }
  for (const key of ['minLength', 'maxLength']) {
    validateNonNegativeInteger(parameter[key], `${path}.${key}`, diagnostics);
  }
  if (typeof parameter['min'] === 'number' && typeof parameter['max'] === 'number'
    && parameter['min'] > parameter['max']) {
    diagnostics.push(diagnostic(path, 'range', 'min no puede ser mayor que max.'));
  }
  if (typeof parameter['minLength'] === 'number' && typeof parameter['maxLength'] === 'number'
    && parameter['minLength'] > parameter['maxLength']) {
    diagnostics.push(diagnostic(path, 'range', 'minLength no puede ser mayor que maxLength.'));
  }
}

function validateParameterOptions(
  parameter: Record<string, unknown>,
  path: string,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  const options = parameter['options'];
  if (options === undefined) return;
  if (!Array.isArray(options)) {
    diagnostics.push(diagnostic(`${path}.options`, 'type', 'options debe ser un array.'));
    return;
  }
  options.forEach((option, index) => {
    const optionPath = `${path}.options[${index}]`;
    if (!isRecord(option)) {
      diagnostics.push(diagnostic(optionPath, 'type', 'La opción debe ser un objeto.'));
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(option, 'value')) {
      diagnostics.push(diagnostic(`${optionPath}.value`, 'required', 'value es obligatorio.'));
    }
    requiredString(option, 'label', diagnostics, optionPath);
  });
}

function validateNonNegativeInteger(
  value: unknown,
  path: string,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  if (value !== undefined && (!Number.isInteger(value) || Number(value) < 0)) {
    diagnostics.push(diagnostic(path, 'type', 'El valor debe ser un entero mayor o igual que cero.'));
  }
}

function findJsonIssue(value: unknown, path: string, seen: Set<object>): string | null {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? null : path;
  if (typeof value !== 'object') return path;
  if (seen.has(value)) return path;
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) return path;
  seen.add(value);
  const entries = Array.isArray(value)
    ? value.map((item, index) => [`[${index}]`, item] as const)
    : Object.entries(value);
  for (const [key, item] of entries) {
    const childPath = Array.isArray(value) ? `${path}${key}` : `${path}.${key}`;
    const issue = findJsonIssue(item, childPath, seen);
    if (issue) return issue;
  }
  seen.delete(value);
  return null;
}

function validateExpression(
  expression: unknown,
  path: string,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  if (expression === undefined) return;
  if (typeof expression !== 'string') {
    diagnostics.push(diagnostic(path, 'type', 'La cláusula debe ser texto.'));
    return;
  }
  const error = validateAfCommandContextExpression(expression);
  if (error) diagnostics.push(diagnostic(path, 'expression', error));
}

function validateModeReferences(
  modes: unknown,
  modeIds: ReadonlySet<string>,
  path: string,
  diagnostics: AfCommandPaletteDiagnostic[],
): void {
  if (modes === undefined) return;
  if (!Array.isArray(modes) || modes.some((mode) => typeof mode !== 'string')) {
    diagnostics.push(diagnostic(path, 'type', 'Los modos deben ser un array de IDs.'));
    return;
  }
  for (const mode of modes) {
    if (!modeIds.has(mode)) {
      diagnostics.push(diagnostic(path, 'reference', `Modo no declarado: ${mode}.`));
    }
  }
}

function requiredString(
  value: Record<string, unknown>,
  key: string,
  diagnostics: AfCommandPaletteDiagnostic[],
  basePath = '',
): string | null {
  const current = value[key];
  const path = basePath ? `${basePath}.${key}` : key;
  if (typeof current !== 'string' || !current.trim()) {
    diagnostics.push(diagnostic(path, 'required', `${key} debe ser texto no vacío.`));
    return null;
  }
  return current;
}

function invalid(path: string, code: string, message: string): AfCommandPaletteValidationResult {
  return { valid: false, diagnostics: [diagnostic(path, code, message)] };
}

function diagnostic(path: string, code: string, message: string): AfCommandPaletteDiagnostic {
  return { path, code, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function asAfCommandPaletteConfig(value: unknown): AfCommandPaletteConfig | null {
  return validateAfCommandPaletteConfig(value).valid ? value as AfCommandPaletteConfig : null;
}

export function flattenAfCommands(commands: readonly AfCommandDefinition[]): readonly AfCommandDefinition[] {
  return commands.flatMap((command) => [command, ...flattenAfCommands(command.children ?? [])]);
}
