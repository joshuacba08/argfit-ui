import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  ViewEncapsulation,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  LucideActivity,
  LucideAlertTriangle,
  LucideArrowDown,
  LucideArrowLeft,
  LucideArrowRight,
  LucideArrowUp,
  LucideBarChart3,
  LucideBattery,
  LucideBell,
  LucideBluetooth,
  LucideCalendar,
  LucideCalendarDays,
  LucideCheck,
  LucideCheckSquare,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronUp,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClock,
  LucideColumns3,
  LucideCopy,
  LucideCpu,
  LucideDownload,
  LucideDumbbell,
  LucideDynamicIcon,
  LucideEdit,
  LucideExternalLink,
  LucideEye,
  LucideEyeOff,
  LucideFileText,
  LucideFilter,
  LucideGrid2X2,
  LucideHome,
  LucideImage,
  LucideInfo,
  LucideKanban,
  LucideLayoutDashboard,
  LucideList,
  LucideLogIn,
  LucideLogOut,
  LucideMapPin,
  LucideMaximize,
  LucideMenu,
  LucideMinimize,
  LucideMonitor,
  LucideMoreHorizontal,
  LucideMoreVertical,
  LucideMove,
  LucidePanelTop,
  LucidePause,
  LucidePieChart,
  LucidePlay,
  LucidePlus,
  LucideRefreshCw,
  LucideRepeat,
  LucideSave,
  LucideSearch,
  LucideSettings,
  LucideShare2,
  LucideStethoscope,
  LucideTable,
  LucideTarget,
  LucideTrash,
  LucideTrophy,
  LucideUndo2,
  LucideUpload,
  LucideUser,
  LucideUsers,
  LucideVideo,
  LucideWifi,
  LucideWifiOff,
  LucideX,
  LucideZap,
  isLucideIconComponent,
  type LucideIcon,
  type LucideIconData,
} from '@lucide/angular';

import {
  AF_ICON_NAMES,
  type AfBuiltInIconName,
  type AfIconName,
  type AfIconSize,
  type AfIconTone,
} from '@argfit-ui/core';

import { AF_ICON_REGISTRATIONS, type AfIconRegistration } from './af-icon.providers';

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
  LucideArrowLeft,
  LucideArrowRight,
  LucideArrowUp,
  LucideBarChart3,
  LucideBattery,
  LucideBell,
  LucideBluetooth,
  LucideCalendar,
  LucideCalendarDays,
  LucideCheck,
  LucideCheckSquare,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronUp,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClock,
  LucideColumns3,
  LucideCopy,
  LucideCpu,
  LucideDownload,
  LucideDumbbell,
  LucideEdit,
  LucideExternalLink,
  LucideEye,
  LucideEyeOff,
  LucideFileText,
  LucideFilter,
  LucideGrid2X2,
  LucideHome,
  LucideImage,
  LucideInfo,
  LucideKanban,
  LucideLayoutDashboard,
  LucideList,
  LucideLogIn,
  LucideLogOut,
  LucideMapPin,
  LucideMaximize,
  LucideMenu,
  LucideMinimize,
  LucideMonitor,
  LucideMoreHorizontal,
  LucideMoreVertical,
  LucideMove,
  LucidePanelTop,
  LucidePause,
  LucidePieChart,
  LucidePlay,
  LucidePlus,
  LucideRefreshCw,
  LucideRepeat,
  LucideSave,
  LucideSearch,
  LucideSettings,
  LucideShare2,
  LucideStethoscope,
  LucideTable,
  LucideTarget,
  LucideTrash,
  LucideTrophy,
  LucideUndo2,
  LucideUpload,
  LucideUser,
  LucideUsers,
  LucideVideo,
  LucideWifi,
  LucideWifiOff,
  LucideX,
  LucideZap,
];

