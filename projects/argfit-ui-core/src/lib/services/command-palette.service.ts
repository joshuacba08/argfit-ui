import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { evaluateAfCommandContextExpression } from '../command-palette/af-command-context-expression';
import { flattenAfCommands, validateAfCommandPaletteConfig } from '../command-palette/af-command-palette-config';
import {
  AF_COMMAND_EXECUTORS,
  AF_COMMAND_PALETTE_CONFIG,
  AF_COMMAND_SEARCH_PROVIDERS,
} from '../providers/provide-af-command-palette';
import type {
  AfCommandContext,
  AfCommandCollectionDefinition,
  AfCommandDefinition,
  AfCommandEntity,
  AfCommandExecutionContext,
  AfCommandExecutionEvent,
  AfCommandExecutor,
  AfCommandJsonValue,
  AfCommandModeDefinition,
  AfCommandPaletteBreadcrumb,
  AfCommandPaletteConfig,
  AfCommandPaletteDiagnostic,
  AfCommandPaletteOpenOptions,
  AfCommandPaletteProviderError,
  AfCommandPaletteResult,
  AfCommandPaletteValidationResult,
  AfCommandParameterDefinition,
  AfCommandParameterOption,
  AfCommandProviderPurpose,
  AfCommandSearchProvider,
  AfCommandSearchProviderResult,
} from '../types/command-palette.types';

interface HistoryEntry {
  readonly id: string;
  readonly count: number;
  readonly lastUsedAt: number;
}

interface CommandLevel {
  readonly command: AfCommandDefinition;
  readonly commands: readonly AfCommandDefinition[];
  readonly providerId?: string;
}

interface ProviderInvocation {
  readonly purpose: AfCommandProviderPurpose;
  readonly parentCommand?: AfCommandDefinition;
  readonly parameter?: AfCommandParameterDefinition;
  readonly collection?: AfCommandCollectionDefinition;
  readonly entity?: AfCommandEntity;
}

const DEFAULT_MODE: AfCommandModeDefinition = { id: 'all', label: 'Todo' };
const DEFAULT_STORAGE_KEY = 'af.command-palette.history.v1';

