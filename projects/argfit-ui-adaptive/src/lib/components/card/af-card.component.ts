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
    type AfCardDensity,
    type AfCardTone,
    type AfCardVariant,
} from '@argfit-ui/core';
import { AfCardDesktopComponent } from '@argfit-ui/desktop';
import { AfCardMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-card',
  imports: [AfCardDesktopComponent, AfCardMobileComponent, NgTemplateOutlet],
  templateUrl: './af-card.component.html',
  styleUrl: './af-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfCardComponent {
  private readonly platform = inject(AfPlatformService);

  readonly variant = input<AfCardVariant>('surface');
  readonly density = input<AfCardDensity>('comfortable');
  readonly tone = input<AfCardTone>('neutral');
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly pressed = output<Event>();

  protected readonly isMobile = this.platform.isMobile;

  protected onClick(event: MouseEvent): void {
    if (!this.interactive()) {
      return;
    }
    this.pressed.emit(event);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.interactive()) {
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.pressed.emit(event);
  }
}
