import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import {
  AfThemeService,
  type AfChipSize,
  type AfChipTone,
  type AfChipVariant,
  type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-chip-desktop',
  imports: [AfIconComponent],
  templateUrl: './af-chip-desktop.component.html',
  styleUrl: './af-chip-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-chip-desktop',
    '[class]': 'hostClasses()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-removable]': 'removable() ? "" : null',
    '[attr.aria-label]': 'ariaLabel() ?? null',
  },
})
export class AfChipDesktopComponent {
  readonly tone = input<AfChipTone>('neutral');
  readonly variant = input<AfChipVariant>('soft');
  readonly size = input<AfChipSize>('sm');
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removeAriaLabel = input('Remove chip');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly removed = output<void>();

  protected readonly hostClasses = computed(() =>
    [
      'af-chip-desktop',
      `af-chip-desktop--${this.variant()}`,
      `af-chip-desktop--tone-${this.tone()}`,
      `af-chip-desktop--${this.size()}`,
    ].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }

  protected onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }
}