@Injectable({ providedIn: 'root' })
export class AfCommandPaletteService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly configSignal = signal<AfCommandPaletteConfig>(inject(AF_COMMAND_PALETTE_CONFIG));
  private readonly contextSignal = signal<AfCommandContext>({});
  private readonly openSignal = signal(false);
  private readonly querySignal = signal('');
  private readonly modeIdSignal = signal('all');
  private readonly activeIdSignal = signal<string | null>(null);
  private readonly focusRequestSignal = signal(0);
  private readonly diagnosticsSignal = signal<readonly AfCommandPaletteDiagnostic[]>([]);
  private readonly executionEventSignal = signal<AfCommandExecutionEvent | null>(null);
  private readonly providerResultsSignal = signal<readonly AfCommandDefinition[]>([]);
  private readonly providerEntitiesSignal = signal<readonly AfCommandEntity[]>([]);
  private readonly providerOptionsSignal = signal<readonly AfCommandParameterOption[]>([]);
  private readonly providerErrorsSignal = signal<readonly AfCommandPaletteProviderError[]>([]);
  private readonly loadingProviderIdsSignal = signal<ReadonlySet<string>>(new Set());
  private readonly levelsSignal = signal<readonly CommandLevel[]>([]);
  private readonly collectionSignal = signal<AfCommandCollectionDefinition | null>(null);
  private readonly entitySignal = signal<AfCommandEntity | null>(null);
  private readonly parameterCommandSignal = signal<AfCommandDefinition | null>(null);
  private readonly parameterIndexSignal = signal(-1);
  private readonly parameterValuesSignal = signal<Readonly<Record<string, AfCommandJsonValue>>>({});
  private readonly historySignal = signal<readonly HistoryEntry[]>([]);
  private readonly executorVersion = signal(0);
  private readonly providerVersion = signal(0);
  private readonly executors = new Map<string, AfCommandExecutor>();
  private readonly providers = new Map<string, AfCommandSearchProvider>();
  private readonly providerTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly providerControllers = new Map<string, AbortController>();
  private readonly providerInvocations = new Map<string, ProviderInvocation>();
  private readonly providerOrigins = new Map<string, string>();
  private providerSequence = 0;
  private hostAttached = false;
  private collectionQuerySnapshot = '';
  private collectionActiveSnapshot: string | null = null;

  readonly config = this.configSignal.asReadonly();
  readonly context = this.contextSignal.asReadonly();
  readonly isOpen = this.openSignal.asReadonly();
  readonly query = this.querySignal.asReadonly();
  readonly modeId = this.modeIdSignal.asReadonly();
  readonly activeId = this.activeIdSignal.asReadonly();
  readonly focusRequest = this.focusRequestSignal.asReadonly();
  readonly diagnostics = this.diagnosticsSignal.asReadonly();
  readonly executionEvent = this.executionEventSignal.asReadonly();
  readonly providerErrors = this.providerErrorsSignal.asReadonly();
  readonly loading = computed(() => this.loadingProviderIdsSignal().size > 0);
  readonly modes = computed<readonly AfCommandModeDefinition[]>(() => {
    const modes = this.configSignal().modes;
    return modes?.length ? modes : [DEFAULT_MODE];
  });
  readonly currentMode = computed(() =>
    this.modes().find((mode) => mode.id === this.modeIdSignal()) ?? this.modes()[0]!,
  );
  readonly currentParameter = computed<AfCommandParameterDefinition | null>(() => {
    const command = this.parameterCommandSignal();
    return command?.parameters?.[this.parameterIndexSignal()] ?? null;
  });
  readonly breadcrumbs = computed<readonly AfCommandPaletteBreadcrumb[]>(() => [
    ...(this.collectionSignal()
      ? [{ id: `collection:${this.collectionSignal()!.id}`, label: this.collectionSignal()!.label }]
      : []),
    ...(this.entitySignal()
      ? [{ id: `entity:${this.entitySignal()!.id}`, label: this.entitySignal()!.label }]
      : []),
    ...this.levelsSignal().map((level) => ({ id: level.command.id, label: level.command.label })),
    ...(this.parameterCommandSignal()
      ? [{ id: `${this.parameterCommandSignal()!.id}:parameters`, label: this.parameterCommandSignal()!.label }]
      : []),
  ]);
  readonly canGoBack = computed(() => Boolean(
    this.collectionSignal()
    || this.entitySignal()
    || this.levelsSignal().length
    || this.parameterCommandSignal(),
  ));
  readonly placeholder = computed(() =>
    this.currentParameter()?.placeholder
    ?? this.currentParameter()?.label
    ?? (this.entitySignal() ? `Buscar acciones para ${this.entitySignal()!.label}...` : undefined)
    ?? this.collectionSignal()?.placeholder
    ?? this.currentMode().placeholder
    ?? this.configSignal().labels?.placeholder
    ?? 'Buscar aplicaciones, acciones...',
  );
  readonly shortcutLabel = computed(() => this.formatKeybinding(this.configSignal().shortcut ?? 'Mod+K'));
  readonly validationText = computed(() => {
    const parameter = this.currentParameter();
    if (!parameter || !['text', 'number', 'date'].includes(parameter.type) || !this.querySignal()) return undefined;
    return this.parseFreeValue(parameter, this.querySignal()).error;
  });
  readonly results = computed<readonly AfCommandPaletteResult[]>(() => {
    this.executorVersion();
    this.providerVersion();
    const parameter = this.currentParameter();
    if (parameter) return this.parameterResults(parameter);
    if (this.collectionSignal() && !this.entitySignal() && !this.levelsSignal().length) {
      return this.entityResults(this.collectionSignal()!);
    }
    return this.commandResults();
  });
  readonly emptyText = computed(() =>
    this.collectionSignal()?.emptyText
    ?? this.configSignal().labels?.emptyText
    ?? 'No se encontraron resultados',
  );

  constructor() {
    const injectedExecutors = inject(AF_COMMAND_EXECUTORS, { optional: true }) ?? [];
    const injectedProviders = inject(AF_COMMAND_SEARCH_PROVIDERS, { optional: true }) ?? [];
    for (const registration of injectedExecutors) this.executors.set(registration.id, registration.executor);
    for (const registration of injectedProviders) this.providers.set(registration.id, registration.provider);

    const initialValidation = validateAfCommandPaletteConfig(this.configSignal());
    if (!initialValidation.valid) {
      throw new Error(this.validationMessage(initialValidation));
    }
    this.resetForConfig();
    this.destroyRef.onDestroy(() => this.cancelProviders());
  }

  attachHost(): () => void {
    if (this.hostAttached) {
      throw new Error('AfCommandPalette solo admite un host global por aplicación.');
    }
    this.hostAttached = true;
    const listener = (event: KeyboardEvent) => this.onDocumentKeydown(event);
    if (this.isBrowser) this.document.addEventListener('keydown', listener);
    return () => {
      if (this.isBrowser) this.document.removeEventListener('keydown', listener);
      this.hostAttached = false;
    };
  }

  setConfig(value: unknown): AfCommandPaletteValidationResult {
    const validation = validateAfCommandPaletteConfig(value);
    this.diagnosticsSignal.set(validation.diagnostics);
    if (!validation.valid) return validation;
    this.configSignal.set(value as AfCommandPaletteConfig);
    this.resetForConfig();
    return validation;
  }

  open(options: AfCommandPaletteOpenOptions = {}): void {
    const mode = options.modeId && this.modes().some((candidate) => candidate.id === options.modeId)
      ? options.modeId
      : this.defaultModeId();
    this.modeIdSignal.set(mode);
    this.openSignal.set(true);
    this.focusRequestSignal.update((value) => value + 1);
    this.setQuery(options.query ?? '');
  }

  close(): void {
    this.openSignal.set(false);
    this.querySignal.set('');
    this.activeIdSignal.set(null);
    this.levelsSignal.set([]);
    this.collectionSignal.set(null);
    this.entitySignal.set(null);
    this.parameterCommandSignal.set(null);
    this.parameterIndexSignal.set(-1);
    this.parameterValuesSignal.set({});
    this.providerResultsSignal.set([]);
    this.providerEntitiesSignal.set([]);
    this.providerOptionsSignal.set([]);
    this.providerErrorsSignal.set([]);
    this.cancelProviders();
    this.collectionQuerySnapshot = '';
    this.collectionActiveSnapshot = null;
  }

  toggle(): void {
    this.openSignal() ? this.close() : this.open();
  }

  setQuery(rawQuery: string): void {
    if (!this.currentParameter() && !this.collectionSignal() && !this.levelsSignal().length) {
      const match = this.matchCollectionActivator(rawQuery);
      if (match) {
        this.activateCollection(match.collection, match.query);
        return;
      }
    }
    if (!this.currentParameter() && !this.collectionSignal()) {
      const mode = this.modes().find((candidate) => candidate.prefix && rawQuery.startsWith(candidate.prefix));
      if (mode) {
        this.modeIdSignal.set(mode.id);
        rawQuery = rawQuery.slice(mode.prefix!.length).trimStart();
      }
    }
    this.querySignal.set(rawQuery);
    if (this.entitySignal() && !this.levelsSignal().length) {
      this.ensureActiveResult();
      return;
    }
    this.refreshProviders();
    this.ensureActiveResult();
  }

  setMode(modeId: string): void {
    if (!this.modes().some((mode) => mode.id === modeId)) return;
    this.modeIdSignal.set(modeId);
    this.querySignal.set('');
    this.refreshProviders();
    this.ensureActiveResult();
  }

  resetMode(): void {
    if (this.currentParameter()) return;
    if (this.collectionSignal() || this.entitySignal() || this.levelsSignal().length) {
      this.back();
      return;
    }
    if (this.modeIdSignal() === this.defaultModeId()) return;
    this.setMode(this.defaultModeId());
  }

  setActive(id: string): void {
    const result = this.results().find((candidate) => candidate.id === id);
    if (result && !result.disabled) this.activeIdSignal.set(id);
  }

  navigate(intent: 'next' | 'previous' | 'first' | 'last'): void {
    const enabled = this.results().filter((result) => !result.disabled);
    if (!enabled.length) {
      this.activeIdSignal.set(null);
      return;
    }
    if (intent === 'first' || intent === 'last') {
      this.activeIdSignal.set(intent === 'first' ? enabled[0]!.id : enabled.at(-1)!.id);
      return;
    }
    const current = enabled.findIndex((result) => result.id === this.activeIdSignal());
    const direction = intent === 'next' ? 1 : -1;
    const next = (current + direction + enabled.length) % enabled.length;
    this.activeIdSignal.set(enabled[next]!.id);
  }

  activate(id: string): void {
    const result = this.results().find((candidate) => candidate.id === id);
    if (!result || result.disabled) return;
    const parameter = this.currentParameter();
    if (parameter) {
      this.activateParameterResult(parameter, result);
      return;
    }
    if (result.collection && !result.entity) {
      this.activateCollection(result.collection);
      return;
    }
    if (result.entity && result.collection) {
      this.activateEntity(result.collection, result.entity, result.id);
      return;
    }
    if (result.command) this.activateCommand(result.command);
  }

  back(): void {
    const command = this.parameterCommandSignal();
    if (command) {
      if (this.parameterIndexSignal() > 0) {
        this.parameterIndexSignal.update((value) => value - 1);
        this.querySignal.set(this.freeValueAsQuery(this.currentParameter()));
        this.refreshProviders();
        this.ensureActiveResult();
      } else {
        this.parameterCommandSignal.set(null);
        this.parameterIndexSignal.set(-1);
        this.parameterValuesSignal.set({});
        this.querySignal.set('');
        this.refreshProviders();
        this.ensureActiveResult();
      }
      return;
    }
    if (this.levelsSignal().length) {
      this.levelsSignal.update((levels) => levels.slice(0, -1));
      this.querySignal.set('');
      this.providerResultsSignal.set([]);
      this.refreshProviders();
      this.ensureActiveResult();
      return;
    }
    if (this.entitySignal()) {
      this.entitySignal.set(null);
      this.querySignal.set(this.collectionQuerySnapshot);
      this.providerResultsSignal.set([]);
      this.providerErrorsSignal.set([]);
      this.activeIdSignal.set(this.collectionActiveSnapshot);
      this.refreshProviders();
      if (!this.collectionSignal()?.providerId) this.ensureActiveResult();
      return;
    }
    if (this.collectionSignal()) {
      this.collectionSignal.set(null);
      this.querySignal.set('');
      this.providerEntitiesSignal.set([]);
      this.providerErrorsSignal.set([]);
      this.refreshProviders();
      this.ensureActiveResult();
      return;
    }
    this.close();
  }

  retryProvider(providerId: string): void {
    const invocation = this.providerInvocations.get(providerId);
    this.runProvider(
      providerId,
      0,
      invocation?.purpose,
      invocation?.parentCommand,
      invocation?.parameter,
      invocation?.collection,
      invocation?.entity,
    );
  }

  setContext(path: string, value: AfCommandJsonValue): void {
    assertWritableContextPath(path);
    this.contextSignal.update((context) => setContextPath(context, path, value));
    this.refreshProviders();
    this.ensureActiveResult();
  }

  removeContext(path: string): void {
    assertWritableContextPath(path);
    this.contextSignal.update((context) => removeContextPath(context, path));
    this.refreshProviders();
    this.ensureActiveResult();
  }

  clearHistory(): void {
    this.historySignal.set([]);
    this.persistHistory();
  }

  registerExecutor(id: string, executor: AfCommandExecutor): () => void {
    this.executors.set(id, executor);
    this.executorVersion.update((value) => value + 1);
    this.ensureActiveResult();
    return () => {
      if (this.executors.get(id) === executor) this.executors.delete(id);
      this.executorVersion.update((value) => value + 1);
    };
  }

  registerProvider(id: string, provider: AfCommandSearchProvider): () => void {
    this.providers.set(id, provider);
    this.providerVersion.update((value) => value + 1);
    this.refreshProviders();
    return () => {
      if (this.providers.get(id) === provider) this.providers.delete(id);
      this.providerVersion.update((value) => value + 1);
    };
  }

  private commandResults(): readonly AfCommandPaletteResult[] {
    const context = this.evaluationContext();
    const modeId = this.modeIdSignal();
    const level = this.levelsSignal().at(-1);
    const collection = this.collectionSignal();
    const entity = this.entitySignal();
    const commandCandidates = level
      ? [...level.commands, ...this.providerResultsSignal()]
      : entity && collection
        ? [...(collection.actions ?? []), ...this.providerResultsSignal()]
        : [...this.configSignal().commands, ...this.providerResultsSignal()];
    const commands = [...new Map(commandCandidates.map((command) => [command.id, command])).values()];
    const query = normalize(this.querySignal());
    const history = new Map(this.historySignal().map((entry) => [entry.id, entry]));
    const results = commands
      .filter((command) => level || entity
        || command.modes?.includes(modeId)
        || (!command.modes?.length && modeId === this.defaultModeId()))
      .filter((command) => safeEvaluate(command.when, context))
      .map<AfCommandPaletteResult | null>((command, index) => {
        const textScore = fuzzyCommandScore(command, query);
        if (query && textScore < 0) return null;
        const historyEntry = history.get(command.id);
        const historyBonus = historyEntry
          ? Math.min(36, historyEntry.count * 3 + Math.max(0, 18 - (Date.now() - historyEntry.lastUsedAt) / 86_400_000))
          : 0;
        const enabledByContext = safeEvaluate(command.enabledWhen, context);
        const isParent = Boolean(command.children?.length || command.childrenProviderId);
        const missingExecutor = !isParent && !command.parameters?.length
          && (!command.executorId || !this.executors.has(command.executorId));
        const disabled = !enabledByContext || missingExecutor;
        return {
          id: command.id,
          label: command.label,
          description: command.description,
          group: command.group,
          icon: command.icon,
          keybinding: command.keybinding ? this.formatKeybinding(command.keybinding) : undefined,
          disabled,
          disabledReason: !enabledByContext
            ? command.disabledReason ?? 'Comando no disponible en el contexto actual'
            : missingExecutor ? this.configSignal().labels?.unavailableText ?? 'Acción no registrada' : undefined,
          providerId: this.providerOrigins.get(command.id),
          command,
          score: textScore + (command.priority ?? 0) + (command.pinned ? 80 : 0) + historyBonus - index / 10_000,
        } satisfies AfCommandPaletteResult;
      })
      .filter((result): result is AfCommandPaletteResult => result !== null)
      .sort((left, right) => right.score - left.score);
    const collectionResults = !level && !entity && !collection
      ? this.collectionResults(context, modeId, query)
      : [];
    return [...results, ...collectionResults]
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, this.configSignal().maxResults ?? 50));
  }

  private collectionResults(
    context: AfCommandContext,
    modeId: string,
    query: string,
  ): readonly AfCommandPaletteResult[] {
    return (this.configSignal().collections ?? [])
      .filter((collection) => collection.showInRoot !== false)
      .filter((collection) => collection.modes?.includes(modeId)
        || (!collection.modes?.length && modeId === this.defaultModeId()))
      .filter((collection) => safeEvaluate(collection.when, context))
      .map<AfCommandPaletteResult | null>((collection, index) => {
        const score = fuzzyCollectionScore(collection, query);
        if (query && score < 0) return null;
        const enabled = safeEvaluate(collection.enabledWhen, context);
        return {
          id: `collection:${collection.id}`,
          label: collection.label,
          description: collection.description,
          group: collection.group ?? 'Buscar',
          icon: collection.icon,
          keybinding: collection.activator,
          disabled: !enabled,
          disabledReason: !enabled
            ? collection.disabledReason ?? 'Colección no disponible en el contexto actual'
            : undefined,
          collection,
          score: score + (collection.priority ?? 0) - index / 10_000,
        };
      })
      .filter((result): result is AfCommandPaletteResult => result !== null);
  }

  private entityResults(collection: AfCommandCollectionDefinition): readonly AfCommandPaletteResult[] {
    const dynamic = new Map(this.providerEntitiesSignal().map((entity) => [entity.id, entity]));
    const entities = [
      ...(collection.entities ?? []).filter((entity) => !dynamic.has(entity.id)),
      ...this.providerEntitiesSignal(),
    ];
    const query = normalize(this.querySignal());
    return entities
      .map((entity, index) => ({ entity, score: fuzzyEntityScore(entity, query) - index / 10_000 }))
      .filter(({ score }) => !query || score >= 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, this.configSignal().maxResults ?? 50))
      .map(({ entity, score }) => ({
        id: `entity:${collection.id}:${entity.id}`,
        label: entity.label,
        description: entity.description,
        group: entity.group,
        icon: entity.media?.icon ?? collection.icon,
        disabled: entity.disabled,
        disabledReason: entity.disabledReason,
        providerId: this.providerOrigins.get(`entity:${collection.id}:${entity.id}`),
        collection,
        entity,
        score: score + (entity.priority ?? 0),
      }));
  }

  private parameterResults(parameter: AfCommandParameterDefinition): readonly AfCommandPaletteResult[] {
    if (['select', 'multiselect', 'boolean', 'confirm'].includes(parameter.type)) {
      const options: readonly AfCommandParameterOption[] = parameter.type === 'boolean'
        ? [{ value: true, label: 'Sí' }, { value: false, label: 'No' }]
        : parameter.type === 'confirm'
          ? [{ value: true, label: parameter.label }]
          : [...(parameter.options ?? []), ...this.providerOptionsSignal()];
      const selected = Array.isArray(this.parameterValuesSignal()[parameter.id])
        ? this.parameterValuesSignal()[parameter.id] as readonly AfCommandJsonValue[]
        : [];
      const query = normalize(this.querySignal());
      const results = options
        .map((option, index) => ({ option, score: fuzzyTextScore(option.label, query) - index / 10_000 }))
        .filter(({ score }) => !query || score >= 0)
        .sort((left, right) => right.score - left.score)
        .map(({ option, score }, index) => ({
          id: `parameter:${parameter.id}:${index}:${jsonKey(option.value)}`,
          label: option.label,
          description: option.description,
          icon: option.icon,
          disabled: option.disabled,
          parameterValue: option.value,
          syntheticKind: 'parameter-option' as const,
          selected: selected.some((value) => jsonKey(value) === jsonKey(option.value)),
          score,
        }));
      if (parameter.type === 'multiselect') {
        return [...results, {
          id: `parameter:${parameter.id}:continue`,
          label: 'Continuar',
          description: selected.length ? `${selected.length} seleccionados` : 'Ninguna selección',
          syntheticKind: 'parameter-continue',
          disabled: parameter.required === true && selected.length === 0,
          score: -10,
        }];
      }
      return results;
    }

    const parsed = this.parseFreeValue(parameter, this.querySignal());
    if (parsed.error || parsed.value === undefined) return [];
    return [{
      id: `parameter:${parameter.id}:continue`,
      label: `Usar “${this.querySignal()}”`,
      description: parameter.description,
      parameterValue: parsed.value,
      syntheticKind: 'parameter-continue',
      score: 1,
    }];
  }

  private activateCollection(collection: AfCommandCollectionDefinition, query = ''): void {
    this.cancelProviders();
    this.collectionSignal.set(collection);
    this.entitySignal.set(null);
    this.levelsSignal.set([]);
    this.querySignal.set(query.trimStart());
    this.activeIdSignal.set(null);
    this.providerResultsSignal.set([]);
    this.providerEntitiesSignal.set([]);
    this.providerErrorsSignal.set([]);
    this.collectionQuerySnapshot = '';
    this.collectionActiveSnapshot = null;
    this.refreshProviders();
    this.ensureActiveResult();
  }

  private activateEntity(
    collection: AfCommandCollectionDefinition,
    entity: AfCommandEntity,
    resultId: string,
  ): void {
    this.cancelProviders();
    this.collectionQuerySnapshot = this.querySignal();
    this.collectionActiveSnapshot = resultId;
    this.entitySignal.set(entity);
    this.querySignal.set('');
    this.activeIdSignal.set(null);
    this.providerResultsSignal.set([]);
    this.providerErrorsSignal.set([]);
    if (collection.actionsProviderId) {
      this.runProvider(
        collection.actionsProviderId,
        0,
        'entity-actions',
        undefined,
        undefined,
        collection,
        entity,
      );
    }
    this.ensureActiveResult();
  }

  private activateCommand(command: AfCommandDefinition): void {
    if (command.children?.length) {
      this.levelsSignal.update((levels) => [...levels, { command, commands: command.children! }]);
      this.querySignal.set('');
      this.providerResultsSignal.set([]);
      this.ensureActiveResult();
      return;
    }
    if (command.childrenProviderId) {
      this.levelsSignal.update((levels) => [...levels, { command, commands: [], providerId: command.childrenProviderId }]);
      this.querySignal.set('');
      this.providerResultsSignal.set([]);
      this.runProvider(command.childrenProviderId, 0, 'children', command);
      this.ensureActiveResult();
      return;
    }
    if (command.parameters?.length) {
      this.parameterCommandSignal.set(command);
      this.parameterIndexSignal.set(0);
      this.parameterValuesSignal.set(Object.fromEntries(
        command.parameters.filter((parameter) => parameter.defaultValue !== undefined)
          .map((parameter) => [parameter.id, parameter.defaultValue!]),
      ));
      this.querySignal.set(this.freeValueAsQuery(command.parameters[0]));
      this.refreshProviders();
      this.ensureActiveResult();
      return;
    }
    this.execute(command);
  }

  private activateParameterResult(
    parameter: AfCommandParameterDefinition,
    result: AfCommandPaletteResult,
  ): void {
    if (parameter.type === 'multiselect' && result.syntheticKind === 'parameter-option') {
      const current = Array.isArray(this.parameterValuesSignal()[parameter.id])
        ? [...this.parameterValuesSignal()[parameter.id] as readonly AfCommandJsonValue[]]
        : [];
      const key = jsonKey(result.parameterValue!);
      const index = current.findIndex((value) => jsonKey(value) === key);
      if (index >= 0) current.splice(index, 1); else current.push(result.parameterValue!);
      this.parameterValuesSignal.update((values) => ({ ...values, [parameter.id]: current }));
      this.ensureActiveResult();
      return;
    }
    if (result.parameterValue !== undefined) {
      this.parameterValuesSignal.update((values) => ({ ...values, [parameter.id]: result.parameterValue! }));
    }
    this.advanceParameter();
  }

  private advanceParameter(): void {
    const command = this.parameterCommandSignal()!;
    const nextIndex = this.parameterIndexSignal() + 1;
    if (nextIndex < (command.parameters?.length ?? 0)) {
      this.parameterIndexSignal.set(nextIndex);
      this.querySignal.set(this.freeValueAsQuery(command.parameters![nextIndex]));
      this.providerOptionsSignal.set([]);
      this.refreshProviders();
      this.ensureActiveResult();
      return;
    }
    this.execute(command, this.parameterValuesSignal());
  }

  private execute(
    command: AfCommandDefinition,
    parameters: Readonly<Record<string, AfCommandJsonValue>> = {},
  ): void {
    const executor = command.executorId ? this.executors.get(command.executorId) : undefined;
    if (!executor) return;
    const context: AfCommandExecutionContext = {
      command,
      payload: command.payload,
      parameters: cloneJson(parameters),
      context: cloneJson(this.contextSignal()),
      collection: this.collectionSignal() ? cloneJson(this.collectionSignal()!) : undefined,
      entity: this.entitySignal() ? cloneJson(this.entitySignal()!) : undefined,
    };
    this.executionEventSignal.set({ type: 'dispatch', context });
    this.recordHistory(command.id);
    this.close();
    Promise.resolve()
      .then(() => executor(context))
      .then(() => this.executionEventSignal.set({ type: 'success', context }))
      .catch((error: unknown) => this.executionEventSignal.set({ type: 'error', context, error }));
  }

  private refreshProviders(): void {
    this.cancelProviders();
    this.providerResultsSignal.set([]);
    this.providerEntitiesSignal.set([]);
    this.providerOrigins.clear();
    this.providerOptionsSignal.set([]);
    this.providerErrorsSignal.set([]);
    if (!this.openSignal()) return;
    const parameter = this.currentParameter();
    if (parameter) {
      if (parameter.providerId) {
        this.runProvider(parameter.providerId, 0, 'parameter', this.parameterCommandSignal() ?? undefined, parameter);
      }
      return;
    }
    const level = this.levelsSignal().at(-1);
    if (level?.providerId) {
      this.runProvider(level.providerId, 0, 'children', level.command);
      return;
    }
    const collection = this.collectionSignal();
    const entity = this.entitySignal();
    if (collection && entity) {
      if (collection.actionsProviderId) {
        this.runProvider(
          collection.actionsProviderId,
          0,
          'entity-actions',
          undefined,
          undefined,
          collection,
          entity,
        );
      }
      return;
    }
    if (collection) {
      if (collection.providerId) {
        const definition = this.providerDefinition(collection.providerId);
        if (this.querySignal().length >= (definition?.minQueryLength ?? 0)) {
          this.runProvider(
            collection.providerId,
            definition?.debounceMs ?? 150,
            'collection',
            undefined,
            undefined,
            collection,
          );
        }
      }
      return;
    }
    const scopedProviders = this.scopedProviderIds();
    for (const definition of this.configSignal().providers ?? []) {
      if (scopedProviders.has(definition.id)) continue;
      if (definition.modes?.length && !definition.modes.includes(this.modeIdSignal())) continue;
      if (this.querySignal().length < (definition.minQueryLength ?? 0)) continue;
      this.runProvider(definition.id, definition.debounceMs ?? 150);
    }
  }

  private runProvider(
    providerId: string,
    delay: number,
    purpose: AfCommandProviderPurpose = 'search',
    parentCommand?: AfCommandDefinition,
    parameter?: AfCommandParameterDefinition,
    collection?: AfCommandCollectionDefinition,
    entity?: AfCommandEntity,
  ): void {
    this.providerInvocations.set(providerId, { purpose, parentCommand, parameter, collection, entity });
    const provider = this.providers.get(providerId);
    if (!provider) {
      this.providerErrorsSignal.update((errors) => [...errors.filter((error) => error.providerId !== providerId), {
        providerId,
        message: 'Proveedor no registrado',
      }]);
      return;
    }
    const sequence = this.providerSequence;
    const timer = setTimeout(() => {
      const controller = new AbortController();
      this.providerControllers.set(providerId, controller);
      this.loadingProviderIdsSignal.update((ids) => new Set([...ids, providerId]));
      Promise.resolve(provider.search({
        query: this.querySignal(),
        modeId: this.modeIdSignal(),
        context: this.contextSignal(),
        signal: controller.signal,
        purpose,
        parentCommand,
        parameter,
        collection,
        entity,
      })).then((results) => {
        if (controller.signal.aborted || sequence !== this.providerSequence) return;
        const invalidCount = this.applyProviderResults(providerId, purpose, results);
        this.providerErrorsSignal.update((errors) => [
          ...errors.filter((error) => error.providerId !== providerId),
          ...(invalidCount ? [{
            providerId,
            message: `Se descartaron ${invalidCount} resultados no válidos`,
          }] : []),
        ]);
        this.ensureActiveResult();
      }).catch((error: unknown) => {
        if (controller.signal.aborted) return;
        this.providerErrorsSignal.update((errors) => [...errors.filter((candidate) => candidate.providerId !== providerId), {
          providerId,
          message: error instanceof Error ? error.message : 'No se pudo consultar el proveedor',
        }]);
      }).finally(() => {
        this.loadingProviderIdsSignal.update((ids) => {
          const next = new Set(ids);
          next.delete(providerId);
          return next;
        });
      });
    }, Math.max(0, delay));
    this.providerTimers.set(providerId, timer);
  }

  private applyProviderResults(
    providerId: string,
    purpose: AfCommandProviderPurpose,
    results: readonly AfCommandSearchProviderResult[],
  ): number {
    if (purpose === 'parameter') {
      const valid = results.filter(isParameterOption);
      this.providerOptionsSignal.set(valid);
      return results.length - valid.length;
    }
    if (purpose === 'collection') {
      const valid = results.filter(isEntity);
      const collection = this.collectionSignal();
      if (!collection) return results.length;
      const providerPriority = this.providerDefinition(providerId)?.priority ?? 0;
      const entities = valid.map((entity) => ({ ...entity, priority: (entity.priority ?? 0) + providerPriority }));
      for (const entity of entities) {
        this.providerOrigins.set(`entity:${collection.id}:${entity.id}`, providerId);
      }
      this.providerEntitiesSignal.update((current) => {
        const merged = [...current, ...entities];
        return [...new Map(merged.map((entity) => [entity.id, entity])).values()];
      });
      return results.length - valid.length;
    }
    {
      const providerPriority = this.configSignal().providers?.find((definition) => definition.id === providerId)?.priority ?? 0;
      const commands = results.filter(isCommandDefinition).map((command) => ({
        ...command,
        priority: (command.priority ?? 0) + providerPriority,
      }));
      for (const command of commands) this.providerOrigins.set(command.id, providerId);
      this.providerResultsSignal.update((current) => {
        const merged = [...current, ...commands];
        return [...new Map(merged.map((command) => [command.id, command])).values()];
      });
      return results.length - commands.length;
    }
  }

  private providerDefinition(providerId: string) {
    return this.configSignal().providers?.find((definition) => definition.id === providerId);
  }

  private scopedProviderIds(): ReadonlySet<string> {
    return new Set((this.configSignal().collections ?? []).flatMap((collection) => [
      ...(collection.providerId ? [collection.providerId] : []),
      ...(collection.actionsProviderId ? [collection.actionsProviderId] : []),
    ]));
  }

  private evaluationContext(): AfCommandContext {
    const collection = this.collectionSignal();
    const entity = this.entitySignal();
    return {
      ...this.contextSignal(),
      ...(collection ? { $collection: cloneJson(collection) as unknown as AfCommandJsonValue } : {}),
      ...(entity ? { $entity: cloneJson(entity) as unknown as AfCommandJsonValue } : {}),
    };
  }

  private matchCollectionActivator(rawQuery: string): {
    readonly collection: AfCommandCollectionDefinition;
    readonly query: string;
  } | null {
    const normalizedQuery = normalizeActivator(rawQuery);
    const context = this.evaluationContext();
    const collections = [...(this.configSignal().collections ?? [])]
      .filter((collection) => collection.activator
        && safeEvaluate(collection.when, context)
        && safeEvaluate(collection.enabledWhen, context))
      .sort((left, right) => right.activator!.length - left.activator!.length);
    for (const collection of collections) {
      const activator = normalizeActivator(collection.activator!);
      if (normalizedQuery === activator || normalizedQuery.startsWith(`${activator} `)) {
        return { collection, query: rawQuery.slice(collection.activator!.length).trimStart() };
      }
    }
    return null;
  }

  private ensureActiveResult(): void {
    const results = this.results();
    const current = results.find((result) => result.id === this.activeIdSignal() && !result.disabled);
    if (!current) this.activeIdSignal.set(results.find((result) => !result.disabled)?.id ?? null);
  }

  private parseFreeValue(
    parameter: AfCommandParameterDefinition,
    query: string,
  ): { readonly value?: AfCommandJsonValue; readonly error?: string } {
    if (!query) {
      return parameter.required ? { error: 'Este valor es obligatorio' } : { value: null };
    }
    if (parameter.type === 'number') {
      const value = Number(query);
      if (!Number.isFinite(value)) return { error: 'Introduce un número válido' };
      if (parameter.min !== undefined && value < parameter.min) return { error: `El mínimo es ${parameter.min}` };
      if (parameter.max !== undefined && value > parameter.max) return { error: `El máximo es ${parameter.max}` };
      return { value };
    }
    if (parameter.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(query)) {
      return { error: 'Usa el formato YYYY-MM-DD' };
    }
    if (parameter.minLength !== undefined && query.length < parameter.minLength) return { error: `Mínimo ${parameter.minLength} caracteres` };
    if (parameter.maxLength !== undefined && query.length > parameter.maxLength) return { error: `Máximo ${parameter.maxLength} caracteres` };
    if (parameter.pattern && !new RegExp(parameter.pattern).test(query)) return { error: 'El valor no cumple el formato requerido' };
    return { value: query };
  }

  private freeValueAsQuery(parameter: AfCommandParameterDefinition | null | undefined): string {
    if (!parameter || !['text', 'number', 'date'].includes(parameter.type)) return '';
    const value = this.parameterValuesSignal()[parameter.id] ?? parameter.defaultValue;
    return value === null || value === undefined ? '' : String(value);
  }

  private resetForConfig(): void {
    this.close();
    this.modeIdSignal.set(this.defaultModeId());
    this.loadHistory();
  }

  private defaultModeId(): string {
    const configured = this.configSignal().defaultMode;
    if (configured && this.modes().some((mode) => mode.id === configured)) return configured;
    return this.modes()[0]?.id ?? 'all';
  }

  private recordHistory(id: string): void {
    if (this.configSignal().history?.enabled === false) return;
    const now = Date.now();
    const current = this.historySignal().find((entry) => entry.id === id);
    const entries = [
      { id, count: (current?.count ?? 0) + 1, lastUsedAt: now },
      ...this.historySignal().filter((entry) => entry.id !== id),
    ].slice(0, this.configSignal().history?.maxEntries ?? 50);
    this.historySignal.set(entries);
    this.persistHistory();
  }

  private loadHistory(): void {
    if (!this.isBrowser || this.configSignal().history?.enabled === false) {
      this.historySignal.set([]);
      return;
    }
    try {
      const raw = this.document.defaultView?.localStorage.getItem(this.historyStorageKey());
      const parsed = raw ? JSON.parse(raw) as { version?: unknown; entries?: unknown } : null;
      const entries = parsed?.version === 1 && Array.isArray(parsed.entries)
        ? parsed.entries.filter(isHistoryEntry).slice(0, this.configSignal().history?.maxEntries ?? 50)
        : [];
      this.historySignal.set(entries);
    } catch {
      this.historySignal.set([]);
    }
  }

  private persistHistory(): void {
    if (!this.isBrowser || this.configSignal().history?.enabled === false) return;
    try {
      this.document.defaultView?.localStorage.setItem(this.historyStorageKey(), JSON.stringify({
        version: 1,
        entries: this.historySignal(),
      }));
    } catch {
      // Storage is an optional enhancement; privacy modes and quotas must not break commands.
    }
  }

  private historyStorageKey(): string {
    return this.configSignal().history?.storageKey ?? DEFAULT_STORAGE_KEY;
  }

  private cancelProviders(): void {
    for (const timer of this.providerTimers.values()) clearTimeout(timer);
    for (const controller of this.providerControllers.values()) controller.abort();
    this.providerTimers.clear();
    this.providerControllers.clear();
    this.loadingProviderIdsSignal.set(new Set());
    this.providerSequence += 1;
  }

  private onDocumentKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return;
    if (matchesKeybinding(event, this.configSignal().shortcut ?? 'Mod+K')) {
      event.preventDefault();
      this.openSignal() ? this.focusRequestSignal.update((value) => value + 1) : this.open();
      return;
    }
    const command = flattenAfCommands(this.configSignal().commands).find((candidate) =>
      candidate.keybinding && matchesKeybinding(event, candidate.keybinding)
      && safeEvaluate(candidate.when, this.contextSignal())
      && safeEvaluate(candidate.enabledWhen, this.contextSignal())
      && Boolean(
        candidate.children?.length
        || candidate.childrenProviderId
        || candidate.parameters?.length
        || (candidate.executorId && this.executors.has(candidate.executorId)),
      ),
    );
    if (!command) return;
    event.preventDefault();
    this.open();
    this.activateCommand(command);
  }

  private formatKeybinding(keybinding: string): string {
    const isMac = /Mac|iPhone|iPad/.test(this.document.defaultView?.navigator.platform ?? '');
    return keybinding
      .replace(/Mod/gi, isMac ? '⌘' : 'Ctrl')
      .replace(/Meta/gi, '⌘')
      .replace(/\+/g, isMac ? '' : '+');
  }

  private validationMessage(validation: AfCommandPaletteValidationResult): string {
    return `Configuración de AfCommandPalette no válida: ${validation.diagnostics.map((item) => `${item.path}: ${item.message}`).join('; ')}`;
  }
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

