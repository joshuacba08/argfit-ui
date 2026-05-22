import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfScrollPanelDirection } from '@argfit-ui/core';

@Component({
  selector: 'af-scroll-panel-mobile',
  templateUrl: './af-scroll-panel-mobile.component.html',
  styleUrl: './af-scroll-panel-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-scroll-panel-mobile',
    '[class]': 'hostClasses()',
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfScrollPanelMobileComponent {
  readonly ariaLabel = input('Scroll panel');
  readonly direction = input<AfScrollPanelDirection>('vertical');
  readonly maxHeight = input('18rem');

  protected readonly hostClasses = computed(() =>
    ['af-scroll-panel-mobile', `af-scroll-panel-mobile--${this.direction()}`].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}