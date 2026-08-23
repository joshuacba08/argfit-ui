import type { TemplateRef } from '@angular/core';

import type { AfAvatarShape } from './avatar.types';
import type { AfIconName } from './icon.types';

export type AfCommandJsonPrimitive = string | number | boolean | null;
export type AfCommandJsonValue =
  | AfCommandJsonPrimitive
  | readonly AfCommandJsonValue[]
  | { readonly [key: string]: AfCommandJsonValue };

export type AfCommandParameterType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'boolean'
  | 'confirm';

export interface AfCommandParameterOption {
  readonly value: AfCommandJsonValue;
  readonly label: string;
  readonly description?: string;
  readonly icon?: AfIconName;
  readonly disabled?: boolean;
}

export interface AfCommandParameterDefinition {
  readonly id: string;
  readonly type: AfCommandParameterType;
  readonly label: string;
  readonly description?: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly defaultValue?: AfCommandJsonValue;
  readonly options?: readonly AfCommandParameterOption[];
  readonly providerId?: string;
  readonly min?: number;
  readonly max?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
}

export interface AfCommandModeDefinition {
  readonly id: string;
  readonly label: string;
  readonly prefix?: string;
  readonly placeholder?: string;
}

export interface AfCommandDefinition {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly icon?: AfIconName;
  readonly keywords?: readonly string[];
  readonly modes?: readonly string[];
  readonly keybinding?: string;
  readonly priority?: number;
  readonly pinned?: boolean;
  readonly when?: string;
  readonly enabledWhen?: string;
  readonly disabledReason?: string;
  readonly executorId?: string;
  readonly payload?: AfCommandJsonValue;
  readonly parameters?: readonly AfCommandParameterDefinition[];
  readonly children?: readonly AfCommandDefinition[];
  readonly childrenProviderId?: string;
}

export interface AfCommandProviderDefinition {
  readonly id: string;
  readonly modes?: readonly string[];
  readonly minQueryLength?: number;
  readonly debounceMs?: number;
  readonly priority?: number;
}

export type AfCommandCollectionPresentation = 'entity-card' | 'compact';

export interface AfCommandEntityMedia {
  readonly imageSrc?: string;
  readonly initials?: string;
  readonly icon?: AfIconName;
  readonly shape?: AfAvatarShape;
}

export interface AfCommandEntity {
  readonly kind: 'entity';
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly keywords?: readonly string[];
  readonly priority?: number;
  readonly disabled?: boolean;
  readonly disabledReason?: string;
  readonly media?: AfCommandEntityMedia;
  readonly metadata?: readonly string[];
  readonly data?: AfCommandJsonValue;
}

export interface AfCommandCollectionDefinition {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly icon?: AfIconName;
  readonly keywords?: readonly string[];
  readonly modes?: readonly string[];
  readonly activator?: `@${string}`;
  readonly priority?: number;
  readonly showInRoot?: boolean;
  readonly when?: string;
  readonly enabledWhen?: string;
  readonly disabledReason?: string;
  readonly presentation?: AfCommandCollectionPresentation;
  readonly placeholder?: string;
  readonly emptyText?: string;
  readonly entities?: readonly AfCommandEntity[];
  readonly providerId?: string;
  readonly actions?: readonly AfCommandDefinition[];
  readonly actionsProviderId?: string;
}

export interface AfCommandPaletteHistoryConfig {
  readonly enabled?: boolean;
  readonly storageKey?: string;
  readonly maxEntries?: number;
}

export interface AfCommandPaletteLabels {
  readonly placeholder?: string;
  readonly emptyText?: string;
  readonly loadingText?: string;
  readonly ariaLabel?: string;
  readonly closeLabel?: string;
  readonly backLabel?: string;
  readonly retryLabel?: string;
  readonly unavailableText?: string;
}

export interface AfCommandPaletteConfig {
  readonly $schema?: string;
  readonly version: 1;
  readonly id: string;
  readonly shortcut?: string;
  readonly defaultMode?: string;
  readonly maxResults?: number;
  readonly showTrigger?: boolean;
  readonly labels?: AfCommandPaletteLabels;
  readonly history?: AfCommandPaletteHistoryConfig;
  readonly modes?: readonly AfCommandModeDefinition[];
  readonly commands: readonly AfCommandDefinition[];
  readonly collections?: readonly AfCommandCollectionDefinition[];
  readonly providers?: readonly AfCommandProviderDefinition[];
}

