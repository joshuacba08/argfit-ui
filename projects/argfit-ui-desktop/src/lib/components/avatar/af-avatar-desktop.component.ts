import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  AfThemeService,
  type AfAvatarShape,
  type AfAvatarSize,
  type AfAvatarTone,
  type AfIconName,
  type AfIconSize,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

const AF_AVATAR_ICON_SIZE_MAP: Record<AfAvatarSize, AfIconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

@Component({
  selector: 'af-avatar-desktop',
  imports: [AfIconComponent],
  templateUrl: './af-avatar-desktop.component.html',
  styleUrl: './af-avatar-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-avatar-desktop',
    '[class]': 'hostClasses()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.role]': 'accessibleLabel() ? "img" : null',
    '[attr.aria-label]': 'accessibleLabel() ?? null',
  },
})
export class AfAvatarDesktopComponent {
  readonly label = input<string | undefined>(undefined);
  readonly initials = input<string | undefined>(undefined);
  readonly imageSrc = input<string | undefined>(undefined);
  readonly imageAlt = input<string | undefined>(undefined);
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly size = input<AfAvatarSize>('md');
  readonly tone = input<AfAvatarTone>('neutral');
  readonly shape = input<AfAvatarShape>('circle');
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly accessibleLabel = computed(() => this.ariaLabel() ?? this.label() ?? this.imageAlt());
  protected readonly resolvedInitials = computed(() => resolveAvatarInitials(this.initials(), this.label()));
  protected readonly fallbackIcon = computed<AfIconName>(() => this.icon() ?? 'users');
  protected readonly iconSize = computed<AfIconSize>(() => AF_AVATAR_ICON_SIZE_MAP[this.size()]);
  protected readonly hostClasses = computed(() =>
    [
      'af-avatar-desktop',
      `af-avatar-desktop--${this.size()}`,
      `af-avatar-desktop--tone-${this.tone()}`,
      `af-avatar-desktop--shape-${this.shape()}`,
    ].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}

function resolveAvatarInitials(initials: string | undefined, label: string | undefined): string | null {
  const explicitInitials = initials?.trim();

  if (explicitInitials) {
    return explicitInitials.replace(/\s+/g, '').slice(0, 2).toUpperCase();
  }

  const normalizedLabel = label?.trim();

  if (!normalizedLabel) {
    return null;
  }

  const nameParts = normalizedLabel.split(/\s+/).filter(Boolean);

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0] ?? ''}${nameParts[1][0] ?? ''}`.toUpperCase() || null;
}