import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import {
  AfPlatformService,
  type AfChipSize,
  type AfChipTone,
  type AfChipVariant,
  type AfIconName,
} from '@argfit-ui/core';
import { AfChipDesktopComponent } from '@argfit-ui/desktop';
import { AfChipMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-chip',
  imports: [AfChipDesktopComponent, AfChipMobileComponent, NgTemplateOutlet],
  templateUrl: './af-chip.component.html',
  styleUrl: './af-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-interactive]': 'isInteractive() ? "" : null',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.role]': 'isInteractive() ? "button" : null',
    '[attr.tabindex]': 'isInteractive() ? 0 : null',
    '[attr.aria-label]': 'isInteractive() ? (ariaLabel() ?? null) : null',
    '[attr.aria-pressed]': 'isInteractive() ? selected() : null',
    '(click)': 'onPressed($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class AfChipComponent {
  private readonly platform = inject(AfPlatformService);

  readonly tone = input<AfChipTone>('neutral');
  readonly variant = input<AfChipVariant>('soft');
  readonly size = input<AfChipSize>('sm');
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly removable = input(false, { transform: booleanAttribute });
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly removeAriaLabel = input('Remove chip');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly removed = output<void>();
  readonly pressed = output<MouseEvent | KeyboardEvent>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly isInteractive = computed(() => this.interactive() && !this.removable());

  protected onRemoved(): void {
    this.removed.emit();
  }

  protected onPressed(event: MouseEvent): void {
    if (this.isInteractive()) {
      this.pressed.emit(event);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isInteractive() || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }
    event.preventDefault();
    this.pressed.emit(event);
  }
}
