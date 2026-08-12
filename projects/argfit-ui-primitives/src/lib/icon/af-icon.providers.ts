import { InjectionToken, type Provider } from '@angular/core';
import { isLucideIconComponent, type LucideIcon, type LucideIconData } from '@lucide/angular';

import type { AfExternalIconName } from '@argfit-ui/core';

export interface AfLucideIconRegistration {
  readonly kind: 'lucide';
  readonly name: AfExternalIconName;
  readonly icon: LucideIconData;
}

export interface AfNgIconRegistration {
  readonly kind: 'ng-icon';
  readonly name: AfExternalIconName;
  readonly svg: string;
}

export type AfIconRegistration = AfLucideIconRegistration | AfNgIconRegistration;

/** @internal Multi-token consumed by `AfIconComponent`. */
export const AF_ICON_REGISTRATIONS = new InjectionToken<readonly AfIconRegistration[][]>(
  'AF_ICON_REGISTRATIONS',
  { factory: () => [] },
);

function registrationProvider(registrations: readonly AfIconRegistration[]): Provider {
  return {
    provide: AF_ICON_REGISTRATIONS,
    multi: true,
    useValue: registrations,
  };
}

function assertSegment(value: string, label: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(
      `[ArgFit UI] Invalid ${label} "${value}". Use lowercase kebab-case without colons.`,
    );
  }
}

/**
 * Registers individually imported Lucide icons under the `lucide:*` namespace.
 * Only the supplied icons become reachable and therefore remain tree-shakeable.
 */
export function provideAfLucideIcons(...icons: readonly (LucideIcon | LucideIconData)[]): Provider {
  const registrations: AfLucideIconRegistration[] = [];

  for (const icon of icons) {
    const data = isLucideIconComponent(icon) ? icon.icon : icon;
    registrations.push({ kind: 'lucide', name: `lucide:${data.name}`, icon: data });

    for (const alias of data.aliases ?? []) {
      registrations.push({ kind: 'lucide', name: `lucide:${alias}`, icon: data });
    }
  }

  return registrationProvider(registrations);
}

/**
 * Adapts SVG definitions imported from any `@ng-icons/*` package.
 *
 * Consumers choose short, stable names instead of leaking a pack's export
 * naming convention into templates.
 */
export function provideAfNgIcons(
  namespace: string,
  icons: Readonly<Record<string, string>>,
): Provider {
  assertSegment(namespace, 'icon namespace');

  const registrations = Object.entries(icons).map<AfNgIconRegistration>(([name, svg]) => {
    assertSegment(name, 'icon name');
    if (!svg.trim().startsWith('<svg')) {
      throw new Error(`[ArgFit UI] Icon "${namespace}:${name}" is not an SVG definition.`);
    }

    return { kind: 'ng-icon', name: `${namespace}:${name}`, svg };
  });

  return registrationProvider(registrations);
}
