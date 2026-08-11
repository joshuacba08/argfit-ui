import { readFileSync } from 'node:fs';

import type { ArgfitCatalog, CatalogComponent, VersionNotice } from './types.js';

const catalogUrl = new URL('../argfit-catalog.json', import.meta.url);

export function loadCatalog(): ArgfitCatalog {
  const catalog = JSON.parse(readFileSync(catalogUrl, 'utf8')) as ArgfitCatalog;
  if (catalog.schemaVersion !== '1.0.0' || !Array.isArray(catalog.components)) {
    throw new Error('Unsupported or invalid ArgFit MCP catalog. Rebuild @argfit-ui/mcp.');
  }
  return catalog;
}

export function findComponent(catalog: ArgfitCatalog, identifier: string): CatalogComponent | undefined {
  const normalized = normalize(identifier);
  return catalog.components.find((component) =>
    [component.id, component.name, component.className, component.selector].some(
      (candidate) => normalize(candidate) === normalized,
    ),
  );
}

export function checkVersion(catalog: ArgfitCatalog, requested?: string): VersionNotice {
  const target = requested?.trim() || 'latest';
  const compatible = target === 'latest' || target === catalog.library.version;
  return {
    requested: target,
    available: catalog.library.version,
    compatible,
    message: compatible
      ? `Using ArgFit UI ${catalog.library.version}.`
      : `The server only contains ArgFit UI ${catalog.library.version}; it will not substitute API details for requested version ${target}.`,
  };
}

export function absoluteStorybookUrl(catalog: ArgfitCatalog, path: string | null, origin?: string): string | null {
  if (!path) return null;
  if (!origin) return path;
  return new URL(path, origin.endsWith('/') ? origin : `${origin}/`).toString();
}

export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
