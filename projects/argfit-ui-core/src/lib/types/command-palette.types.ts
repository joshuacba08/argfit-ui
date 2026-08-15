import type { TemplateRef } from '@angular/core';

import type { AfIconName } from './icon.types';

export type AfCommandPaletteSearchMode = 'client' | 'server';

export type AfCommandPaletteItemKind = 'action' | 'navigation' | 'result';

export interface AfCommandPaletteItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly kind?: AfCommandPaletteItemKind;
  readonly icon?: AfIconName;
  readonly keywords?: readonly string[];
  readonly shortcut?: string;
  readonly href?: string;
  readonly disabled?: boolean;
  readonly disabledReason?: string;
  readonly data?: unknown;
}

export interface AfCommandPaletteItemContext {
  readonly $implicit: AfCommandPaletteItem;
  readonly item: AfCommandPaletteItem;
  readonly itemIndex: number;
  readonly active: boolean;
  readonly query: string;
}

export type AfCommandPaletteItemTemplate = TemplateRef<AfCommandPaletteItemContext>;
