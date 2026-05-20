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
  | 'calendar'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'circle-alert'
  | 'circle-check'
  | 'clock'
  | 'download'
  | 'filter'
  | 'info'
  | 'menu'
  | 'plus'
  | 'search'
  | 'settings'
  | 'trash'
  | 'upload'
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
