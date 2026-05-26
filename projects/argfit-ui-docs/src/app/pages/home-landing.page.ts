import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
} from '@argfit-ui/adaptive';

import {
    PRODUCTIVE_COMPONENT_DOCS,
    PRODUCTIVE_COMPONENT_FAMILIES,
    PRODUCTIVE_ENTRY_POINTS,
    PRODUCTIVE_PACKAGE_GUIDES,
    PRODUCTIVE_VALIDATION_COMMANDS,
} from '../docs-data';

interface LandingHighlight {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
  readonly tone: 'primary' | 'accent' | 'success' | 'warning' | 'neutral';
}

interface LandingScenario {
  readonly title: string;
  readonly summary: string;
  readonly outcome: string;
}

interface LandingProofMetric {
  readonly value: string;
  readonly label: string;
  readonly detail: string;
}

interface LandingStripItem {
  readonly label: string;
  readonly detail: string;
}

interface LandingShellMetric {
  readonly label: string;
  readonly value: string;
  readonly trend: string;
}

interface LandingWorkflowColumn {
  readonly title: string;
  readonly count: string;
  readonly tone: 'primary' | 'accent' | 'success';
  readonly items: readonly string[];
}

interface LandingArchitectureStep {
  readonly title: string;
  readonly summary: string;
}

@Component({
  selector: 'app-home-landing-page',
  imports: [
    RouterLink,
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
  ],
  templateUrl: './home-landing.page.html',
  styleUrl: './home-landing.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLandingPageComponent {
  protected readonly proofMetrics: readonly LandingProofMetric[] = [
    {
      value: '52',
      label: 'stable components',
      detail: 'Forms, overlays, analytics, shell and workflow surfaces under one semantic language.',
    },
    {
      value: '5',
      label: 'package layers',
      detail: 'Clear architecture from vendor-agnostic runtime to adaptive orchestration and renderer internals.',
    },
    {
      value: '1',
      label: 'product contract',
      detail: 'A single adaptive contract across desktop density and touch-first execution.',
    },
  ];

  protected readonly trustStrip: readonly LandingStripItem[] = [
    {
      label: 'Framework, not wrappers',
      detail: 'ArgFit owns the contract, not the vendor components.',
    },
    {
      label: 'Enterprise-ready surfaces',
      detail: 'Dashboards, workflow, forms, overlays and data-heavy views.',
    },
    {
      label: 'Adaptive by design',
      detail: 'Desktop and mobile behavior paths without splitting the API.',
    },
    {
      label: 'Documentation as platform',
      detail: 'Landing, catalog, API, guides and release posture in a dedicated app.',
    },
  ];

  protected readonly highlights: readonly LandingHighlight[] = [
    {
      eyebrow: 'Adaptive contract',
      title: 'One semantic API across desktop and mobile',
      summary: 'Teams build product concepts once and let ArgFit decide how the renderer should behave for each platform.',
      bullets: [
        'Adaptive-first imports through @argfit-ui/adaptive',
        'Desktop density without a second component API',
        'Touch-first behavior paths without vendor branching',
      ],
      tone: 'primary',
    },
    {
      eyebrow: 'Vendor boundary',
      title: 'PrimeNG and Ionic stay internal',
      summary: 'The framework hides renderer details behind ArgFit-owned contracts so the application stays portable and coherent.',
      bullets: [
        'Core remains vendor-agnostic',
        'Desktop and mobile packages stay secondary',
        'Public APIs stay semantic and stable',
      ],
      tone: 'accent',
    },
    {
      eyebrow: 'System design',
      title: 'Token-driven theming and dark-first posture',
      summary: 'ArgFit is built for premium enterprise interfaces with design tokens, CSS variables and a focused visual language.',
      bullets: [
        'Dark-first visual baseline',
        'No hardcoded vendor selectors',
        'Theme and platform runtime at bootstrap',
      ],
      tone: 'success',
    },
    {
      eyebrow: 'Operational discipline',
      title: 'Release gates protect the contract',
      summary: 'The framework ships with architecture guards, build budgets and a production release check instead of visual improvisation.',
      bullets: ['release:production:check', 'Regression guard coverage', 'Monorepo build integrity'],
      tone: 'warning',
    },
  ];

  protected readonly scenarios: readonly LandingScenario[] = [
    {
      title: 'Dense desktop dashboards',
      summary: 'Analytics surfaces, data tables and shell navigation for staff-facing operational products.',
      outcome: 'High-signal views without exposing PrimeNG internals.',
    },
    {
      title: 'Touch-first task flows',
      summary: 'Mobile-friendly overlays, drawers, forms and segmented interactions that still speak the same API.',
      outcome: 'One framework across field and office contexts.',
    },
    {
      title: 'Workflow and hierarchy',
      summary: 'Kanban, tree, timeline and selection surfaces shaped for real product operations rather than toy demos.',
      outcome: 'Enterprise workflows stay inside the ArgFit design system.',
    },
  ];

  protected readonly shellMetrics: readonly LandingShellMetric[] = [
    { label: 'Runtime', value: 'Auto', trend: 'adaptive' },
    { label: 'Ready', value: '94%', trend: 'checks' },
    { label: 'Flow', value: '12', trend: 'boards' },
  ];

  protected readonly shellRail: readonly string[] = [
    'Adaptive shell',
    'Dense analytics',
    'Semantic forms',
    'Workflow board',
  ];

  protected readonly workflowColumns: readonly LandingWorkflowColumn[] = [
    {
      title: 'Queued',
      count: '08',
      tone: 'primary',
      items: ['Regional rollout', 'Device sync', 'Recovery review'],
    },
    {
      title: 'Active',
      count: '05',
      tone: 'accent',
      items: ['Shell adaptation', 'Field flow polish', 'Coach dashboard'],
    },
    {
      title: 'Validated',
      count: '11',
      tone: 'success',
      items: ['A11y baseline', 'Release gate', 'Theme runtime'],
    },
  ];

  protected readonly mobileMoments: readonly string[] = [
    'Same contract across drawer, dialog and task flows.',
    'Touch-first editing without forking the public API surface.',
    'Platform-aware rendering controlled by runtime, not app duplication.',
  ];

  protected readonly architectureSteps: readonly LandingArchitectureStep[] = [
    {
      title: 'Core owns runtime and tokens',
      summary: 'Theme, platform and shared types stay ArgFit-owned and vendor-agnostic.',
    },
    {
      title: 'Adaptive owns the app contract',
      summary: 'Applications import semantic surfaces instead of renderer-specific widgets.',
    },
    {
      title: 'Desktop and mobile stay internal',
      summary: 'PrimeNG and Ionic remain implementation details behind the framework boundary.',
    },
  ];

  protected readonly entryPoints = PRODUCTIVE_ENTRY_POINTS;
  protected readonly packageGuides = PRODUCTIVE_PACKAGE_GUIDES;
  protected readonly validationCommands = PRODUCTIVE_VALIDATION_COMMANDS.slice(0, 3);
  protected readonly featuredComponents = PRODUCTIVE_COMPONENT_DOCS.filter((component) =>
    new Set(['AfButton', 'AfDialog', 'AfDataTable', 'AfPageShell', 'AfKanban']).has(component.name),
  );
  protected readonly stableComponentCount = computed(() =>
    PRODUCTIVE_COMPONENT_FAMILIES.reduce((total, family) => total + family.components.length, 0),
  );
}