function normalizeActivator(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trimStart();
}

function fuzzyCommandScore(command: AfCommandDefinition, query: string): number {
  if (!query) return 0;
  const candidates = [
    [command.label, 1000],
    ...(command.keywords ?? []).map((keyword) => [keyword, 700] as const),
    [command.group ?? '', 350],
    [command.description ?? '', 250],
  ] as const;
  return Math.max(...candidates.map(([text, weight]) => {
    const score = fuzzyTextScore(text, query);
    return score < 0 ? -1 : score + weight;
  }));
}

function fuzzyCollectionScore(collection: AfCommandCollectionDefinition, query: string): number {
  if (!query) return 0;
  const candidates = [
    [collection.label, 1000],
    [collection.activator ?? '', 960],
    ...(collection.keywords ?? []).map((keyword) => [keyword, 700] as const),
    [collection.group ?? '', 350],
    [collection.description ?? '', 250],
  ] as const;
  return Math.max(...candidates.map(([text, weight]) => {
    const score = fuzzyTextScore(text, query);
    return score < 0 ? -1 : score + weight;
  }));
}

function fuzzyEntityScore(entity: AfCommandEntity, query: string): number {
  if (!query) return 0;
  const candidates = [
    [entity.label, 1000],
    ...(entity.keywords ?? []).map((keyword) => [keyword, 700] as const),
    ...(entity.metadata ?? []).map((metadata) => [metadata, 420] as const),
    [entity.group ?? '', 350],
    [entity.description ?? '', 250],
  ] as const;
  return Math.max(...candidates.map(([text, weight]) => {
    const score = fuzzyTextScore(text, query);
    return score < 0 ? -1 : score + weight;
  }));
}

