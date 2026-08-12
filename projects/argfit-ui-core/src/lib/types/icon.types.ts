/**
 * Curated set of icon names supported by `<af-icon>`.
 *
 * Names use Lucide's kebab-case identifiers but the contract is owned by
 * ArgFit UI. The list stays bounded on purpose so the primitive ships a small
 * bundle and adopters get compile-time validation — but it has to be wide
 * enough that products don't fall back to hand-rolled SVG, which is exactly
 * what the primitive exists to prevent.
 *
 * Grouped by intent. When adding a name, add it to `AF_ICON_NAMES` below and to
 * the registry in `af-icon.component.ts`; the primitive's spec renders every
 * name and fails if one does not resolve.
 */
export type AfBuiltInIconName =
  // ── Navegación y dirección ──────────────────────────────────────────
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'external-link'
  | 'home'
  | 'menu'
  | 'more-horizontal'
  | 'more-vertical'
  // ── Acciones ────────────────────────────────────────────────────────
  | 'check'
  | 'check-square'
  | 'copy'
  | 'download'
  | 'edit'
  | 'filter'
  | 'move'
  | 'pause'
  | 'play'
  | 'plus'
  | 'refresh-cw'
  | 'repeat'
  | 'save'
  | 'search'
  | 'share-2'
  | 'trash'
  | 'undo-2'
  | 'upload'
  | 'x'
  // ── Estado y feedback ───────────────────────────────────────────────
  | 'alert-triangle'
  | 'bell'
  | 'circle-alert'
  | 'circle-check'
  | 'clock'
  | 'eye'
  | 'eye-off'
  | 'info'
  // ── Conectividad y dispositivo ──────────────────────────────────────
  | 'battery'
  | 'bluetooth'
  | 'cpu'
  | 'monitor'
  | 'wifi'
  | 'wifi-off'
  // ── Datos y visualización ───────────────────────────────────────────
  | 'activity'
  | 'bar-chart-3'
  | 'columns-3'
  | 'grid-2x2'
  | 'kanban'
  | 'layout-dashboard'
  | 'list'
  | 'panel-top'
  | 'pie-chart'
  | 'table'
  | 'target'
  | 'zap'
  // ── Contenido ───────────────────────────────────────────────────────
  | 'calendar'
  | 'calendar-days'
  | 'dumbbell'
  | 'file-text'
  | 'image'
  | 'map-pin'
  | 'stethoscope'
  | 'trophy'
  | 'video'
  // ── Identidad ───────────────────────────────────────────────────────
  | 'log-in'
  | 'log-out'
  | 'settings'
  | 'user'
  | 'users';

/**
 * Namespaced icon registered by an ArgFit icon provider.
 *
 * The namespace keeps third-party collections from colliding with ArgFit's
 * stable built-in names. Examples: `lucide:alarm-clock`, `hero:user`.
 */
export type AfExternalIconName = `${string}:${string}`;

/** Any built-in or explicitly registered icon accepted by `<af-icon>`. */
export type AfIconName = AfBuiltInIconName | AfExternalIconName;

/**
 * Every `AfIconName` as a runtime array.
 *
 * Exists so the primitive can assert in tests that each declared name resolves
 * to a real Lucide icon: a type union alone cannot catch a kebab-case typo, and
 * an unresolved name renders an empty `<svg>` instead of failing loudly.
 */
export const AF_ICON_NAMES: readonly AfBuiltInIconName[] = [
  'activity',
  'alert-triangle',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'bar-chart-3',
  'battery',
  'bell',
  'bluetooth',
  'calendar',
  'calendar-days',
  'check',
  'check-square',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'circle-alert',
  'circle-check',
  'clock',
  'columns-3',
  'copy',
  'cpu',
  'download',
  'dumbbell',
  'edit',
  'external-link',
  'eye',
  'eye-off',
  'file-text',
  'filter',
  'grid-2x2',
  'home',
  'image',
  'info',
  'kanban',
  'layout-dashboard',
  'list',
  'log-in',
  'log-out',
  'map-pin',
  'menu',
  'monitor',
  'more-horizontal',
  'more-vertical',
  'move',
  'panel-top',
  'pause',
  'pie-chart',
  'play',
  'plus',
  'refresh-cw',
  'repeat',
  'save',
  'search',
  'settings',
  'share-2',
  'stethoscope',
  'table',
  'target',
  'trash',
  'trophy',
  'undo-2',
  'upload',
  'user',
  'users',
  'video',
  'wifi',
  'wifi-off',
  'x',
  'zap',
];

/**
 * Visual scale presets for `<af-icon>`. Numbers in pixels per step.
 */
export type AfIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Semantic colour tone for an icon. Maps to ArgFit `--af-*` tokens.
 */
export type AfIconTone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
