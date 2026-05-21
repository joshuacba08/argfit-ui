import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfTooltipPlacement, type AfTooltipTone } from '@argfit-ui/core';

@Component({
  selector: 'af-tooltip-desktop',
  templateUrl: './af-tooltip-desktop.component.html',
  styleUrl: './af-tooltip-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-tooltip-desktop',
    '[class]': 'hostClasses()',
    '[attr.data-open]': 'open() ? "" : null',
    '[attr.data-placement]': 'placement()',
    '[attr.data-tone]': 'tone()',
  },
})
export class AfTooltipDesktopComponent {
  readonly open = input(false, { transform: booleanAttribute });
  readonly text = input<string | undefined>(undefined);
  readonly placement = input<AfTooltipPlacement>('top');
  readonly tone = input<AfTooltipTone>('neutral');
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly tooltipLabel = computed(() => this.ariaLabel() ?? this.text() ?? 'Tooltip');
  protected readonly hostClasses = computed(() =>
    [
      'af-tooltip-desktop',
      `af-tooltip-desktop--${this.placement()}`,
      `af-tooltip-desktop--tone-${this.tone()}`,
    ].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}