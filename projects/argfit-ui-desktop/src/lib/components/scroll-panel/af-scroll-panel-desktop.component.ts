import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfScrollPanelDirection } from '@argfit-ui/core';

@Component({
  selector: 'af-scroll-panel-desktop',
  templateUrl: './af-scroll-panel-desktop.component.html',
  styleUrl: './af-scroll-panel-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-scroll-panel-desktop',
    '[class]': 'hostClasses()',
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfScrollPanelDesktopComponent {
  readonly ariaLabel = input('Scroll panel');
  readonly direction = input<AfScrollPanelDirection>('vertical');
  readonly maxHeight = input('18rem');

  protected readonly hostClasses = computed(() =>
    ['af-scroll-panel-desktop', `af-scroll-panel-desktop--${this.direction()}`].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}
