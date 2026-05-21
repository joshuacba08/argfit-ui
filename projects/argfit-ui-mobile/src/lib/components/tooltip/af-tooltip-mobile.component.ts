import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfTooltipPlacement, type AfTooltipTone } from '@argfit-ui/core';

@Component({
  selector: 'af-tooltip-mobile',
  templateUrl: './af-tooltip-mobile.component.html',
  styleUrl: './af-tooltip-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-tooltip-mobile',
    '[class]': 'hostClasses()',
    '[attr.data-open]': 'open() ? "" : null',
    '[attr.data-placement]': 'placement()',
    '[attr.data-tone]': 'tone()',
  },
})
export class AfTooltipMobileComponent {
  readonly open = input(false, { transform: booleanAttribute });
  readonly text = input<string | undefined>(undefined);
  readonly placement = input<AfTooltipPlacement>('bottom');
  readonly tone = input<AfTooltipTone>('neutral');
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly tooltipLabel = computed(() => this.ariaLabel() ?? this.text() ?? 'Tooltip');
  protected readonly hostClasses = computed(() =>
    [
      'af-tooltip-mobile',
      `af-tooltip-mobile--${this.placement()}`,
      `af-tooltip-mobile--tone-${this.tone()}`,
    ].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}