function fuzzyTextScore(text: string, query: string): number {
  if (!query) return 0;
  const normalized = normalize(text);
  if (normalized === query) return 900;
  if (normalized.startsWith(query)) return 720 - Math.min(100, normalized.length - query.length);
  const included = normalized.indexOf(query);
  if (included >= 0) return 560 - included;
  let cursor = 0;
  let gaps = 0;
  for (const character of query) {
    const found = normalized.indexOf(character, cursor);
    if (found < 0) return -1;
    gaps += found - cursor;
    cursor = found + 1;
  }
  return 360 - gaps;
}

function safeEvaluate(expression: string | undefined, context: AfCommandContext): boolean {
  try {
    return evaluateAfCommandContextExpression(expression, context);
  } catch {
    return false;
  }
}

function matchesKeybinding(event: KeyboardEvent, keybinding: string): boolean {
  const parts = keybinding.split('+').map((part) => part.trim().toLocaleLowerCase());
  const key = parts.at(-1);
  const wantsMod = parts.includes('mod');
  const wantsCtrl = parts.includes('ctrl') || (wantsMod && !isMacEvent(event));
  const wantsMeta = parts.includes('meta') || (wantsMod && isMacEvent(event));
  return event.key.toLocaleLowerCase() === key
    && event.ctrlKey === wantsCtrl
    && event.metaKey === wantsMeta
    && event.altKey === parts.includes('alt')
    && event.shiftKey === parts.includes('shift');
}

