import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
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
})
export class AfChipComponent {
  private readonly platform = inject(AfPlatformService);

  readonly tone = input<AfChipTone>('neutral');
  readonly variant = input<AfChipVariant>('soft');
  readonly size = input<AfChipSize>('sm');
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removeAriaLabel = input('Remove chip');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly removed = output<void>();

  protected readonly isMobile = this.platform.isMobile;

  protected onRemoved(): void {
    this.removed.emit();
  }
}