export interface AfCommandPaletteDiagnostic {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export interface AfCommandPaletteValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly AfCommandPaletteDiagnostic[];
}

export type AfCommandContext = Readonly<Record<string, AfCommandJsonValue>>;

export interface AfCommandExecutionContext {
  readonly command: AfCommandDefinition;
  readonly payload?: AfCommandJsonValue;
  readonly parameters: Readonly<Record<string, AfCommandJsonValue>>;
  readonly context: AfCommandContext;
  readonly collection?: AfCommandCollectionDefinition;
  readonly entity?: AfCommandEntity;
}

export type AfCommandExecutor = (
  context: AfCommandExecutionContext,
) => void | Promise<void>;

export type AfCommandExecutionEvent =
  | { readonly type: 'dispatch'; readonly context: AfCommandExecutionContext }
  | { readonly type: 'success'; readonly context: AfCommandExecutionContext }
  | { readonly type: 'error'; readonly context: AfCommandExecutionContext; readonly error: unknown };

export type AfCommandProviderPurpose =
  | 'search'
  | 'children'
  | 'parameter'
  | 'collection'
  | 'entity-actions';

export interface AfCommandSearchRequest {
  readonly query: string;
  readonly modeId: string;
  readonly context: AfCommandContext;
  readonly signal: AbortSignal;
  readonly purpose: AfCommandProviderPurpose;
  readonly parentCommand?: AfCommandDefinition;
  readonly parameter?: AfCommandParameterDefinition;
  readonly collection?: AfCommandCollectionDefinition;
  readonly entity?: AfCommandEntity;
}

export type AfCommandSearchProviderResult =
  | AfCommandDefinition
  | AfCommandParameterOption
  | AfCommandEntity;

export interface AfCommandSearchProvider {
  readonly search: (
    request: AfCommandSearchRequest,
  ) => readonly AfCommandSearchProviderResult[] | Promise<readonly AfCommandSearchProviderResult[]>;
}

export interface AfCommandPaletteResult {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly icon?: AfIconName;
  readonly keybinding?: string;
  readonly disabled?: boolean;
  readonly disabledReason?: string;
  /** Identifies the dynamic source when the result was contributed by a provider. */
  readonly providerId?: string;
  readonly command?: AfCommandDefinition;
  readonly collection?: AfCommandCollectionDefinition;
  readonly entity?: AfCommandEntity;
  readonly parameterValue?: AfCommandJsonValue;
  readonly syntheticKind?: 'parameter-continue' | 'parameter-option';
  readonly selected?: boolean;
  readonly score: number;
}

export interface AfCommandPaletteResultContext {
  readonly $implicit: AfCommandPaletteResult;
  readonly result: AfCommandPaletteResult;
  readonly resultIndex: number;
  readonly active: boolean;
  readonly query: string;
  readonly modeId: string;
  readonly collection?: AfCommandCollectionDefinition;
  readonly entity?: AfCommandEntity;
}

export type AfCommandPaletteResultTemplate = TemplateRef<AfCommandPaletteResultContext>;

export interface AfCommandPaletteEntityContext {
  readonly $implicit: AfCommandEntity;
  readonly entity: AfCommandEntity;
  readonly collection: AfCommandCollectionDefinition;
  readonly result: AfCommandPaletteResult;
  readonly resultIndex: number;
  readonly active: boolean;
  readonly query: string;
}

export type AfCommandPaletteEntityTemplate = TemplateRef<AfCommandPaletteEntityContext>;

export interface AfCommandPaletteProviderError {
  readonly providerId: string;
  readonly message: string;
}

export interface AfCommandPaletteBreadcrumb {
  readonly id: string;
  readonly label: string;
}

export interface AfCommandPaletteOpenOptions {
  readonly modeId?: string;
  readonly query?: string;
}

export type AfCommandPaletteNavigationIntent = 'next' | 'previous' | 'first' | 'last';
