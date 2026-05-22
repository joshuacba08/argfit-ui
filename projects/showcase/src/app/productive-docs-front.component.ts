import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  AfBadge,
  AfCard,
  AfCardContentDirective,
  AfCardEyebrowDirective,
  AfCardFooterDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
} from '@argfit-ui/adaptive';

type ProductiveDocsTopicId = 'overview' | 'components' | 'api' | 'guides' | 'release';

interface ProductiveDocsTopic {
  readonly id: ProductiveDocsTopicId;
  readonly label: string;
  readonly summary: string;
}

interface ProductiveDocLink {
  readonly title: string;
  readonly path: string;
  readonly summary: string;
  readonly badge: string;
}

interface ProductiveFamilyGuide {
  readonly family: string;
  readonly summary: string;
  readonly usage: string;
  readonly a11y: string;
  readonly components: readonly string[];
}

interface ProductivePackageGuide {
  readonly name: string;
  readonly importPath: string;
  readonly purpose: string;
  readonly highlights: readonly string[];
}

interface ProductiveGuideCard {
  readonly title: string;
  readonly path: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

interface ProductiveReleaseAsset {
  readonly title: string;
  readonly path: string;
  readonly summary: string;
}

@Component({
  selector: 'app-productive-docs-front',
  imports: [
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
  ],
  templateUrl: './productive-docs-front.component.html',
  styleUrl: './productive-docs-front.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductiveDocsFrontComponent {
  protected readonly activeTopic = signal<ProductiveDocsTopicId>('overview');

  protected readonly topics: readonly ProductiveDocsTopic[] = [
    { id: 'overview', label: 'Overview', summary: 'Ruta de entrada a quickstart, componentes y contrato 1.0.' },
    { id: 'components', label: 'Components', summary: 'Familias estables, uso recomendado y notas de accesibilidad.' },
    { id: 'api', label: 'API', summary: 'Paquetes publicos, imports y limites del contrato.' },
    { id: 'guides', label: 'Guides', summary: 'Theming, enterprise posture, migration y a11y.' },
    { id: 'release', label: 'Release', summary: 'Scope, semver, release notes y quality gates.' },
  ];

  protected readonly primaryLinks: readonly ProductiveDocLink[] = [
    {
      title: 'Quickstart',
      path: 'docs/productive/quickstart.md',
      summary: 'Bootstrap, imports recomendados y validacion local del contrato productivo.',
      badge: 'start',
    },
    {
      title: 'Components',
      path: 'docs/productive/components.md',
      summary: 'Inventario estable con guidance de uso y notas de accesibilidad por componente.',
      badge: 'stable',
    },
    {
      title: 'API reference',
      path: 'docs/productive/api-reference.md',
      summary: 'Paquetes publicos, servicios, tipos y slot directives de 1.0.',
      badge: 'api',
    },
  ];

  protected readonly docLinks: readonly ProductiveDocLink[] = [
    ...this.primaryLinks,
    {
      title: 'Accessibility',
      path: 'docs/productive/accessibility.md',
      summary: 'Reglas transversales de teclado, foco, live regions y disclosure seguro.',
      badge: 'a11y',
    },
    {
      title: 'Theming',
      path: 'docs/productive/theming.md',
      summary: 'Runtime de tema, tokens y reglas de override sin acoplarse a vendor internals.',
      badge: 'theme',
    },
    {
      title: 'Enterprise readiness',
      path: 'docs/productive/enterprise-readiness.md',
      summary: 'Perfil productivo para data, forms, overlays, feedback y charts.',
      badge: 'ops',
    },
    {
      title: 'Migration beta/Beta+ -> 1.0',
      path: 'docs/productive/migration-beta-to-1-0.md',
      summary: 'Cambio de postura desde prerelease hacia contrato semver mayor congelado.',
      badge: 'migrate',
    },
    {
      title: 'Quality gates',
      path: 'docs/productive/quality-gates.md',
      summary: 'Gate obligatorio, budgets y expectativa de CI para la linea productiva.',
      badge: 'gate',
    },
    {
      title: 'Release notes',
      path: 'docs/productive/release-notes-1-0.md',
      summary: 'Resumen del target 1.0 y de la base de hardening que lo sostiene.',
      badge: 'release',
    },
  ];

  protected readonly componentFamilies: readonly ProductiveFamilyGuide[] = [
    {
      family: 'Foundation and base composition',
      summary: 'Superficies base para acciones, layout semantico, input y shell.',
      usage: 'Usa estas piezas para estructurar dashboards, formularios y flujos de confirmacion antes de ir a familias mas especializadas.',
      a11y: 'Preserva landmarks, etiquetas de input, foco inicial y foco de retorno cuando el flujo abre dialogos.',
      components: ['AfButton', 'AfCard', 'AfDialog', 'AfInput', 'AfPageShell'],
    },
    {
      family: 'Analytics, feedback and status',
      summary: 'Resumen numerico, estados visuales y feedback transitorio o persistente.',
      usage: 'Combina estas piezas para dashboards operativos y confirmaciones post-accion sin filtrar semanticas vendor.',
      a11y: 'Usa inline message para errores persistentes y reserva toast/live region para cambios de estado breves o globales.',
      components: ['AfAnalyticsCard', 'AfBadge', 'AfChip', 'AfInlineMessage', 'AfMetricCard', 'AfProgress', 'AfToast', 'AfToastViewport'],
    },
    {
      family: 'Overlay and identity',
      summary: 'Disclosure contextual, paneles secundarios y superficies de identidad o ownership.',
      usage: 'Drawer y dialog son para tareas completas; popover y tooltip solo para contexto ligero; avatar resuelve ownership y presencia.',
      a11y: 'No escondas informacion critica detras de hover; dialog/drawer deben mantener escape, trap y retorno de foco.',
      components: ['AfAvatar', 'AfDrawer', 'AfPopover', 'AfTooltip'],
    },
    {
      family: 'Forms and selection',
      summary: 'Controles productivos para captura, eleccion y composicion de campos.',
      usage: 'Prefiere etiquetas claras, estados de error locales y presentaciones mobile de tipo sheet o drawer para flujos densos.',
      a11y: 'Mantiene relaciones label-hint-error, evita affordances hover-only y conserva botones nativos para reveal, clear o dismiss.',
      components: ['AfCheckbox', 'AfDatePicker', 'AfField', 'AfFieldset', 'AfIconField', 'AfInputCount', 'AfInputGroup', 'AfListbox', 'AfMultiSelect', 'AfPassword', 'AfRadioGroup', 'AfSegmentedControl', 'AfSelect', 'AfTextarea', 'AfToggle'],
    },
    {
      family: 'Data, hierarchy and workflow',
      summary: 'Vistas para lectura densa, operacion guiada y estructura jerarquica.',
      usage: 'Mantiene paginas acotadas, preagrega datos costosos y decide en la app el siguiente estado de eventos como sort, move o paginate.',
      a11y: 'Conserva activacion por teclado, degradacion mobile a lista o resumen y alternativas no drag para workflows movibles.',
      components: ['AfChart', 'AfDataTable', 'AfDataView', 'AfKanban', 'AfOrderList', 'AfOrganizationChart', 'AfPaginator', 'AfPickList', 'AfTimeline', 'AfTree', 'AfTreeTable', 'AfVirtualScroller'],
    },
    {
      family: 'Layout and navigation',
      summary: 'Organizacion progresiva de paneles, tabs, steppers y toolbars.',
      usage: 'Usa estas superficies para dividir tareas largas o densas sin romper el contrato adaptive-first del shell.',
      a11y: 'Expone estados activos, orden de foco predecible y texto visible suficiente cuando una accion cambia panel o paso.',
      components: ['AfAccordion', 'AfDivider', 'AfPanel', 'AfScrollPanel', 'AfSplitter', 'AfStepper', 'AfTabs', 'AfToolbar'],
    },
  ];

  protected readonly packageGuides: readonly ProductivePackageGuide[] = [
    {
      name: '@argfit-ui/core',
      importPath: '@argfit-ui/core',
      purpose: 'Bootstrap, theme runtime, platform runtime, toast service y tipos compartidos.',
      highlights: ['provideArgfitUi', 'AfThemeService', 'AfPlatformService', 'AfToastService', 'ArgFit-owned type families'],
    },
    {
      name: '@argfit-ui/primitives',
      importPath: '@argfit-ui/primitives',
      purpose: 'A11y y building blocks vendor-agnostic de bajo nivel.',
      highlights: ['AfVisuallyHiddenComponent', 'AfFocusTrapDirective', 'AfFocusInitialDirective', 'AfEscapeKeyDirective', 'AfIconComponent'],
    },
    {
      name: '@argfit-ui/adaptive',
      importPath: '@argfit-ui/adaptive',
      purpose: 'Camino recomendado para aplicaciones: componentes semantic-first que eligen renderer segun plataforma.',
      highlights: ['Foundation components', 'Feedback and overlays', 'Forms and selection', 'Data and workflow', 'Layout and navigation'],
    },
    {
      name: '@argfit-ui/desktop',
      importPath: '@argfit-ui/desktop',
      purpose: 'Superficies desktop especificas para integraciones intencionales, no como default de app.',
      highlights: ['PrimeNG remains internal', 'Renderer-specific opt-in', 'Useful for infrastructure examples', 'Secondary to adaptive path'],
    },
    {
      name: '@argfit-ui/mobile',
      importPath: '@argfit-ui/mobile',
      purpose: 'Superficies mobile especificas para integraciones intencionales y pruebas dirigidas.',
      highlights: ['Ionic remains internal', 'Touch-first renderer path', 'Secondary to adaptive path', 'Do not mix with unscoped imports'],
    },
  ];

  protected readonly guideCards: readonly ProductiveGuideCard[] = [
    {
      title: 'Theming and runtime',
      path: 'docs/productive/theming.md',
      summary: 'Arranque de tema, preferencias de plataforma y reglas de override a nivel app.',
      bullets: ['Dark and light shipped themes', 'Token-first overrides', 'No vendor selector dependency'],
    },
    {
      title: 'Accessibility posture',
      path: 'docs/productive/accessibility.md',
      summary: 'Foco, keyboard, live regions y disclosure seguro para el contrato 1.0.',
      bullets: ['WCAG AA posture', 'Dialog and drawer focus rules', 'Feedback severity semantics'],
    },
    {
      title: 'Enterprise readiness',
      path: 'docs/productive/enterprise-readiness.md',
      summary: 'Criterio productivo para tablas densas, forms complejos, overlays y analytics.',
      bullets: ['Server-side pagination posture', 'App-level overlay rules', 'Prepared insight for charts'],
    },
    {
      title: 'Migration',
      path: 'docs/productive/migration-beta-to-1-0.md',
      summary: 'Paso desde beta y Beta+ a un major semver estable con la misma filosofia adaptive.',
      bullets: ['No vendor pivot', 'Experimental category disappears', 'Version alignment remains mandatory'],
    },
    {
      title: 'Quality gates',
      path: 'docs/productive/quality-gates.md',
      summary: 'Contrato operativo que mantiene el frente productivo honesto.',
      bullets: ['release:production:check', 'Performance budgets', 'CI artifact expectations'],
    },
  ];

  protected readonly releaseAssets: readonly ProductiveReleaseAsset[] = [
    {
      title: '1.0 scope',
      path: 'docs/productive/scope.md',
      summary: 'Que entra, que queda fuera y que se congela en 1.0.x.',
    },
    {
      title: 'Public API inventory',
      path: 'docs/productive/public-api.md',
      summary: 'Fuente de verdad del contrato publico congelado por barrel.',
    },
    {
      title: 'Semver policy',
      path: 'docs/productive/semver-policy.md',
      summary: 'Reglas para patch, minor, major, deprecations y migraciones futuras.',
    },
    {
      title: 'Release notes',
      path: 'docs/productive/release-notes-1-0.md',
      summary: 'Resumen del target 1.0 y del endurecimiento tecnico que lo soporta.',
    },
    {
      title: 'Release gate',
      path: 'docs/productive/quality-gates.md',
      summary: 'Gate productivo obligatorio antes de cualquier tag o publish final.',
    },
  ];

  protected readonly stableComponentCount = computed(() =>
    this.componentFamilies.reduce((total, family) => total + family.components.length, 0),
  );

  protected readonly bootstrapExample = [
    "import { ApplicationConfig } from '@angular/core';",
    "import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    '    provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: \'auto\' }),',
    '  ],',
    '};',
  ].join('\n');

  protected readonly adaptiveExample = [
    "import { AfButton, AfCard, AfCardContentDirective, AfCardHeaderDirective, AfCardTitleDirective } from '@argfit-ui/adaptive';",
    '',
    '<af-card variant="panel" tone="primary">',
    '  <header afCardHeader>',
    '    <h2 afCardTitle>Productive dashboard</h2>',
    '  </header>',
    '  <div afCardContent>',
    '    <af-button>Ship 1.0</af-button>',
    '  </div>',
    '</af-card>',
  ].join('\n');

  protected setTopic(topic: ProductiveDocsTopicId): void {
    this.activeTopic.set(topic);
  }
}