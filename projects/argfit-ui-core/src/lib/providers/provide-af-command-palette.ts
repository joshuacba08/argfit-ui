import {
  InjectionToken,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';

import type {
  AfCommandExecutor,
  AfCommandPaletteConfig,
  AfCommandSearchProvider,
} from '../types/command-palette.types';

export interface AfCommandExecutorRegistration {
  readonly id: string;
  readonly executor: AfCommandExecutor;
}

export interface AfCommandSearchProviderRegistration {
  readonly id: string;
  readonly provider: AfCommandSearchProvider;
}

export const AF_COMMAND_PALETTE_CONFIG = new InjectionToken<AfCommandPaletteConfig>(
  'AF_COMMAND_PALETTE_CONFIG',
  { providedIn: 'root', factory: () => ({ version: 1, id: 'default', commands: [] }) },
);

export const AF_COMMAND_EXECUTORS = new InjectionToken<readonly AfCommandExecutorRegistration[]>(
  'AF_COMMAND_EXECUTORS',
  { providedIn: 'root', factory: () => [] },
);

export const AF_COMMAND_SEARCH_PROVIDERS = new InjectionToken<readonly AfCommandSearchProviderRegistration[]>(
  'AF_COMMAND_SEARCH_PROVIDERS',
  { providedIn: 'root', factory: () => [] },
);

export function provideAfCommandPalette(config: AfCommandPaletteConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: AF_COMMAND_PALETTE_CONFIG, useValue: config }]);
}

export function provideAfCommandExecutor(
  id: string,
  factory: () => AfCommandExecutor,
): EnvironmentProviders {
  return makeEnvironmentProviders([{
    provide: AF_COMMAND_EXECUTORS,
    multi: true,
    useFactory: (): AfCommandExecutorRegistration => ({ id, executor: factory() }),
  }]);
}

export function provideAfCommandSearchProvider(
  id: string,
  factory: () => AfCommandSearchProvider,
): EnvironmentProviders {
  return makeEnvironmentProviders([{
    provide: AF_COMMAND_SEARCH_PROVIDERS,
    multi: true,
    useFactory: (): AfCommandSearchProviderRegistration => ({ id, provider: factory() }),
  }]);
}
