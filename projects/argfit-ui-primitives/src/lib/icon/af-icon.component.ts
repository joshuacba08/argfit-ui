import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import {
    LucideActivity,
    LucideAlertTriangle,
    LucideArrowDown,
    LucideArrowUp,
    LucideCalendar,
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronUp,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideClock,
    LucideDownload,
    LucideDynamicIcon,
    LucideFilter,
    LucideInfo,
    LucideMenu,
    LucidePlus,
    LucideSearch,
    LucideSettings,
    LucideTrash,
    LucideUpload,
    LucideX,
    provideLucideIcons,
    type LucideIcon,
} from '@lucide/angular';

import type { AfIconName, AfIconSize, AfIconTone } from '@argfit-ui/core';

/**
 * Registry of every Lucide icon exposed through the ArgFit `AfIconName` type.
 *
 * Listed explicitly so tree-shaking can prune the rest of the Lucide bundle
 * and so the registry stays auditable. Add to both this map and
 * `AfIconName` when a new icon is needed.
 */
const AF_ICON_REGISTRY: readonly LucideIcon[] = [
  LucideActivity,
  LucideAlertTriangle,
  LucideArrowDown,
  LucideArrowUp,
  LucideCalendar,
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronUp,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClock,
  LucideDownload,
  LucideFilter,
  LucideInfo,
  LucideMenu,
  LucidePlus,
  LucideSearch,
  LucideSettings,
  LucideTrash,
  LucideUpload,
  LucideX,
];

const AF_ICON_SIZE_PX: Record<AfIconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const AF_ICON_TONE_VAR: Record<AfIconTone, string> = {
  default: 'var(--af-text-main)',
  muted: 'var(--af-text-muted)',
  primary: 'var(--af-primary)',
  success: 'var(--af-success)',
  warning: 'var(--af-warning)',
  danger: 'var(--af-danger)',
};

@Component({
  selector: 'af-icon',
  standalone: true,
  imports: [LucideDynamicIcon],
  template: `
    <svg
      [lucideIcon]="name()"
      [size]="px()"
      [strokeWidth]="strokeWidth() ?? 2"
      [color]="color()"
      [title]="decorative() ? null : ariaLabel() ?? null"
      [attr.role]="decorative() ? null : 'img'"
      [attr.focusable]="false"
    ></svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [provideLucideIcons(...AF_ICON_REGISTRY)],
  host: {
    class: 'af-icon',
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'tone()',
    '[style.--af-icon-size.px]': 'px()',
    '[style.color]': 'color()',
  },
  styles: [
    `
      .af-icon {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        height: var(--af-icon-size, 16px);
        justify-content: center;
        line-height: 0;
        width: var(--af-icon-size, 16px);
      }
      .af-icon svg {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class AfIconComponent {
  readonly name = input.required<AfIconName>();
  readonly size = input<AfIconSize>('md');
  readonly tone = input<AfIconTone>('default');
  readonly strokeWidth = input<number | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly decorative = input(true, { transform: booleanAttribute });

  protected readonly px = computed<number>(() => AF_ICON_SIZE_PX[this.size()]);
  protected readonly color = computed<string>(() => AF_ICON_TONE_VAR[this.tone()]);
}