const AF_BUILT_IN_ICONS = new Map<AfBuiltInIconName, LucideIconData>(
  AF_ICON_NAMES.map((name, index) => {
    const icon = AF_ICON_REGISTRY[index];
    if (!icon) {
      throw new Error(`[ArgFit UI] Built-in icon "${name}" has no Lucide definition.`);
    }

    const data = isLucideIconComponent(icon) ? icon.icon : icon;
    if (data.name !== name && !data.aliases?.includes(name)) {
      throw new Error(
        `[ArgFit UI] Built-in icon "${name}" is paired with Lucide "${data.name}".`,
      );
    }

    return [name, data] as const;
  }),
);

if (AF_ICON_REGISTRY.length !== AF_ICON_NAMES.length) {
  throw new Error('[ArgFit UI] The built-in icon names and Lucide registry are out of sync.');
}

const AF_ICON_SIZE_PX: Record<AfIconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const AF_ICON_TONE_VAR: Record<AfIconTone, string> = {
  default: 'currentColor',
  muted: 'var(--af-text-muted)',
  primary: 'var(--af-primary)',
  success: 'var(--af-success)',
  warning: 'var(--af-warning)',
  danger: 'var(--af-danger)',
};

@Component({
  selector: 'af-icon',
  standalone: true,
  imports: [LucideDynamicIcon, NgIcon],
  template: `
    @if (resolvedIcon(); as resolved) {
      @if (resolved.kind === 'lucide') {
        <svg
          [lucideIcon]="resolved.icon"
          [size]="px()"
          [strokeWidth]="strokeWidth() ?? 2"
          [color]="color()"
          [title]="decorative() ? null : (ariaLabel() ?? null)"
          [attr.role]="decorative() ? null : 'img'"
          [attr.focusable]="false"
        ></svg>
      } @else {
        <ng-icon
          [svg]="resolved.svg"
          [size]="ngSize()"
          [color]="color()"
          [strokeWidth]="strokeWidth() ?? 2"
          [attr.role]="decorative() ? null : 'img'"
          [attr.aria-label]="decorative() ? null : (ariaLabel() ?? null)"
          [attr.aria-hidden]="decorative()"
          [attr.focusable]="false"
        />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
      .af-icon ng-icon {
        display: inline-flex;
        height: 100%;
        line-height: 0;
        width: 100%;
      }
    `,
  ],
})
export class AfIconComponent {
  private readonly registrationSets = inject(AF_ICON_REGISTRATIONS);
  private readonly externalIcons = this.createExternalRegistry(this.registrationSets);

  readonly name = input.required<AfIconName>();
  readonly size = input<AfIconSize>('md');
  readonly tone = input<AfIconTone>('default');
  readonly strokeWidth = input<number | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly decorative = input(true, { transform: booleanAttribute });

  protected readonly px = computed<number>(() => AF_ICON_SIZE_PX[this.size()]);
  protected readonly ngSize = computed<string>(() => `${this.px()}px`);
  protected readonly color = computed<string>(() => AF_ICON_TONE_VAR[this.tone()]);
  protected readonly resolvedIcon = computed<AfIconRegistration | undefined>(() => {
    const name = this.name();
    if (!name.includes(':')) {
      const icon = AF_BUILT_IN_ICONS.get(name as AfBuiltInIconName);
      return icon ? { kind: 'lucide', name: `lucide:${name}`, icon } : undefined;
    }

    return this.externalIcons.get(name);
  });

  constructor() {
    effect(() => {
      if (isDevMode() && !this.resolvedIcon()) {
        console.warn(
          `[ArgFit UI] Icon "${this.name()}" is not registered. ` +
            'Register external icons with provideAfLucideIcons() or provideAfNgIcons().',
        );
      }
    });
  }

  private createExternalRegistry(
    sets: readonly (readonly AfIconRegistration[])[],
  ): ReadonlyMap<AfIconName, AfIconRegistration> {
    const registry = new Map<AfIconName, AfIconRegistration>();

    for (const registration of sets.flat()) {
      if (registry.has(registration.name)) {
        throw new Error(`[ArgFit UI] Icon "${registration.name}" was registered more than once.`);
      }
      registry.set(registration.name, registration);
    }

    return registry;
  }
}
