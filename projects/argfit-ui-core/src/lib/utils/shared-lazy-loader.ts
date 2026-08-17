export interface ɵSharedLazyLoader<T> {
  load(): Promise<T>;
  reset(): void;
}

interface SharedLazyLoaderState<T = unknown> {
  promise?: Promise<T>;
}

const REGISTRY_PROPERTY = '__argfitUiSharedLazyLoaders__';

function sharedRegistry(): Map<string, SharedLazyLoaderState> {
  const host = globalThis as typeof globalThis & {
    [REGISTRY_PROPERTY]?: Map<string, SharedLazyLoaderState>;
  };
  return (host[REGISTRY_PROPERTY] ??= new Map());
}

/** @internal Shares an in-flight lazy import without introducing that import in core. */
export function ɵcreateSharedLazyLoader<T>(
  key: string,
  importer: () => Promise<T>,
): ɵSharedLazyLoader<T> {
  const state = (sharedRegistry().get(key) ?? {}) as SharedLazyLoaderState<T>;
  sharedRegistry().set(key, state);

  return {
    load(): Promise<T> {
      state.promise ??= importer();
      return state.promise;
    },
    reset(): void {
      state.promise = undefined;
    },
  };
}