function isMacEvent(event: KeyboardEvent): boolean {
  return /Mac|iPhone|iPad/.test(event.view?.navigator.platform ?? '');
}

function setContextPath(
  context: AfCommandContext,
  path: string,
  value: AfCommandJsonValue,
): AfCommandContext {
  const segments = path.split('.').filter(Boolean);
  if (!segments.length) return context;
  const root = structuredClone(context) as Record<string, AfCommandJsonValue>;
  let target = root;
  for (const segment of segments.slice(0, -1)) {
    const current = target[segment];
    if (!current || typeof current !== 'object' || Array.isArray(current)) target[segment] = {};
    target = target[segment] as Record<string, AfCommandJsonValue>;
  }
  target[segments.at(-1)!] = value;
  return root;
}

function assertWritableContextPath(path: string): void {
  const root = path.split('.')[0];
  if (root === '$collection' || root === '$entity') {
    throw new Error(`${root} es un path reservado de AfCommandPalette.`);
  }
}

function removeContextPath(context: AfCommandContext, path: string): AfCommandContext {
  const segments = path.split('.').filter(Boolean);
  if (!segments.length) return context;
  const root = structuredClone(context) as Record<string, AfCommandJsonValue>;
  let target: Record<string, AfCommandJsonValue> = root;
  for (const segment of segments.slice(0, -1)) {
    const current = target[segment];
    if (!current || typeof current !== 'object' || Array.isArray(current)) return root;
    target = current as Record<string, AfCommandJsonValue>;
  }
  delete target[segments.at(-1)!];
  return root;
}

function cloneJson<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function jsonKey(value: AfCommandJsonValue): string {
  return JSON.stringify(value);
}

function isCommandDefinition(value: AfCommandSearchProviderResult): value is AfCommandDefinition {
  return value !== null
    && typeof value === 'object'
    && !('kind' in value && value.kind === 'entity')
    && 'id' in value
    && typeof value.id === 'string'
    && 'label' in value
    && typeof value.label === 'string';
}

function isParameterOption(value: AfCommandSearchProviderResult): value is AfCommandParameterOption {
  return value !== null
    && typeof value === 'object'
    && 'value' in value
    && 'label' in value
    && typeof value.label === 'string';
}

function isEntity(value: AfCommandSearchProviderResult): value is AfCommandEntity {
  return value !== null
    && typeof value === 'object'
    && 'kind' in value
    && value.kind === 'entity'
    && 'id' in value
    && typeof value.id === 'string'
    && 'label' in value
    && typeof value.label === 'string';
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  return Boolean(value && typeof value === 'object'
    && typeof (value as HistoryEntry).id === 'string'
    && typeof (value as HistoryEntry).count === 'number'
    && typeof (value as HistoryEntry).lastUsedAt === 'number');
}
