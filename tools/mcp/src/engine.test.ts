import { describe, expect, it } from 'vitest';

import { findComponent } from './catalog.js';
import { generateUsage, recommendComponents, searchComponents, validateUsage } from './engine.js';
import { loadCatalog } from './catalog.js';

const catalog = loadCatalog();

describe('ArgFit catalog engine', () => {
  it('indexes the complete documented adaptive API', () => {
    expect(catalog.components).toHaveLength(70);
    expect(catalog.components.filter((component) => component.status === 'legacy-undocumented')).toHaveLength(0);
    expect(catalog.components.filter((component) => component.status === 'documented')).toHaveLength(68);
    expect(catalog.components.filter((component) => component.status === 'experimental')).toHaveLength(2);
    expect(searchComponents(catalog, { query: 'accordion' })[0]?.component.name).toBe('AfAccordion');
  });

  it('groups generated imports by documented entry point', () => {
    const chart = findComponent(catalog, 'AfChart');
    expect(chart?.package).toBe('@argfit-ui/adaptive/chart');
    expect(chart?.importStatement).toBe(
      "import { AfChart } from '@argfit-ui/adaptive/chart';",
    );

    const usage = generateUsage(catalog, ['AfChart', 'AfButton']);
    expect(usage.imports).toBe(
      "import { AfButton } from '@argfit-ui/adaptive';\n" +
        "import { AfChart } from '@argfit-ui/adaptive/chart';",
    );
  });

  it('finds Select for searchable infinite-scroll intent in Spanish', () => {
    const results = searchComponents(catalog, {
      query: 'selector con búsqueda y carga por scroll',
    });
    expect(results[0]?.component.name).toBe('AfSelect');
    expect(results[0]?.component.api.outputs.some((output) => output.name === 'loadMore')).toBe(true);
  });

  it('finds CommandPalette for global Ctrl+K navigation intent', () => {
    const result = searchComponents(catalog, {
      query: 'paleta Ctrl K para rutas y acciones',
    })[0];
    expect(result?.component.name).toBe('AfCommandPalette');
    expect(result?.component.api.outputs.some((output) => output.name === 'itemSelected')).toBe(true);
  });

  it('recommends the authentication shell composition for onboarding', () => {
    const names = recommendComponents(catalog, 'pantalla de login y onboarding').map(
      (recommendation) => recommendation.component.name,
    );
    expect(names).toContain('AfAuthShell');
    expect(names).toContain('AfInput');
    expect(names).toContain('AfButton');
    expect(names).toContain('AfInlineMessage');
    expect(names).toContain('AfProgress');
  });

  it('never invents an example when a catalog entry lacks documentation', () => {
    const catalogWithUndocumentedComponent = {
      ...catalog,
      components: catalog.components.map((component) =>
        component.name === 'AfAccordion'
          ? {
              ...component,
              status: 'legacy-undocumented' as const,
              example: null,
              stories: [],
              docsUrl: null,
            }
          : component,
      ),
    };
    const historical = findComponent(catalogWithUndocumentedComponent, 'AfAccordion');
    expect(historical?.status).toBe('legacy-undocumented');
    const usage = generateUsage(catalogWithUndocumentedComponent, ['AfAccordion']);
    expect(usage.template).toBe('');
    expect(usage.warnings[0]).toContain('no usage example will be invented');
  });

  it('reports vendor leakage, raw colors, invalid inputs and accessibility gaps', () => {
    const diagnostics = validateUsage(
      catalog,
      `import { Button } from 'primeng/button';
      <af-input [invented]="true" style="color: #fff"></af-input>`,
    );
    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
      expect.arrayContaining(['AF001', 'AF003', 'AF006', 'AF008']),
    );
  });

  it('accepts valid adaptive usage and supported tokens', () => {
    const diagnostics = validateUsage(
      catalog,
      `<af-select label="Jugador" [options]="players" (valueChange)="selectPlayer($event)" style="color: var(--af-text-main)"></af-select>`,
    );
    expect(diagnostics).toEqual([]);
  });
});
