/**
 * Curated set of icon names supported by `<af-icon>`.
 *
 * Names use Lucide's kebab-case identifiers but the contract is owned by
 * ArgFit UI. Keep the list intentionally small so the primitive can ship a
 * bounded bundle and so adopters benefit from compile-time validation.
 */
export type AfIconName =
  | 'activity'
  | 'alert-triangle'
  | 'arrow-down'
  | 'arrow-up'
  | 'bar-chart-3'
  | 'battery'
  | 'bell'
  | 'bluetooth'
  | 'calendar'
  | 'check'
  | 'check-square'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'circle-alert'
  | 'circle-check'
  | 'clock'
  | 'cpu'
  | 'download'
  | 'edit'
  | 'file-text'
  | 'filter'
  | 'grid-2x2'
  | 'home'
  | 'info'
  | 'kanban'
  | 'layout-dashboard'
  | 'menu'
  | 'monitor'
  | 'panel-top'
  | 'pie-chart'
  | 'play'
  | 'plus'
  | 'search'
  | 'settings'
  | 'table'
  | 'trash'
  | 'upload'
  | 'users'
  | 'zap'
  | 'x';

/**
 * Visual scale presets for `<af-icon>`. Numbers in pixels per step.
 */
export type AfIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Semantic colour tone for an icon. Maps to ArgFit `--af-*` tokens.
 */
export type AfIconTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';
